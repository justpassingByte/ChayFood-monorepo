import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix
  app.setGlobalPrefix('api');

  // Graceful Shutdown: Lắng nghe tín hiệu SIGTERM/SIGINT để giải phóng Prisma Pool êm ái khi container redeploy
  app.enableShutdownHooks();

  // Global Exception Filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // CORS
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      process.env.CORS_ORIGIN || '',
    ].filter(Boolean),
    credentials: true,
  });

  /**
   * Validation Pipe Chặt Chẽ (Strict Whitelist & Intrusion Detection):
   * - whitelist: true -> Chỉ giữ lại các trường được định nghĩa trong DTO.
   * - forbidNonWhitelisted: true -> Ném ngay lỗi 400 Bad Request nếu client gửi trường lạ (role, isSuperUser, balance).
   *   Giúp phát hiện sớm các đòn tấn công rà quét tham số (Parameter Tampering) và ghi vết IP kẻ tấn công vào Security Log.
   * - transform: true -> Tự động ép kiểu dữ liệu nguyên thủy sang DTO class.
   */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
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
// Reload trigger

