import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
  OneToMany,
  Check,
} from 'typeorm';
import { Habitacion } from './Habitacion';
import { ReservaHuesped } from './ReservaHuesped';
import { Estancia } from './Estancia';
import { Cancelacion } from './Cancelacion';

export enum EstadoReserva {
  PENDIENTE = 'pendiente',
  ACTIVA = 'activa',
  COMPLETADA = 'completada',
  CANCELADA = 'cancelada',
}

@Entity('reservas')
@Check('chk_reservas_fechas', 'fecha_checkout > fecha_checkin')
export class Reserva {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @ManyToOne(() => Habitacion, (habitacion) => habitacion.reservas)
  @JoinColumn({ name: 'id_habitacion' })
  habitacion!: Habitacion;

  @Column({ type: 'date' })
  fecha_checkin!: string;

  @Column({ type: 'date' })
  fecha_checkout!: string;

  @Column({ type: 'integer' })
  cantidad_personas!: number;

  @Column({
    type: 'enum',
    enum: EstadoReserva,
    default: EstadoReserva.PENDIENTE,
  })
  estado!: EstadoReserva;

  @Column({ type: 'text', nullable: true })
  notas!: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  creado_en!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  actualizado_en!: Date;

  @OneToMany(
    () => ReservaHuesped,
    (reserva_huespedes) => reserva_huespedes.reserva,
    { cascade: true },
  )
  reserva_huespedes!: ReservaHuesped[];

  @OneToOne(() => Estancia, (estancia) => estancia.reserva, {
    nullable: true,
  })
  estancia!: Estancia | null;

  @OneToOne(() => Cancelacion, (cancelacion) => cancelacion.reserva, {
    nullable: true,
  })
  cancelacion!: Cancelacion | null;
}
