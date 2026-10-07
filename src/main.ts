import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // app.useGlobalInterceptors(
  //   new ResponseInterceptor(),
  // );

  // app.useGlobalFilters(
  //   new HttpExceptionFilter(),
  // );

  // app.enableVersioning({
  //   type: VersioningType.URI,
  // });

  // app.setGlobalPrefix('api');
  app.enableCors({
    origin: true,
    credentials: true,
  });
  
  const config = new DocumentBuilder()
    .setTitle('Election Monitor API')
    .setDescription('API for monitoring election data')
    .setVersion('1.0')
    .addTag('election-monitor')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  fs.writeFileSync(
    path.join(process.cwd(), 'swagger-docs.json'),
    JSON.stringify(document, null, 2) // Pretty prints the JSON
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
