import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../../common/enums/role.enum';
import * as bcrypt from 'bcrypt';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.Asistente })
  role: Role;

  // Este "hook" se ejecuta automáticamente ANTES de insertar el usuario en la BD
  @BeforeInsert()
  async hashPassword() {
    if (!this.password) return;
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }
}