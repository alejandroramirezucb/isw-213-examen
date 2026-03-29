import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Huesped } from './Huesped';

export enum RolUsuario {
  RECEPCIONISTA = 'recepcionista',
  ADMINISTRADOR = 'administrador',
}

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  correo!: string;

  @Column({ name: 'password_hash' })
  password!: string;

  @Column({
    type: 'enum',
    enum: RolUsuario,
  })
  rol!: RolUsuario;

  @OneToOne(() => Huesped, { nullable: true })
  @JoinColumn({ name: 'id_huesped' })
  huesped!: Huesped;

  @Column()
  activo!: boolean;

  @CreateDateColumn()
  creado_en!: Date;

  @UpdateDateColumn()
  actualizado_en!: Date;
}
