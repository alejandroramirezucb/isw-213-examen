import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('contactos_servicios')
export class ContactoServicio {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @Column({ type: 'text', unique: true })
  nombre_servicio!: string;

  @Column({ type: 'text', nullable: true })
  persona_contacto!: string;

  @Column({ type: 'text', nullable: true })
  telefono!: string;

  @Column({ type: 'text', nullable: true })
  correo!: string;

  @Column({ type: 'text', nullable: true })
  descripcion!: string;

  @Column({ type: 'boolean', default: true })
  activo!: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  creado_en!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  actualizado_en!: Date;
}
