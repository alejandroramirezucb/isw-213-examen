import { Column, Entity, PrimaryColumn, UpdateDateColumn, Check } from 'typeorm';

// Enum solo para type-safety en TypeScript — en la BD es TEXT con CHECK constraint
export enum TipoDato {
  TEXT = 'text',
  INTEGER = 'integer',
  NUMERIC = 'numeric',
  BOOLEAN = 'boolean',
  TIME = 'time',
}

@Entity('configuracion')
@Check(
  'chk_configuracion_tipo_dato',
  "tipo_dato IN ('text','integer','numeric','boolean','time')",
)
export class Configuracion {
  @PrimaryColumn({ type: 'text' })
  clave!: string;

  @Column({ type: 'text' })
  valor!: string;

  @Column({ type: 'text', nullable: true })
  descripcion!: string | null;

  @Column({ type: 'text', default: TipoDato.TEXT })
  tipo_dato!: TipoDato;

  @UpdateDateColumn({ type: 'timestamptz' })
  actualizado_en!: Date;
}
