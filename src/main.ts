import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { ValidationPipe } from '@nestjs/common';

const port = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('ITSM backend')
    .setDescription('ITSM backend documentation')
    .setVersion('1.0')
    .addTag('itsm')
    .build();
  
  const doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, doc);

  app.enableCors({
    origin: '*',
  });

  // Use the global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  app.useGlobalPipes(
    new ValidationPipe({
        whitelist: true, // Strip out properties that are not in the DTO
        forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are included
        transform: true, // Automatically transform payloads to match the DTO class
    }),
  );

  console.log(process.env.PORT);

  await app.listen(port, "0.0.0.0");
}
bootstrap();
