import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Check,
} from 'typeorm';
import { TiposHabitacion } from './TiposHabitacion';
import { Reserva } from './Reserva';

export enum EstadoHabitacion {
  DISPONIBLE = 'disponible',
  OCUPADA = 'ocupada',
  MANTENIMIENTO = 'mantenimiento',
  FUERA_DE_SERVICIO = 'fuera_de_servicio',
}

@Entity('habitaciones')
@Check('chk_habitaciones_piso', 'piso >= 0')
export class Habitacion {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @Column({ type: 'text', unique: true })
  numero_habitacion!: string;

  @Column({ type: 'integer' })
  piso!: number;

  @Column({
    type: 'enum',
    enum: EstadoHabitacion,
    default: EstadoHabitacion.DISPONIBLE,
  })
  estado!: EstadoHabitacion;

  @ManyToOne(
    () => TiposHabitacion,
    (tipo_habitacion) => tipo_habitacion.habitaciones,
  )
  @JoinColumn({ name: 'id_tipo_habitacion' })
  tipo_habitacion!: TiposHabitacion;

  @CreateDateColumn({ type: 'timestamptz' })
  creado_en!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  actualizado_en!: Date;

  @OneToMany(() => Reserva, (reserva) => reserva.habitacion)
  reservas!: Reserva[];
}
