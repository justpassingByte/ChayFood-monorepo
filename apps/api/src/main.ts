import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix
  app.setGlobalPrefix('api');

  // CORS
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      process.env.CORS_ORIGIN || '',
    ].filter(Boolean),
    credentials: true,
  });

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('🌿 ChayFood NestJS API')
    .setDescription('Tài liệu API chính thức cho nền tảng ẩm thực chay ChayFood Monorepo (PostgreSQL + Prisma + NestJS)')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 5000;
  await app.listen(port);

  console.log(`\n======================================================`);
  console.log(`🌿 [NestJS] ChayFood API Server running at: http://localhost:${port}/api`);
  console.log(`📖 [Swagger] API Documentation available at: http://localhost:${port}/api/docs`);
  console.log(`======================================================\n`);
}

bootstrap();
