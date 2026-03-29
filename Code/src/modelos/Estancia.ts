import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  Check,
} from 'typeorm';
import { Reserva } from './Reserva';

@Entity('estancias')
@Check('monto_cargo_extra >= 0')
@Check(
  'ck_checkout_consistente',
  '(timestamp_checkout IS NULL AND es_late_checkout IS NULL) OR ' +
  '(timestamp_checkout IS NOT NULL AND es_late_checkout IS NOT NULL)',
)
export class Estancia {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @OneToOne(() => Reserva, (reserva) => reserva.estancia)
  @JoinColumn({ name: 'id_reserva' })
  reserva!: Reserva;

  @Column({ type: 'timestamptz', default: () => 'NOW()' })
  timestamp_checkin!: Date;

  @Column({ type: 'text', nullable: true })
  registrado_checkin_por!: string | null;

  @Column({ type: 'text', nullable: true })
  observaciones_checkin!: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  timestamp_checkout!: Date | null;

  @Column({ nullable: true })
  es_late_checkout!: boolean | null;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: 0,
  })
  monto_cargo_extra!: number;

  @Column({ type: 'text', nullable: true })
  registrado_checkout_por!: string | null;

  @Column({ type: 'text', nullable: true })
  observaciones_checkout!: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  creado_en!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  actualizado_en!: Date;
}
