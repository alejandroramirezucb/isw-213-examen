import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  Check,
} from 'typeorm';
import { Reserva } from './Reserva';

@Entity('cancelaciones')
@Check('chk_cancelaciones_mora', 'monto_mora >= 0')
export class Cancelacion {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @OneToOne(() => Reserva, (reserva) => reserva.cancelacion)
  @JoinColumn({ name: 'id_reserva' })
  reserva!: Reserva;

  @Column({ type: 'timestamptz', default: () => 'NOW()' })
  timestamp_cancelacion!: Date;

  @Column({ type: 'text', nullable: true })
  motivo!: string | null;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: 0,
  })
  monto_mora!: number;

  @Column({ type: 'text', nullable: true })
  registrado_por!: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  creado_en!: Date;
}
