import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Reserva } from './Reserva';

@Entity('estancias')
export class Estancia {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @OneToOne(() => Reserva, (reserva) => reserva.estancia)
  @JoinColumn({ name: 'id_reserva' })
  reserva!: Reserva;

  @Column()
  timestamp_checkin!: Date;

  @Column({ nullable: true })
  registrado_checkin_por!: string;

  @Column({ nullable: true })
  observaciones_checkin!: string;

  @Column({ nullable: true })
  timestamp_checkout!: Date;

  @Column({ nullable: true })
  es_late_checkout!: boolean;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: 0,
  })
  monto_cargo_extra!: number;

  @Column({ nullable: true })
  registrado_checkout_por!: string;

  @Column({ nullable: true })
  observaciones_checkout!: string;

  @CreateDateColumn()
  creado_en!: Date;

  @UpdateDateColumn()
  actualizado_en!: Date;
}
