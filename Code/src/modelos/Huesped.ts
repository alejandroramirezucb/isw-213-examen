import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Unique,
  Check,
} from 'typeorm';

export enum TipoDocumento {
  CARNET = 'carnet',
  CARNET_EXTRANJERO = 'carnet_extranjero',
  PASAPORTE = 'pasaporte',
  NIT = 'nit',
}

@Entity('huespedes')
@Unique('uq_huespedes_documento', ['tipo_documento', 'numero_documento'])
@Check('chk_huespedes_correo', "correo LIKE '%@%'")
export class Huesped {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @Column({
    type: 'enum',
    enum: TipoDocumento,
    default: TipoDocumento.CARNET,
  })
  tipo_documento!: TipoDocumento;

  @Column({ type: 'text' })
  numero_documento!: string;

  @Column({ type: 'text' })
  nombres!: string;

  @Column({ type: 'text' })
  apellidos!: string;

  @Column({ type: 'text' })
  correo!: string;

  @Column({ type: 'text', nullable: true })
  telefono!: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  creado_en!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  actualizado_en!: Date;
}
