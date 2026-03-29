import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Reserva } from './Reserva';
import { Huesped } from './Huesped';

@Entity('reserva_huespedes')
export class ReservaHuesped {
  @PrimaryColumn({ type: 'bigint' })
  id_reserva!: number;

  @PrimaryColumn({ type: 'bigint' })
  id_huesped!: number;

  @Column({ default: false })
  es_titular!: boolean;

  @ManyToOne(() => Reserva, (reserva) => reserva.reserva_huespedes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_reserva' })
  reserva!: Reserva;

  @ManyToOne(() => Huesped)
  @JoinColumn({ name: 'id_huesped' })
  huesped!: Huesped;
}
