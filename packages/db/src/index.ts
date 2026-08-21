import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prismaClientGlobal: PrismaClient | undefined;
}

/**
 * Singleton Prisma Client: Tái sử dụng một connection pool duy nhất trong môi trường development (Next.js HMR)
 * để ngăn chặn tình trạng cạn kiệt kết nối PostgreSQL khi reload module liên tục.
 */
export const prisma =
  globalThis.prismaClientGlobal ??
  new PrismaClient({
    log: process.env.DEBUG_PRISMA === 'true' ? ['query', 'error', 'warn'] : ['error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaClientGlobal = prisma;
}

export * from '@prisma/client';
export {
  Role,
  MenuCategory,
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
  IngredientUnit,
  StockTransactionType,
  FamilyRelation,
  ActivityLevel,
  PaymentTransactionStatus,
} from '@prisma/client';
export type {
  User,
  MenuItem,
  Order,
  OrderItem,
  Plan,
  Subscription,
  Ingredient,
  Recipe,
  RecipeItem,
  StockTransaction,
  FamilyGroup,
  FamilyMember,
  PaymentTransaction,
} from '@prisma/client';
