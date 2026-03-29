import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Reserva } from './Reserva';

@Entity('cancelaciones')
export class Cancelacion {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @OneToOne(() => Reserva, (reserva) => reserva.cancelacion)
  @JoinColumn({ name: 'id_reserva' })
  reserva!: Reserva;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  timestamp_cancelacion!: Date;

  @Column({ nullable: true })
  motivo!: string;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: 0,
  })
  monto_mora!: number;

  @Column({ nullable: true })
  registrado_por!: string;

  @CreateDateColumn()
  creado_en!: Date;
}
