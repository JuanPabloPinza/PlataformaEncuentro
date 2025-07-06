import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Activa el ValidationPipe globalmente
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Ignora propiedades no definidas en el DTO
    forbidNonWhitelisted: true, // Lanza un error si se envían propiedades no permitidas
    transform: true, // Transforma los payloads a instancias de DTO
  }));

  // Lee el puerto desde el archivo .env o usa 3001 por defecto
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Auth service is running on: ${await app.getUrl()}`);
}
bootstrap();