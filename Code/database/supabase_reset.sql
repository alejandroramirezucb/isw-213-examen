-- =============================================================
-- supabase_reset.sql  (FIXED ORDER)
-- Sistema de Reservas de Hotel — Reset + Schema completo
-- PostgreSQL 16 / Supabase
--
-- ORDEN CRÍTICO DE CREACIÓN:
--   1. EXTENSIONES
--   2. TIPOS ENUMERADOS
--   3. TABLAS (en orden de dependencias: sin FK primero)
--   4. TABLA configuracion (DEBE ESTAR ANTES DE TRIGGERS)
--   5. FUNCIONES (que necesitan tablas existentes)
--   6. TRIGGERS
--   7. SEED DATA
-- =============================================================


-- ============================================================
-- PARTE 1 — LIMPIEZA: borrar todo lo anterior
--
-- NOTA: NO se usan DROP TRIGGER explícitos porque requieren que
-- la tabla exista — si la tabla no existe (BD limpia) lanza
-- ERROR 42P01. Los triggers se eliminan automáticamente con
-- DROP TABLE ... CASCADE, que sí usa IF EXISTS de forma segura.
-- ============================================================

-- Funciones (CASCADE elimina también los triggers que las usan)
DROP FUNCTION IF EXISTS fn_auto_cargo_late_checkout() CASCADE;
DROP FUNCTION IF EXISTS fn_sync_configuracion()       CASCADE;

-- Tablas en orden inverso de dependencias (CASCADE borra triggers, índices y FK)
DROP TABLE IF EXISTS configuracion       CASCADE;
DROP TABLE IF EXISTS cancelaciones       CASCADE;
DROP TABLE IF EXISTS estancias           CASCADE;
DROP TABLE IF EXISTS reserva_huespedes   CASCADE;
DROP TABLE IF EXISTS usuarios            CASCADE;
DROP TABLE IF EXISTS reservas            CASCADE;
DROP TABLE IF EXISTS huespedes           CASCADE;
DROP TABLE IF EXISTS habitaciones        CASCADE;
DROP TABLE IF EXISTS tipos_habitacion    CASCADE;
DROP TABLE IF EXISTS contactos_servicios CASCADE;
-- Tablas del schema antiguo (por si aún existen en Supabase)
DROP TABLE IF EXISTS checkouts           CASCADE;
DROP TABLE IF EXISTS checkins            CASCADE;

-- Tipos enumerados
DROP TYPE IF EXISTS rol_usuario         CASCADE;
DROP TYPE IF EXISTS tipo_documento      CASCADE;
DROP TYPE IF EXISTS estado_habitacion   CASCADE;
DROP TYPE IF EXISTS estado_reserva      CASCADE;


-- ============================================================
-- PARTE 2 — RECREACIÓN: en ORDEN CORRECTO
-- ============================================================

-- ================================================================
-- EXTENSIONES
-- ================================================================

CREATE EXTENSION IF NOT EXISTS btree_gist;
CREATE EXTENSION IF NOT EXISTS pg_trgm;


-- ================================================================
-- TIPOS ENUMERADOS
-- ================================================================

CREATE TYPE estado_reserva AS ENUM (
    'pendiente', 'activa', 'completada', 'cancelada'
);

CREATE TYPE estado_habitacion AS ENUM (
    'disponible', 'ocupada', 'mantenimiento', 'fuera_de_servicio'
);

CREATE TYPE tipo_documento AS ENUM (
    'carnet', 'pasaporte', 'carnet_extranjero', 'nit'
);

CREATE TYPE rol_usuario AS ENUM (
    'recepcionista', 'administrador'
);


-- ================================================================
-- TABLAS (SIN FK — PRIMERO)
-- ================================================================

CREATE TABLE tipos_habitacion (
    id                BIGINT         GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre            TEXT           NOT NULL,
    descripcion       TEXT,
    capacidad_maxima  INT            NOT NULL CHECK (capacidad_maxima > 0),
    precio_referencia NUMERIC(10, 2) NOT NULL CHECK (precio_referencia > 0),
    creado_en         TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    actualizado_en    TIMESTAMPTZ    NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_tipos_habitacion_nombre UNIQUE (nombre)
);

