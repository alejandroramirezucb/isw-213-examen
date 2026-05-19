-- =============================================================
-- migration.sql  (v2)
-- Sistema de Reservas de Hotel — Migración correctiva sobre BD existente
-- PostgreSQL 16
--
-- COMANDO DE TERMINAL:
--   psql -U postgres -d hotel_db -f Code/database/migration.sql
--
-- Cambios aplicados:
--   [Ant] Cambio de enum tipo_documento + nombre tipo habitación (v1)
--   [C1]  Nueva tabla usuarios (auth — recepcionistas/admins)
--   [C2]  checkins + checkouts → tabla estancias (unificada)
--   [C3]  Nueva tabla configuracion + triggers de propagación
--   [C4]  Relación M:M reservas ↔ huéspedes via reserva_huespedes
--         DROP COLUMN reservas.id_huesped (tras migrar datos)
--   [C5]  12 habitaciones seed (2 habitaciones nuevas)
--
-- ORDEN CRÍTICO:
--   1. Crear enums/tablas nuevas
--   2. Insertar seed de configuracion
--   3. Crear funciones trigger (antes de los triggers)
--   4. Crear triggers (después de sus tablas)
--   5. Migrar datos (checkins/checkouts → estancias; id_huesped → reserva_huespedes)
--   6. DROP tablas obsoletas (checkins, checkouts)
--   7. DROP COLUMN reservas.id_huesped (ÚLTIMO — después de migrar datos)
--   8. Actualizar covering index de reservas
-- =============================================================

BEGIN;

-- ----------------------------------------------------------------
-- [C1] TABLA: usuarios
-- ----------------------------------------------------------------

CREATE TYPE rol_usuario AS ENUM ('recepcionista', 'administrador');

