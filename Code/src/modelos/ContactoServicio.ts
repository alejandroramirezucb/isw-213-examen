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

  @Column({ unique: true })
  nombre_servicio!: string;

  @Column({ nullable: true })
  persona_contacto!: string;

  @Column({ nullable: true })
  telefono!: string;

  @Column({ nullable: true })
  correo!: string;

  @Column({ nullable: true })
  descripcion!: string;

  @Column({ default: true })
  activo!: boolean;

  @CreateDateColumn()
  creado_en!: Date;

  @UpdateDateColumn()
  actualizado_en!: Date;
}
