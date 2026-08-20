import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
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
} from '@prisma/client';
