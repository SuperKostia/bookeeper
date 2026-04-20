import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ trustProxy: true, logger: false }),
  );

  // Validation is done per-endpoint via ZodValidationPipe + @bookeeper/types schemas.
  app.enableCors({ origin: true, credentials: true });

  const port = Number(process.env.PORT) || 3001;
  await app.listen(port, '0.0.0.0');
  Logger.log(`API running on http://localhost:${port}`, 'Bootstrap');
}

void bootstrap();
