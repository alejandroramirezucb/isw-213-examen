import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Habitacion } from './Habitacion';

@Entity('tipos_habitacion')
export class TiposHabitacion {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: number;

  @Column({ unique: true })
  nombre!: string;

  @Column({ nullable: true })
  descripcion!: string;

  @Column()
  capacidad_maxima!: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  precio_referencia!: number;

  @CreateDateColumn()
  creado_en!: Date;

  @UpdateDateColumn()
  actualizado_en!: Date;

  @OneToMany(() => Habitacion, (habitacion) => habitacion.tipo_habitacion)
  habitaciones!: Habitacion[];
}