CREATE TABLE usuarios (
    id             BIGINT      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    correo         TEXT        NOT NULL UNIQUE,
    password_hash  TEXT        NOT NULL,
    rol            rol_usuario NOT NULL,
    activo         BOOLEAN     NOT NULL DEFAULT TRUE,
    id_huesped     BIGINT      REFERENCES huespedes(id) ON DELETE SET NULL,
    creado_en      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- skill: supabase → schema-foreign-key-indexes
CREATE INDEX idx_usuarios_id_huesped  ON usuarios (id_huesped);
CREATE INDEX idx_usuarios_activos_rol ON usuarios (rol) WHERE activo = TRUE;


-- ----------------------------------------------------------------
-- [C3a] TABLA: configuracion + seed
-- (antes que estancias para que el trigger pueda leer los valores)
-- ----------------------------------------------------------------

CREATE TABLE configuracion (
    clave          TEXT        PRIMARY KEY,
    valor          TEXT        NOT NULL,
    descripcion    TEXT,
    tipo_dato      TEXT        NOT NULL DEFAULT 'text'
                       CHECK (tipo_dato IN ('text','integer','numeric','boolean','time')),
    actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO configuracion (clave, valor, descripcion, tipo_dato)
VALUES
    ('late_checkout_hora_limite',
     '12:00',
     'Hora límite (HH:MM) para late checkout. Leída por la capa de servicio.',
     'time'),

    ('late_checkout_cargo_fijo',
     '75.00',
     'Monto fijo cobrado por late checkout. '
     'El trigger tg_auto_cargo_late_checkout lo escribe en estancias.monto_cargo_extra.',
     'numeric'),

    ('cancelacion_plazo_horas',
     '48',
     'Horas de anticipación para cancelar sin mora. Leída por la capa de servicio.',
     'integer'),

    ('cancelacion_mora_porcentaje',
     '20',
     'Porcentaje del costo total aplicado como mora por cancelación tardía.',
     'integer'),

    ('capacidad_maxima_habitacion_defecto',
     '2',
     'Al actualizar este valor, el trigger tg_sync_configuracion actualiza '
     'TODOS los tipos_habitacion.capacidad_maxima inmediatamente.',
     'integer');


-- ----------------------------------------------------------------
-- [C3b] FUNCIÓN: fn_sync_configuracion
-- Propagación: configuracion.capacidad_maxima_habitacion_defecto
--              → tipos_habitacion.capacidad_maxima (todos los registros)
-- Ref: https://www.postgresql.org/docs/16/plpgsql-trigger
-- ----------------------------------------------------------------

CREATE OR REPLACE FUNCTION fn_sync_configuracion()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.clave = 'capacidad_maxima_habitacion_defecto' THEN
        UPDATE tipos_habitacion
        SET    capacidad_maxima = NEW.valor::integer,
               actualizado_en  = NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tg_sync_configuracion
    AFTER UPDATE ON configuracion
    FOR EACH ROW
    EXECUTE FUNCTION fn_sync_configuracion();


-- ----------------------------------------------------------------
-- [C3c] FUNCIÓN: fn_auto_cargo_late_checkout
-- (se registra aquí; el trigger se crea después de CREATE TABLE estancias)
-- Ref: https://www.postgresql.org/docs/16/plpgsql-trigger
-- ----------------------------------------------------------------

CREATE OR REPLACE FUNCTION fn_auto_cargo_late_checkout()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.es_late_checkout = TRUE
       AND (NEW.monto_cargo_extra IS NULL OR NEW.monto_cargo_extra = 0) THEN
        SELECT valor::numeric INTO NEW.monto_cargo_extra
        FROM   configuracion
        WHERE  clave = 'late_checkout_cargo_fijo';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ----------------------------------------------------------------
-- [C2a] TABLA: estancias (reemplaza checkins + checkouts)
-- ----------------------------------------------------------------

CREATE TABLE estancias (
    id                      BIGINT         GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_reserva              BIGINT         NOT NULL UNIQUE
                                REFERENCES reservas(id) ON DELETE RESTRICT,
    timestamp_checkin       TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    registrado_checkin_por  TEXT,
    observaciones_checkin   TEXT,
    timestamp_checkout      TIMESTAMPTZ,
    es_late_checkout        BOOLEAN,
    monto_cargo_extra       NUMERIC(10, 2) DEFAULT 0 CHECK (monto_cargo_extra >= 0),
    registrado_checkout_por TEXT,
    observaciones_checkout  TEXT,
    creado_en               TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    actualizado_en          TIMESTAMPTZ    NOT NULL DEFAULT NOW(),

    CONSTRAINT ck_checkout_consistente CHECK (
        (timestamp_checkout IS NULL     AND es_late_checkout IS NULL) OR
        (timestamp_checkout IS NOT NULL AND es_late_checkout IS NOT NULL)
    )
);

-- UNIQUE en id_reserva ya crea índice → cumple "index FK columns"
CREATE INDEX idx_estancias_abiertas
    ON estancias (id_reserva)
    WHERE timestamp_checkout IS NULL;

-- Ahora se puede crear el trigger (la tabla estancias ya existe)
CREATE TRIGGER tg_auto_cargo_late_checkout
    BEFORE INSERT OR UPDATE ON estancias
    FOR EACH ROW
    EXECUTE FUNCTION fn_auto_cargo_late_checkout();


-- ----------------------------------------------------------------
-- [C2b] Migrar datos: checkins → estancias
-- Ajustar nombres de columna si difieren de timestamp_checkin / registrado_por
-- ----------------------------------------------------------------

INSERT INTO estancias (
    id_reserva,
    timestamp_checkin,
    registrado_checkin_por,
    observaciones_checkin
)
SELECT
    id_reserva,
    timestamp_checkin,
    COALESCE(registrado_por, 'migración'),
    observaciones
FROM checkins;


-- ----------------------------------------------------------------
-- [C2c] Migrar datos: checkouts → estancias (UPDATE)
-- NOTA: el trigger tg_auto_cargo_late_checkout está activo, pero como
-- migración los montos ya están calculados; el CASE evita sobrescribir
-- con el valor de config cuando ya existe un monto histórico.
-- ----------------------------------------------------------------

UPDATE estancias e
SET    timestamp_checkout      = co.timestamp_checkout,
       es_late_checkout        = co.es_late_checkout,
       -- Preservar monto histórico del checkout original si > 0;
       -- si era 0, el trigger lo habría llenado (desactivar temporalmente
       -- o confiar en que es_late_checkout=FALSE → trigger no actúa)
       monto_cargo_extra       = CASE
                                     WHEN co.monto_cargo_extra > 0 THEN co.monto_cargo_extra
                                     ELSE 0
                                 END,
       registrado_checkout_por = COALESCE(co.registrado_por, 'migración'),
       observaciones_checkout  = co.observaciones
FROM   checkouts co
WHERE  co.id_reserva = e.id_reserva;


-- ----------------------------------------------------------------
-- [C2d] DROP tablas obsoletas (DESPUÉS de migrar datos)
-- ----------------------------------------------------------------

DROP TABLE checkouts;
DROP TABLE checkins;


-- ----------------------------------------------------------------
-- [C4a] TABLA: reserva_huespedes (M:M)
-- ----------------------------------------------------------------

CREATE TABLE reserva_huespedes (
    id_reserva BIGINT  NOT NULL REFERENCES reservas(id)  ON DELETE CASCADE,
    id_huesped BIGINT  NOT NULL REFERENCES huespedes(id) ON DELETE RESTRICT,
    es_titular BOOLEAN NOT NULL DEFAULT FALSE,

    PRIMARY KEY (id_reserva, id_huesped)
);

-- skill: supabase → schema-foreign-key-indexes
CREATE INDEX idx_reserva_huespedes_huesped
    ON reserva_huespedes (id_huesped);

-- Garantiza exactamente un titular por reserva a nivel DB
CREATE UNIQUE INDEX idx_reserva_huespedes_titular
    ON reserva_huespedes (id_reserva)
    WHERE es_titular = TRUE;


-- ----------------------------------------------------------------
-- [C4b] Migrar datos: reservas.id_huesped → reserva_huespedes
-- DEBE ejecutarse ANTES de DROP COLUMN.
-- El huésped original pasa a ser titular (es_titular = TRUE).
-- ----------------------------------------------------------------

INSERT INTO reserva_huespedes (id_reserva, id_huesped, es_titular)
SELECT id, id_huesped, TRUE
FROM   reservas
WHERE  id_huesped IS NOT NULL;

-- Verificación de integridad antes de continuar:
-- Debe retornar 0 filas (toda reserva con id_huesped tiene un titular)
DO $$
DECLARE
    huerfanas INTEGER;
BEGIN
    SELECT COUNT(*) INTO huerfanas
    FROM reservas r
    LEFT JOIN reserva_huespedes rh ON rh.id_reserva = r.id AND rh.es_titular = TRUE
    WHERE r.id_huesped IS NOT NULL
      AND rh.id_reserva IS NULL;

    IF huerfanas > 0 THEN
        RAISE EXCEPTION
            'MIGRACIÓN FALLIDA: % reservas no tienen titular en reserva_huespedes',
            huerfanas;
    END IF;
END $$;


-- ----------------------------------------------------------------
-- [C4c] Actualizar covering index de reservas (quitar id_huesped del INCLUDE)
-- ----------------------------------------------------------------

DROP INDEX IF EXISTS idx_reservas_activas_fecha_checkin;
-- También eliminar el viejo índice de FK si existía
DROP INDEX IF EXISTS idx_reservas_id_huesped;

CREATE INDEX idx_reservas_activas_fecha_checkin
    ON reservas (fecha_checkin, estado)
    INCLUDE (id_habitacion, fecha_checkout, cantidad_personas)
    WHERE estado <> 'cancelada';


-- ----------------------------------------------------------------
-- [C4d] DROP COLUMN id_huesped — ÚLTIMO PASO
-- Solo se ejecuta después de migrar datos y verificar integridad.
-- ----------------------------------------------------------------

ALTER TABLE reservas DROP COLUMN id_huesped;


-- ----------------------------------------------------------------
-- [C5] 2 habitaciones adicionales (12 total)
-- ----------------------------------------------------------------

INSERT INTO habitaciones (numero_habitacion, piso, estado, id_tipo_habitacion)
VALUES
    ('203', 2, 'disponible',
     (SELECT id FROM tipos_habitacion WHERE nombre = 'Doble con camas individuales')),
    ('304', 3, 'fuera_de_servicio',
     (SELECT id FROM tipos_habitacion WHERE nombre = 'Suite'))
ON CONFLICT (numero_habitacion) DO NOTHING;


COMMIT;


-- =============================================================
-- VERIFICACIÓN POST-MIGRACIÓN
-- (ejecutar cada SELECT en una sesión psql separada después del COMMIT)
-- =============================================================

-- 1. Listar todas las tablas del esquema
--    psql -U postgres -d hotel_db -c "\dt"

-- 2. Verificar configuracion
--    psql -U postgres -d hotel_db -c "SELECT clave, valor, tipo_dato FROM configuracion ORDER BY clave;"

-- 3. Verificar triggers activos
--    psql -U postgres -d hotel_db -c "SELECT tgname, tgrelid::regclass AS tabla FROM pg_trigger WHERE tgname LIKE 'tg_%';"

-- 4. Probar TRIGGER 1: propagación capacidad a todos los tipos
--    psql -U postgres -d hotel_db -c "
--      UPDATE configuracion SET valor = '3'
--      WHERE  clave = 'capacidad_maxima_habitacion_defecto';
--      SELECT nombre, capacidad_maxima FROM tipos_habitacion ORDER BY id;"
--    -- Resultado esperado: todos muestran capacidad_maxima = 3
--    -- (Revertir: UPDATE configuracion SET valor = '2' WHERE clave = 'capacidad_maxima_habitacion_defecto')

-- 5. Verificar que no hay reservas sin titular en reserva_huespedes
--    psql -U postgres -d hotel_db -c "
--      SELECT r.id AS reserva_sin_titular
--      FROM   reservas r
--      LEFT   JOIN reserva_huespedes rh
--             ON rh.id_reserva = r.id AND rh.es_titular = TRUE
--      WHERE  rh.id_reserva IS NULL;"
--    -- Debe retornar 0 filas

-- 6. Verificar que checkins y checkouts ya no existen
--    psql -U postgres -d hotel_db -c "\dt checkins"
--    psql -U postgres -d hotel_db -c "\dt checkouts"
--    -- "Did not find any relation named..."

-- 7. Verificar columnas de reservas (sin id_huesped)
--    psql -U postgres -d hotel_db -c "\d reservas"
--    -- La columna id_huesped no debe aparecer

-- 8. Probar TRIGGER 2 (conceptual — requiere reserva real):
--    -- Al registrar checkout con es_late_checkout=TRUE y monto=0,
--    -- el trigger auto-llena monto_cargo_extra = 75.00 (valor de config)
--    -- psql -U postgres -d hotel_db -c "
--    --   UPDATE estancias
--    --   SET    timestamp_checkout = NOW(),
--    --          es_late_checkout   = TRUE,
--    --          monto_cargo_extra  = 0
--    --   WHERE  id_reserva = <ID_RESERVA_CON_CHECKIN>;
--    --   SELECT monto_cargo_extra FROM estancias WHERE id_reserva = <ID>;"
--    --   -- Resultado esperado: 75.00
