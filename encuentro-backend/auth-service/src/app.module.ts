import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // 1. Carga el archivo .env y hace las variables de entorno accesibles
    ConfigModule.forRoot({
      isGlobal: true, // Hace que el ConfigModule esté disponible en toda la app
    }),

    // 2. Configura la conexión a la base de datos de forma asíncrona
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        autoLoadEntities: true, // Carga automáticamente las entidades definidas
        synchronize: true, // ¡Solo para desarrollo! Sincroniza el esquema de la BD
      }),
      inject: [ConfigService],
    }),

    // 3. Importa el módulo de autenticación que creamos
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}