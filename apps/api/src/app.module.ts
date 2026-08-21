import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MenuModule } from './menu/menu.module';
import { InventoryModule } from './inventory/inventory.module';
import { RecipesModule } from './recipes/recipes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../../.env'],
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    MenuModule,
    InventoryModule,
    RecipesModule,
  ],
})
export class AppModule {}
