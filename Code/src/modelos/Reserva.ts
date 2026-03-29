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
export class Reserva {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @ManyToOne(() => Habitacion, (habitacion) => habitacion.reservas)
  @JoinColumn({ name: 'id_habitacion' })
  habitacion!: Habitacion;

  @Column()
  fecha_checkin!: Date;

  @Column()
  fecha_checkout!: Date;

  @Column()
  cantidad_personas!: number;

  @Column({
    type: 'enum',
    enum: EstadoReserva,
    default: EstadoReserva.PENDIENTE,
  })
  estado!: EstadoReserva;

  @Column({ nullable: true })
  notas!: string;

  @CreateDateColumn()
  creado_en!: Date;

  @UpdateDateColumn()
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
  estancia!: Estancia;

  @OneToOne(() => Cancelacion, (cancelacion) => cancelacion.reserva, {
    nullable: true,
  })
  cancelacion!: Cancelacion;
}