COMMENT ON TABLE tipos_habitacion IS
    'Catálogo de tipos de habitación. '
    'capacidad_maxima es actualizada via trigger desde configuracion.';


CREATE TABLE habitaciones (
    id                 BIGINT            GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    numero_habitacion  TEXT              NOT NULL,
    piso               INT               NOT NULL CHECK (piso >= 0),
    estado             estado_habitacion NOT NULL DEFAULT 'disponible',
    id_tipo_habitacion BIGINT            NOT NULL
                           REFERENCES tipos_habitacion(id) ON DELETE RESTRICT,
    creado_en          TIMESTAMPTZ       NOT NULL DEFAULT NOW(),
    actualizado_en     TIMESTAMPTZ       NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_habitaciones_numero UNIQUE (numero_habitacion)
);

CREATE INDEX idx_habitaciones_id_tipo ON habitaciones (id_tipo_habitacion);


CREATE TABLE huespedes (
    id               BIGINT         GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tipo_documento   tipo_documento NOT NULL,
    numero_documento TEXT           NOT NULL,
    nombres          TEXT           NOT NULL,
    apellidos        TEXT           NOT NULL,
    correo           TEXT           NOT NULL,
    telefono         TEXT,
    creado_en        TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    actualizado_en   TIMESTAMPTZ    NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_huespedes_documento
        UNIQUE (tipo_documento, numero_documento),

    CONSTRAINT chk_huespedes_correo
        CHECK (correo LIKE '%@%')
);

CREATE INDEX idx_huespedes_nombres_trgm
    ON huespedes USING gin (nombres gin_trgm_ops);

CREATE INDEX idx_huespedes_apellidos_trgm
    ON huespedes USING gin (apellidos gin_trgm_ops);

CREATE INDEX idx_huespedes_documento_trgm
    ON huespedes USING gin (numero_documento gin_trgm_ops);

CREATE INDEX idx_huespedes_apellidos_nombres
    ON huespedes (apellidos, nombres)
    INCLUDE (id, tipo_documento, numero_documento, correo, telefono);


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

CREATE INDEX idx_usuarios_id_huesped  ON usuarios (id_huesped);
CREATE INDEX idx_usuarios_activos_rol ON usuarios (rol) WHERE activo = TRUE;


CREATE TABLE contactos_servicios (
    id               BIGINT      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre_servicio  TEXT        NOT NULL,
    persona_contacto TEXT,
    telefono         TEXT,
    correo           TEXT,
    descripcion      TEXT,
    activo           BOOLEAN     NOT NULL DEFAULT TRUE,
    creado_en        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actualizado_en   TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_contactos_servicios_nombre UNIQUE (nombre_servicio),
    CONSTRAINT chk_contactos_correo
        CHECK (correo IS NULL OR correo LIKE '%@%')
);

CREATE INDEX idx_contactos_activos
    ON contactos_servicios (nombre_servicio)
    WHERE activo = TRUE;


-- ================================================================
-- TABLA: configuracion
-- DEBE CREARSE ANTES DE LAS FUNCIONES TRIGGER QUE LA REFERENCIAN
-- ================================================================

