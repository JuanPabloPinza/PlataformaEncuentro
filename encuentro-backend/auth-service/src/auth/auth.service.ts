import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { User } from '../users/entities/user.entity';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerUserDto: RegisterUserDto) {
    const { email, password, role } = registerUserDto;

    // Verificar si el usuario ya existe
    const existingUser = await this.userRepository.findOneBy({ email });
    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está en uso');
    }

    // Crear nueva instancia de usuario (la contraseña se hasheará por el hook de la entidad)
    const user = this.userRepository.create({ email, password, role });

    // Guardar el usuario en la base de datos
    await this.userRepository.save(user);

    // Omitir la contraseña del objeto de respuesta
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    // Buscar al usuario por email
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Comparar la contraseña proporcionada con la hasheada
    const isPasswordMatching = await bcrypt.compare(password, user.password);
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Generar el payload del JWT
    const payload = { sub: user.id, email: user.email, role: user.role };

    return {
      message: 'Login exitoso',
      accessToken: this.jwtService.sign(payload),
    };
  }
}