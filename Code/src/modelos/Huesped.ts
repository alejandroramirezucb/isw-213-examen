import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum TipoDocumento {
  CARNET = 'carnet',
  CARNETEXTRANJERO = 'carnet_extranjero',
  PASAPORTE = 'pasaporte',
  NIT = 'nit',
}

@Entity('huespedes')
export class Huesped {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'enum',
    enum: TipoDocumento,
    default: TipoDocumento.CARNET,
  })
  tipo_documento!: TipoDocumento;

  @Column()
  numero_documento!: string;

  @Column()
  nombre!: string;

  @Column()
  apellido!: string;

  @Column()
  correo!: string;

  @Column({ nullable: true })
  telefono!: string;

  @CreateDateColumn()
  creado_en!: Date;

  @UpdateDateColumn()
  actualizado_en!: Date;
}