CREATE TABLE configuracion (
    clave          TEXT        PRIMARY KEY,
    valor          TEXT        NOT NULL,
    descripcion    TEXT,
    tipo_dato      TEXT        NOT NULL DEFAULT 'text'
                       CHECK (tipo_dato IN ('text','integer','numeric','boolean','time')),
    actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE configuracion IS
    'Configuración global del hotel (key-value). '
    'Cambios en ciertas claves se propagan via triggers.';


-- ================================================================
-- TABLAS (CON FK — DESPUÉS)
-- ================================================================

CREATE TABLE reservas (
    id                BIGINT         GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_habitacion     BIGINT         NOT NULL
                          REFERENCES habitaciones(id) ON DELETE RESTRICT,
    fecha_checkin     DATE           NOT NULL,
    fecha_checkout    DATE           NOT NULL,
    cantidad_personas INT            NOT NULL CHECK (cantidad_personas > 0),
    estado            estado_reserva NOT NULL DEFAULT 'pendiente',
    notas             TEXT,
    creado_en         TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    actualizado_en    TIMESTAMPTZ    NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_reservas_fechas
        CHECK (fecha_checkout > fecha_checkin),

    CONSTRAINT excl_reservas_sin_solapamiento
        EXCLUDE USING gist (
            id_habitacion WITH =,
            daterange(fecha_checkin, fecha_checkout, '[)') WITH &&
        ) WHERE (estado <> 'cancelada')

) WITH (fillfactor = 90);

CREATE INDEX idx_reservas_id_habitacion ON reservas (id_habitacion);
CREATE INDEX idx_reservas_estado        ON reservas (estado);
CREATE INDEX idx_reservas_activas_fecha_checkin
    ON reservas (fecha_checkin, estado)
    INCLUDE (id_habitacion, fecha_checkout, cantidad_personas)
    WHERE estado <> 'cancelada';
CREATE INDEX idx_reservas_habitacion_fechas
    ON reservas (id_habitacion, fecha_checkin, fecha_checkout)
    WHERE estado <> 'cancelada';


CREATE TABLE reserva_huespedes (
    id_reserva BIGINT  NOT NULL REFERENCES reservas(id)  ON DELETE CASCADE,
    id_huesped BIGINT  NOT NULL REFERENCES huespedes(id) ON DELETE RESTRICT,
    es_titular BOOLEAN NOT NULL DEFAULT FALSE,

    PRIMARY KEY (id_reserva, id_huesped)
);

CREATE INDEX idx_reserva_huespedes_huesped
    ON reserva_huespedes (id_huesped);

CREATE UNIQUE INDEX idx_reserva_huespedes_titular
    ON reserva_huespedes (id_reserva)
    WHERE es_titular = TRUE;


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

COMMENT ON TABLE estancias IS
    'Unifica checkin + checkout (1:1 con reservas). '
    'monto_cargo_extra se auto-llena via trigger desde configuracion.late_checkout_cargo_fijo.';

CREATE INDEX idx_estancias_abiertas
    ON estancias (id_reserva)
    WHERE timestamp_checkout IS NULL;


CREATE TABLE cancelaciones (
    id                    BIGINT         GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_reserva            BIGINT         NOT NULL
                              REFERENCES reservas(id) ON DELETE RESTRICT,
    timestamp_cancelacion TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    motivo                TEXT,
    monto_mora            NUMERIC(10, 2) NOT NULL DEFAULT 0
                              CHECK (monto_mora >= 0),
    registrado_por        TEXT,
    creado_en             TIMESTAMPTZ    NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_cancelaciones_reserva UNIQUE (id_reserva)
);

CREATE INDEX idx_cancelaciones_id_reserva ON cancelaciones (id_reserva);


-- ================================================================
-- FUNCIONES TRIGGER
-- (configuracion YA EXISTE — safe to reference)
-- ================================================================

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


-- ================================================================
-- TRIGGERS
-- ================================================================

CREATE TRIGGER tg_sync_configuracion
    AFTER UPDATE ON configuracion
    FOR EACH ROW
    EXECUTE FUNCTION fn_sync_configuracion();

CREATE TRIGGER tg_auto_cargo_late_checkout
    BEFORE INSERT OR UPDATE ON estancias
    FOR EACH ROW
    EXECUTE FUNCTION fn_auto_cargo_late_checkout();


-- ============================================================
-- PARTE 3 — DATOS SEMILLA
-- ============================================================

INSERT INTO tipos_habitacion (nombre, descripcion, capacidad_maxima, precio_referencia)
VALUES
    ('Simple', 'Habitación individual con cama simple, baño privado y escritorio de trabajo.', 1, 150.00),
    ('Doble con camas individuales', 'Habitación con dos camas individuales, ideal para compañeros de viaje o familiares.', 2, 220.00),
    ('Doble matrimonial', 'Habitación con cama matrimonial king-size, baño privado con tina y vista al jardín.', 2, 280.00),
    ('Suite', 'Suite de lujo con sala de estar separada, jacuzzi, minibar, caja fuerte y vista panorámica.', 4, 580.00);


INSERT INTO habitaciones (numero_habitacion, piso, estado, id_tipo_habitacion)
VALUES
    ('101', 1, 'disponible',        (SELECT id FROM tipos_habitacion WHERE nombre = 'Simple')),
    ('102', 1, 'disponible',        (SELECT id FROM tipos_habitacion WHERE nombre = 'Simple')),
    ('103', 1, 'mantenimiento',     (SELECT id FROM tipos_habitacion WHERE nombre = 'Simple')),
    ('201', 2, 'disponible',        (SELECT id FROM tipos_habitacion WHERE nombre = 'Doble con camas individuales')),
    ('202', 2, 'disponible',        (SELECT id FROM tipos_habitacion WHERE nombre = 'Doble con camas individuales')),
    ('203', 2, 'disponible',        (SELECT id FROM tipos_habitacion WHERE nombre = 'Doble con camas individuales')),
    ('204', 2, 'disponible',        (SELECT id FROM tipos_habitacion WHERE nombre = 'Doble matrimonial')),
    ('205', 2, 'ocupada',           (SELECT id FROM tipos_habitacion WHERE nombre = 'Doble matrimonial')),
    ('301', 3, 'disponible',        (SELECT id FROM tipos_habitacion WHERE nombre = 'Suite')),
    ('302', 3, 'disponible',        (SELECT id FROM tipos_habitacion WHERE nombre = 'Suite')),
    ('303', 3, 'disponible',        (SELECT id FROM tipos_habitacion WHERE nombre = 'Suite')),
    ('304', 3, 'fuera_de_servicio', (SELECT id FROM tipos_habitacion WHERE nombre = 'Suite'));


INSERT INTO contactos_servicios (nombre_servicio, persona_contacto, telefono, correo, descripcion)
VALUES
    ('Restaurante El Mirador', 'Chef María Quispe', '+51 1 234-5678', 'restaurante@hotel.com', 'Restaurante principal. Desayuno, almuerzo y cena. Horario: 06:00–22:00.'),
    ('Spa & Bienestar', 'Lucía Flores', '+51 1 234-5679', 'spa@hotel.com', 'Masajes, tratamientos faciales, sauna y piscina termal. Reserva previa recomendada.'),
    ('Lavandería Express', 'Roberto Salas', '+51 1 234-5680', 'lavanderia@hotel.com', 'Lavado y planchado. Entrega en 24 horas o servicio exprés en 4 horas.'),
    ('Transporte y Traslados', 'Carlos Mamani', '+51 1 234-5681', 'transporte@hotel.com', 'Traslados al aeropuerto, tours locales y alquiler de vehículos con conductor.'),
    ('Room Service', 'Ana Torres', '+51 1 234-5682', 'roomservice@hotel.com', 'Servicio a la habitación disponible las 24 horas con menú completo.'),
    ('Concierge', 'Diego Paredes', '+51 1 234-5683', 'concierge@hotel.com', 'Reservas en restaurantes externos, entradas a atracciones y servicios personalizados.');


INSERT INTO configuracion (clave, valor, descripcion, tipo_dato)
VALUES
    ('late_checkout_hora_limite', '12:00', 'Hora límite (HH:MM) para late checkout. Leída por la capa de servicio.', 'time'),
    ('late_checkout_cargo_fijo', '75.00', 'Monto fijo cobrado por late checkout. El trigger tg_auto_cargo_late_checkout lo escribe en estancias.monto_cargo_extra.', 'numeric'),
    ('cancelacion_plazo_horas', '48', 'Horas de anticipación para cancelar sin mora. Leída por la capa de servicio.', 'integer'),
    ('cancelacion_mora_porcentaje', '20', 'Porcentaje del costo total aplicado como mora por cancelación tardía.', 'integer'),
    ('capacidad_maxima_habitacion_defecto', '2', 'Al actualizar este valor, el trigger tg_sync_configuracion actualiza TODOS los tipos_habitacion.capacidad_maxima inmediatamente.', 'integer');


-- ============================================================
-- FIN
-- ============================================================
