import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

export enum TipoDato {
  TEXT = 'text',
  INTEGER = 'integer',
  NUMERIC = 'numeric',
  BOOLEAN = 'boolean',
  TIME = 'time',
}

@Entity('configuracion')
export class Configuracion {
  @PrimaryColumn()
  clave!: string;

  @Column()
  valor!: string;

  @Column({ nullable: true })
  descripcion!: string;

  @Column({
    type: 'enum',
    enum: TipoDato,
  })
  tipo_dato!: TipoDato;

  @UpdateDateColumn()
  actualizado_en!: Date;
}
