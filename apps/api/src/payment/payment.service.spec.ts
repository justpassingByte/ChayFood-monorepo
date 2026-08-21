import { PaymentService } from './payment.service';
import { PaymentProviderFactory } from './payment.factory';
import { PrismaService } from '../prisma/prisma.service';
import {
  PaymentStatus,
  OrderStatus,
  PaymentTransactionStatus,
} from '@chayfood/shared-types';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('PaymentService (Orchestration & Idempotency)', () => {
  let service: PaymentService;
  let mockPrisma: {
    order: { findUnique: jest.Mock; findFirst: jest.Mock; update: jest.Mock };
    paymentTransaction: { create: jest.Mock; findUnique: jest.Mock; findFirst: jest.Mock; update: jest.Mock };
    $transaction: jest.Mock;
  };
  let mockFactory: {
    getProvider: jest.Mock;
    getProviderByName: jest.Mock;
  };
  let mockProvider: {
    providerType: string;
    createPaymentIntent: jest.Mock;
    verifyWebhook: jest.Mock;
  };

  beforeEach(() => {
    mockProvider = {
      providerType: 'sepay',
      createPaymentIntent: jest.fn().mockResolvedValue({
        transactionId: 'tx_123',
        status: PaymentTransactionStatus.PENDING,
        qrUrl: 'https://img.vietqr.io/test.png',
        transferContent: 'CF 21082026 5',
      }),
      verifyWebhook: jest.fn(),
    };

    mockFactory = {
      getProvider: jest.fn().mockReturnValue(mockProvider),
      getProviderByName: jest.fn().mockReturnValue(mockProvider),
    };

    mockPrisma = {
      order: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
      },
      paymentTransaction: {
        create: jest.fn().mockResolvedValue({ id: 'ptx_1' }),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
      },
      $transaction: jest.fn((callback: (tx: typeof mockPrisma) => Promise<unknown>) => callback(mockPrisma)),
    };

    service = new PaymentService(
      mockPrisma as unknown as PrismaService,
      mockFactory as unknown as PaymentProviderFactory,
    );
  });

  describe('createPaymentIntent', () => {
    it('phải tạo payment intent và lưu bản ghi PaymentTransaction', async () => {
      mockPrisma.order.findUnique.mockResolvedValue({
        id: 'order-1',
        orderNumber: 'CF-123456',
        sequenceNumber: 5,
        totalAmount: 150000,
        paymentStatus: PaymentStatus.PENDING,
        paymentMethod: 'BANKING',
        createdAt: new Date('2026-08-21T10:00:00Z'),
        user: { name: 'Thắng', email: 'thang@chayfood.com' },
      });

      const result = await service.createPaymentIntent('order-1');

      expect(mockFactory.getProvider).toHaveBeenCalledWith('BANKING');
      expect(mockProvider.createPaymentIntent).toHaveBeenCalled();
      expect(mockPrisma.paymentTransaction.create).toHaveBeenCalled();
      expect(result.qrUrl).toBe('https://img.vietqr.io/test.png');
      expect(result.transferContent).toBe('CF 21082026 5');
    });

    it('phải ném NotFoundException nếu orderId không tồn tại', async () => {
      mockPrisma.order.findUnique.mockResolvedValue(null);
      await expect(service.createPaymentIntent('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('handleWebhook (RULE-INT-002 Idempotency)', () => {
    it('phải trả về Idempotent nếu webhook transactionId đã được xử lý trước đó', async () => {
      mockProvider.verifyWebhook.mockResolvedValue({
        isValid: true,
        transactionId: 'sepay_tx_999',
        amount: 150000,
        content: 'CF 21082026 5',
      });

      mockPrisma.paymentTransaction.findUnique.mockResolvedValue({
        id: 'ptx_999',
        status: PaymentTransactionStatus.COMPLETED,
      });

      const result = await service.handleWebhook('sepay', { id: 999 });

      expect(result.received).toBe(true);
      expect(result.message).toContain('Idempotent');
      expect(mockPrisma.order.update).not.toHaveBeenCalled();
    });

    it('phải ném BadRequestException nếu chữ ký webhook không hợp lệ', async () => {
      mockProvider.verifyWebhook.mockResolvedValue({
        isValid: false,
      });

      await expect(service.handleWebhook('sepay', { id: 999 })).rejects.toThrow(BadRequestException);
    });
  });
});
