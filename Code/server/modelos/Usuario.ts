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
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @Column({ name: 'correo', type: 'text', unique: true })
  correo_auth!: string;

  @Column({ name: 'password_hash', type: 'text' })
  password!: string;

  @Column({
    type: 'enum',
    enum: RolUsuario,
  })
  rol!: RolUsuario;

  @Column({ default: true })
  activo!: boolean;

  @OneToOne(() => Huesped, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_huesped' })
  huesped!: Huesped | null;

  @CreateDateColumn({ type: 'timestamptz' })
  creado_en!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  actualizado_en!: Date;
}
