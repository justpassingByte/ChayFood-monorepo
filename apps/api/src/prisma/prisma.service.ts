import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@chayfood/db';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: process.env.DEBUG_PRISMA === 'true' ? ['query', 'error', 'warn'] : ['error', 'warn'],
    });
  }

  async onModuleInit() {
    await this.$connect();
    console.log('🐘 [PrismaService] Đã kết nối PostgreSQL thành công!');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('🐘 [PrismaService] Đã ngắt kết nối PostgreSQL.');
  }
}
