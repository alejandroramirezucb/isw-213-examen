import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Reserva } from './Reserva';
import { Huesped } from './Huesped';

@Entity('reserva_huespedes')
@Index('idx_reserva_huespedes_titular', ['id_reserva'], {
  unique: true,
  where: 'es_titular = TRUE',
})
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

  @ManyToOne(() => Huesped, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'id_huesped' })
  huesped!: Huesped;
}
