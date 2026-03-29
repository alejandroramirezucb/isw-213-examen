import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
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
export class Habitacion {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @Column({ unique: true })
  numero_habitacion!: string;

  @Column()
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

  @CreateDateColumn()
  creado_en!: Date;

  @UpdateDateColumn()
  actualizado_en!: Date;

  @OneToMany(() => Reserva, (reserva) => reserva.habitacion)
  reservas!: Reserva[];
}
