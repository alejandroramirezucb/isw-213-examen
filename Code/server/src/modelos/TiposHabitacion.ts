import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
  Check,
} from 'typeorm';
import { Habitacion } from './Habitacion';

@Entity('tipos_habitacion')
@Check('chk_tipos_habitacion_capacidad', 'capacidad_maxima > 0')
@Check('chk_tipos_habitacion_precio', 'precio_referencia > 0')
export class TiposHabitacion {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @Column({ type: 'text', unique: true })
  nombre!: string;

  @Column({ type: 'text', nullable: true })
  descripcion!: string | null;

  @Column({ type: 'integer' })
  capacidad_maxima!: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  precio_referencia!: number;

  @CreateDateColumn({ type: 'timestamptz' })
  creado_en!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  actualizado_en!: Date;

  @OneToMany(() => Habitacion, (habitacion) => habitacion.tipo_habitacion)
  habitaciones!: Habitacion[];
}
