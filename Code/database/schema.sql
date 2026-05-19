-- =============================================================
-- schema.sql  (v3)
-- Sistema de Reservas de Hotel — Prototipo Académico
-- PostgreSQL 16
--
-- Skills aplicadas:
--   • postgresql-table-design   (3NF, tipos, índices, constraints, triggers)
--   • postgresql-optimization   (pg_trgm, fillfactor, covering indexes)
--   • supabase-postgres-best-practices (schema-*, query-*)
--
-- Documentación de referencia (Context7 / PostgreSQL 16 docs):
--   • https://www.postgresql.org/docs/16/ddl-constraints          — EXCLUDE
--   • https://www.postgresql.org/docs/16/indexes-index-only-scans — INCLUDE
--   • https://www.postgresql.org/docs/16/pgtrgm                   — pg_trgm GIN
--   • https://www.postgresql.org/docs/16/sql-createindex          — fillfactor
--   • https://www.postgresql.org/docs/16/plpgsql-trigger          — triggers plpgsql
--
-- Normalización:
--   1NF — Atributos atómicos, sin grupos repetidos, PK simple por tabla.
--   2NF — PKs de columna única → sin dependencias parciales posibles.
--   3NF — Sin dependencias transitivas:
--         • precio/capacidad viven en tipos_habitacion (no en reservas).
--         • monto_cargo_extra calculado por trigger desde configuracion.
--         • huespedes (datos de dominio) separado de usuarios (auth).
--
-- Convenciones (skill: postgresql-table-design):
--   • snake_case minúsculas en todos los identificadores.
--   • BIGINT GENERATED ALWAYS AS IDENTITY → PK (no SERIAL).
--   • TIMESTAMPTZ para todo timestamp (nunca TIMESTAMP sin TZ).
--   • NUMERIC(10,2) para montos monetarios (nunca FLOAT ni MONEY).
--   • TEXT para cadenas (no VARCHAR(n) ni CHAR(n)).
--   • Índices manuales en FK — PostgreSQL NO los crea automáticamente.
--
-- Resumen de tablas:
--   tipos_habitacion    Catálogo de tipos (HU-05)
--   habitaciones        Inventario físico
--   huespedes           Registro de huéspedes (HU-01) — entidad de DOMINIO
--   usuarios            Autenticación del sistema (recepcionistas/admins)
--   reservas            Reservas habitacion+fechas (HU-02, HU-03)
--   reserva_huespedes   M:M reservas ↔ huéspedes
--   estancias           Checkin + Checkout unificados (HU-04, HU-08)
--   cancelaciones       Cancelaciones con mora (HU-07)
--   contactos_servicios Directorio del hotel (HU-06)
--   configuracion       Configuración global con propagación via triggers
-- =============================================================


-- ============================================================
-- EXTENSIONES
-- ============================================================

-- btree_gist: combina escalares (BIGINT) con tipos de rango en
-- la restricción EXCLUDE USING gist de la tabla reservas.
-- Ref: https://www.postgresql.org/docs/16/rangetypes
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- pg_trgm: índices GIN de trigramas para búsqueda difusa de texto.
-- Habilita búsqueda por nombre/apellido/documento (HU-09, HU-10).
-- Ref: https://www.postgresql.org/docs/16/pgtrgm
CREATE EXTENSION IF NOT EXISTS pg_trgm;


-- ============================================================
-- TIPOS ENUMERADOS
-- skill: postgresql-table-design → "CREATE TYPE AS ENUM for stable sets"
-- ============================================================

-- Ciclo de vida de una reserva
CREATE TYPE estado_reserva AS ENUM (
    'pendiente',    -- Creada; sin check-in todavía
    'activa',       -- Huésped realizó check-in
    'completada',   -- Check-out registrado; estancia cerrada
    'cancelada'     -- Cancelada antes o durante la estancia
);

-- Estado operativo de una habitación física
CREATE TYPE estado_habitacion AS ENUM (
    'disponible',
    'ocupada',
    'mantenimiento',
    'fuera_de_servicio'
);

-- Tipos de documento de identidad aceptados en el registro
CREATE TYPE tipo_documento AS ENUM (
    'carnet',
    'pasaporte',
    'carnet_extranjero',
    'nit'
);

-- Roles del sistema de autenticación del hotel
-- skill: postgresql-table-design → single-table discriminator cuando tipos
-- comparten 100% de atributos (correo, password_hash, activo, timestamps)
CREATE TYPE rol_usuario AS ENUM (
    'recepcionista',
    'administrador'
);


-- ============================================================
-- TABLA: tipos_habitacion
-- Catálogo de variaciones de habitación (HU-05).
-- Almacena capacidad y precio base para satisfacer 3NF:
-- estos atributos dependen del tipo, no de la habitación física.
--
-- La columna capacidad_maxima puede ser actualizada masivamente
-- mediante el trigger tg_sync_configuracion cuando cambia la
-- clave 'capacidad_maxima_habitacion_defecto' en configuracion.
-- ============================================================
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
    'Catálogo de tipos de habitación. Define capacidad y precio base por noche. '
    'Precargados: Simple, Doble con camas individuales, Doble matrimonial, Suite. '
    'capacidad_maxima es actualizada masivamente por el trigger tg_sync_configuracion '
    'cuando cambia configuracion.capacidad_maxima_habitacion_defecto.';

COMMENT ON COLUMN tipos_habitacion.capacidad_maxima IS
    'Máximo de personas. Actualizable masivamente via trigger desde configuracion.';
COMMENT ON COLUMN tipos_habitacion.precio_referencia IS
    'Precio base por noche. NUMERIC(10,2) para aritmética exacta — nunca FLOAT.';


-- ============================================================
-- TABLA: habitaciones
-- Inventario físico de habitaciones del hotel.
-- Referencia tipos_habitacion para obtener capacidad y precio (3NF).
-- ============================================================
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

COMMENT ON TABLE habitaciones IS
    'Inventario físico de habitaciones. Cada habitación pertenece a un tipo '
    'que define su capacidad máxima y precio de referencia (3NF).';

COMMENT ON COLUMN habitaciones.estado IS
    'Estado operativo: disponible, ocupada, mantenimiento, fuera_de_servicio.';

-- skill: supabase → schema-foreign-key-indexes
-- "PostgreSQL does not auto-index foreign key columns"
CREATE INDEX idx_habitaciones_id_tipo ON habitaciones (id_tipo_habitacion);


-- ============================================================
-- TABLA: huespedes
-- Registro de huéspedes del hotel (HU-01). ENTIDAD DE DOMINIO.
-- NO es una tabla de autenticación — ver tabla usuarios.
-- Clave natural compuesta (tipo_documento, numero_documento).
-- ============================================================
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

    -- 'carnet' + '12345678' y 'pasaporte' + '12345678' son personas distintas
    CONSTRAINT uq_huespedes_documento
        UNIQUE (tipo_documento, numero_documento),

    CONSTRAINT chk_huespedes_correo
        CHECK (correo LIKE '%@%')
);

COMMENT ON TABLE huespedes IS
    'Registro de huéspedes del hotel (entidad de dominio, NO de autenticación). '
    'UNIQUE(tipo_documento, numero_documento) impide duplicados (HU-01). '
    'Para login al sistema ver tabla usuarios con FK opcional id_huesped.';

COMMENT ON COLUMN huespedes.tipo_documento IS
    'Tipo de documento: carnet, pasaporte, carnet_extranjero, nit.';
COMMENT ON COLUMN huespedes.numero_documento IS
    'Número del documento. Junto con tipo_documento forma la clave natural única.';

-- skill: postgresql-optimization → pg_trgm GIN para búsqueda difusa (HU-09)
-- Ref: https://www.postgresql.org/docs/16/pgtrgm
CREATE INDEX idx_huespedes_nombres_trgm
    ON huespedes USING gin (nombres gin_trgm_ops);

CREATE INDEX idx_huespedes_apellidos_trgm
    ON huespedes USING gin (apellidos gin_trgm_ops);

CREATE INDEX idx_huespedes_documento_trgm
    ON huespedes USING gin (numero_documento gin_trgm_ops);

-- Covering index para listado/ordenamiento (HU-10)
-- skill: supabase → query-covering-indexes — INCLUDE elimina heap fetch
CREATE INDEX idx_huespedes_apellidos_nombres
    ON huespedes (apellidos, nombres)
    INCLUDE (id, tipo_documento, numero_documento, correo, telefono);


-- ============================================================
-- TABLA: usuarios
-- Autenticación del sistema del hotel. ENTIDAD DE AUTH.
-- Separada de huespedes para cumplir 3NF:
--   • huespedes tiene atributos de dominio (tipo_doc, num_doc, ...)
--   • usuarios tiene atributos de auth (password_hash, rol, activo)
-- La FK opcional id_huesped vincula a un huésped con cuenta de sistema
-- sin duplicar ningún atributo (no viola 3NF).
--
-- skill: postgresql-table-design → single-table discriminator:
-- recepcionista y administrador comparten 100% de atributos de auth.
-- ============================================================
CREATE TABLE usuarios (
    id             BIGINT      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    correo         TEXT        NOT NULL UNIQUE,
    password_hash  TEXT        NOT NULL,
    rol            rol_usuario NOT NULL,
    activo         BOOLEAN     NOT NULL DEFAULT TRUE,
    -- Vínculo opcional: huésped que también tiene cuenta en el sistema
    id_huesped     BIGINT      REFERENCES huespedes(id) ON DELETE SET NULL,
    creado_en      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE usuarios IS
    'Tabla de autenticación del sistema (recepcionistas y administradores). '
    'Separada de huespedes para no mezclar entidades de dominio con entidades de auth (3NF). '
    'La FK id_huesped es opcional: permite vincular un huésped con cuenta de sistema.';

COMMENT ON COLUMN usuarios.password_hash IS
    'Hash de contraseña. Nunca almacenar contraseñas en texto plano. '
    'Recomendado: bcrypt con salt, o usar pgcrypto.crypt().';
COMMENT ON COLUMN usuarios.rol IS
    'Rol del usuario en el sistema: recepcionista (operativo) o administrador (config).';
COMMENT ON COLUMN usuarios.id_huesped IS
    'FK opcional. NULL = usuario de staff. NOT NULL = huésped con cuenta de sistema.';

-- skill: supabase → schema-foreign-key-indexes
CREATE INDEX idx_usuarios_id_huesped  ON usuarios (id_huesped);
-- Partial index: solo usuarios activos se consultan en login (HU-auth)
CREATE INDEX idx_usuarios_activos_rol ON usuarios (rol) WHERE activo = TRUE;


-- ============================================================
-- TABLA: reservas
-- Vincula habitación + rango de fechas (HU-02, HU-03).
-- Los huéspedes se asocian via tabla reserva_huespedes (M:M).
--
-- EXCLUDE USING gist previene solapamiento en la misma habitación.
-- WHERE (estado <> 'cancelada') excluye canceladas del índice GiST.
--
-- DATE (no TIMESTAMPTZ) porque la lógica es por noches;
-- la hora exacta de llegada se registra en estancias.
--
-- fillfactor=90: estado se actualiza frecuentemente (HOT updates).
-- Ref: https://www.postgresql.org/docs/16/sql-createindex (fillfactor)
-- ============================================================
CREATE TABLE reservas (
    id               BIGINT         GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_habitacion    BIGINT         NOT NULL
                         REFERENCES habitaciones(id) ON DELETE RESTRICT,
    fecha_checkin    DATE           NOT NULL,
    fecha_checkout   DATE           NOT NULL,
    cantidad_personas INT           NOT NULL CHECK (cantidad_personas > 0),
    estado           estado_reserva NOT NULL DEFAULT 'pendiente',
    notas            TEXT,
    creado_en        TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    actualizado_en   TIMESTAMPTZ    NOT NULL DEFAULT NOW(),

    -- Fecha de salida estrictamente posterior a fecha de entrada
    CONSTRAINT chk_reservas_fechas
        CHECK (fecha_checkout > fecha_checkin),

    -- Previene solapamiento de fechas para la misma habitación.
    -- daterange('[)') → checkin inclusivo, checkout exclusivo.
    -- Requiere btree_gist para combinar BIGINT con daterange en GiST.
    -- Ref: https://www.postgresql.org/docs/16/rangetypes
    CONSTRAINT excl_reservas_sin_solapamiento
        EXCLUDE USING gist (
            id_habitacion WITH =,
            daterange(fecha_checkin, fecha_checkout, '[)') WITH &&
        ) WHERE (estado <> 'cancelada')

) WITH (fillfactor = 90);  -- Espacio para HOT updates en columna estado

COMMENT ON TABLE reservas IS
    'Reservas de habitación para un rango de fechas. '
    'Los huéspedes asociados viven en reserva_huespedes (M:M). '
    'EXCLUDE USING gist previene solapamiento de fechas (HU-02 AC-3). '
    'cantidad_personas ≤ capacidad_maxima se valida en capa de servicio '
    '(PostgreSQL no permite subqueries en CHECK inline).';

COMMENT ON COLUMN reservas.fecha_checkin IS
    'Fecha de entrada prevista (inclusiva). Hora exacta → tabla estancias.';
COMMENT ON COLUMN reservas.fecha_checkout IS
    'Fecha de salida prevista (exclusiva en el rango). CHECK: debe ser > fecha_checkin.';

-- skill: supabase → schema-foreign-key-indexes
CREATE INDEX idx_reservas_id_habitacion ON reservas (id_habitacion);
CREATE INDEX idx_reservas_estado        ON reservas (estado);

-- skill: query-partial-indexes + query-covering-indexes
-- Listado principal (HU-03): partial (excluye canceladas) + INCLUDE (index-only scan)
-- Ref: https://www.postgresql.org/docs/16/indexes-index-only-scans
CREATE INDEX idx_reservas_activas_fecha_checkin
    ON reservas (fecha_checkin, estado)
    INCLUDE (id_habitacion, fecha_checkout, cantidad_personas)
    WHERE estado <> 'cancelada';

-- skill: query-composite-indexes → "equality first, range last"
-- Para verificar solapamiento al crear nueva reserva (HU-02)
CREATE INDEX idx_reservas_habitacion_fechas
    ON reservas (id_habitacion, fecha_checkin, fecha_checkout)
    WHERE estado <> 'cancelada';


-- ============================================================
-- TABLA: reserva_huespedes
-- Junction table — relación M:M entre reservas y huéspedes.
-- Un huésped puede tener varias reservas.
-- Una reserva puede tener varios huéspedes registrados.
-- Exactamente UN huésped por reserva debe ser titular (es_titular = TRUE).
-- ============================================================
CREATE TABLE reserva_huespedes (
    id_reserva BIGINT  NOT NULL REFERENCES reservas(id)  ON DELETE CASCADE,
    id_huesped BIGINT  NOT NULL REFERENCES huespedes(id) ON DELETE RESTRICT,
    es_titular BOOLEAN NOT NULL DEFAULT FALSE,

    PRIMARY KEY (id_reserva, id_huesped)
);

COMMENT ON TABLE reserva_huespedes IS
    'Junction M:M entre reservas y huéspedes. '
    'El PK compuesto (id_reserva, id_huesped) evita duplicados. '
    'es_titular = TRUE marca al huésped principal de la reserva. '
    'El índice parcial UNIQUE WHERE es_titular = TRUE garantiza exactamente '
    'un titular por reserva a nivel de base de datos.';

COMMENT ON COLUMN reserva_huespedes.es_titular IS
    'TRUE = huésped principal de la reserva. '
    'Exactamente uno por reserva — garantizado por idx_reserva_huespedes_titular.';

-- skill: supabase → schema-foreign-key-indexes
-- El PK compuesto cubre lookups por id_reserva; se agrega índice para id_huesped
CREATE INDEX idx_reserva_huespedes_huesped
    ON reserva_huespedes (id_huesped);

-- Garantiza exactamente un titular por reserva (business rule a nivel DB)
-- skill: postgresql-table-design → partial unique index más eficiente que trigger
CREATE UNIQUE INDEX idx_reserva_huespedes_titular
    ON reserva_huespedes (id_reserva)
    WHERE es_titular = TRUE;


-- ============================================================
-- TABLA: estancias
-- Unifica checkin + checkout en un único registro por reserva (HU-04, HU-08).
-- Relación 1:1 con reservas (UNIQUE en id_reserva).
-- Los campos de checkout son nullable hasta que ocurra el checkout.
--
-- El trigger tg_auto_cargo_late_checkout auto-llena monto_cargo_extra
-- desde configuracion.late_checkout_cargo_fijo cuando es_late_checkout = TRUE.
-- ============================================================
CREATE TABLE estancias (
    id                      BIGINT         GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_reserva              BIGINT         NOT NULL UNIQUE
                                REFERENCES reservas(id) ON DELETE RESTRICT,
    -- Checkin (requerido al crear la fila)
    timestamp_checkin       TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    registrado_checkin_por  TEXT,
    observaciones_checkin   TEXT,
    -- Checkout (nullable hasta que ocurra el checkout)
    timestamp_checkout      TIMESTAMPTZ,
    es_late_checkout        BOOLEAN,
    monto_cargo_extra       NUMERIC(10, 2) DEFAULT 0 CHECK (monto_cargo_extra >= 0),
    registrado_checkout_por TEXT,
    observaciones_checkout  TEXT,
    -- Auditoría
    creado_en               TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    actualizado_en          TIMESTAMPTZ    NOT NULL DEFAULT NOW(),

    -- Si se registra checkout, es_late_checkout DEBE estar definido.
    -- monto_cargo_extra puede ser 0 (cargo condonado por cortesía).
    CONSTRAINT ck_checkout_consistente CHECK (
        (timestamp_checkout IS NULL     AND es_late_checkout IS NULL) OR
        (timestamp_checkout IS NOT NULL AND es_late_checkout IS NOT NULL)
    )
);

COMMENT ON TABLE estancias IS
    'Unifica checkin y checkout en un único registro por reserva (1:1). '
    'El checkout (timestamp_checkout, es_late_checkout, monto_cargo_extra) '
    'se llena en una segunda operación UPDATE. '
    'monto_cargo_extra se auto-llena via trigger desde configuracion.late_checkout_cargo_fijo '
    'cuando es_late_checkout = TRUE y el monto no fue especificado manualmente.';

COMMENT ON COLUMN estancias.es_late_checkout IS
    'NULL hasta que ocurra checkout. TRUE si salida fue después de la hora límite.';
COMMENT ON COLUMN estancias.monto_cargo_extra IS
    'Cargo por late checkout. Auto-llenado desde configuracion via trigger. '
    'Puede ser 0 si el cargo fue condonado. NUMERIC(10,2) — nunca FLOAT.';

-- UNIQUE en id_reserva ya crea un índice → cumple "index FK columns" (supabase skill)
-- Índice parcial para estancias abiertas (checkin registrado, sin checkout aún)
CREATE INDEX idx_estancias_abiertas
    ON estancias (id_reserva)
    WHERE timestamp_checkout IS NULL;


-- ============================================================
-- TABLA: cancelaciones
-- Cancelación de una reserva con penalidad calculada (HU-07).
-- Relación 1:1 con reservas. UNIQUE en id_reserva.
-- monto_mora = porcentaje del total calculado por la capa de servicio
-- usando configuracion.cancelacion_mora_porcentaje.
-- ============================================================
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

COMMENT ON TABLE cancelaciones IS
    'Cancelaciones de reservas (HU-07). Una reserva solo puede cancelarse una vez. '
    'monto_mora calculado por la capa de servicio usando '
    'configuracion.cancelacion_mora_porcentaje y configuracion.cancelacion_plazo_horas.';

COMMENT ON COLUMN cancelaciones.monto_mora IS
    'Mora por cancelación tardía. NUMERIC(10,2). '
    'La capa de servicio lo calcula usando configuracion.cancelacion_mora_porcentaje.';

-- skill: supabase → schema-foreign-key-indexes
CREATE INDEX idx_cancelaciones_id_reserva ON cancelaciones (id_reserva);


-- ============================================================
-- TABLA: contactos_servicios
-- Directorio de servicios del hotel (HU-06).
-- Datos precargados; no requieren módulo de mantenimiento.
-- Campo activo = baja lógica (soft delete).
-- ============================================================
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

COMMENT ON TABLE contactos_servicios IS
    'Directorio de servicios del hotel (HU-06). Datos precargados. '
    'activo = FALSE oculta el servicio sin eliminarlo (soft delete).';

-- Partial index: solo servicios activos se consultan normalmente
-- skill: query-partial-indexes → índice más pequeño y eficiente
CREATE INDEX idx_contactos_activos
    ON contactos_servicios (nombre_servicio)
    WHERE activo = TRUE;


-- ============================================================
-- TABLA: configuracion
-- Almacén de configuración global del hotel (key-value).
-- Claves con propagación automática via triggers:
--
--   capacidad_maxima_habitacion_defecto →
--       tg_sync_configuracion (AFTER UPDATE ON configuracion)
--       → UPDATE tipos_habitacion SET capacidad_maxima = nuevo_valor
--         Propaga a TODOS los tipos desde ese momento.
--
--   late_checkout_cargo_fijo →
--       tg_auto_cargo_late_checkout (BEFORE INSERT OR UPDATE ON estancias)
--       → Auto-llena monto_cargo_extra cuando es_late_checkout = TRUE
--         y el monto no fue especificado manualmente.
--
-- Otras claves las lee la capa de servicio (sin trigger):
--   late_checkout_hora_limite, cancelacion_plazo_horas,
--   cancelacion_mora_porcentaje
-- ============================================================
CREATE TABLE configuracion (
    clave          TEXT        PRIMARY KEY,
    valor          TEXT        NOT NULL,
    descripcion    TEXT,
    tipo_dato      TEXT        NOT NULL DEFAULT 'text'
                       CHECK (tipo_dato IN ('text','integer','numeric','boolean','time')),
    actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE configuracion IS
    'Configuración global del hotel. PK = clave TEXT (natural key legible). '
    'tipo_dato indica al cliente cómo castear valor (siempre TEXT). '
    'Cambios en ciertas claves se propagan automáticamente via triggers PL/pgSQL.';

COMMENT ON COLUMN configuracion.valor IS
    'Valor siempre en TEXT. El cliente usa tipo_dato para castear correctamente.';
COMMENT ON COLUMN configuracion.tipo_dato IS
    'Tipo de dato del valor: text | integer | numeric | boolean | time.';


-- ------------------------------------------------------------
-- FUNCIÓN: fn_sync_configuracion
-- Propagación configuracion → tipos_habitacion.
-- Se ejecuta AFTER UPDATE ON configuracion FOR EACH ROW.
-- Solo actúa cuando cambia la clave 'capacidad_maxima_habitacion_defecto'.
-- Ref: https://www.postgresql.org/docs/16/plpgsql-trigger
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_sync_configuracion()
RETURNS TRIGGER AS $$
BEGIN
    -- Cuando cambia la capacidad máxima por defecto, se actualiza en TODOS
    -- los tipos de habitación existentes (desde ese momento en adelante).
    IF NEW.clave = 'capacidad_maxima_habitacion_defecto' THEN
        UPDATE tipos_habitacion
        SET    capacidad_maxima = NEW.valor::integer,
               actualizado_en  = NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION fn_sync_configuracion() IS
    'Trigger function: propaga cambios de configuracion a otras tablas. '
    'capacidad_maxima_habitacion_defecto → UPDATE tipos_habitacion (todos los registros).';

CREATE TRIGGER tg_sync_configuracion
    AFTER UPDATE ON configuracion
    FOR EACH ROW
    EXECUTE FUNCTION fn_sync_configuracion();


-- ------------------------------------------------------------
-- FUNCIÓN: fn_auto_cargo_late_checkout
-- Auto-llena estancias.monto_cargo_extra desde configuracion
-- cuando es_late_checkout = TRUE y el monto es 0 o NULL.
-- Se ejecuta BEFORE INSERT OR UPDATE ON estancias FOR EACH ROW.
-- Ref: https://www.postgresql.org/docs/16/plpgsql-trigger
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_auto_cargo_late_checkout()
RETURNS TRIGGER AS $$
BEGIN
    -- Solo actúa en checkouts con late = TRUE y monto no especificado manualmente
    IF NEW.es_late_checkout = TRUE
       AND (NEW.monto_cargo_extra IS NULL OR NEW.monto_cargo_extra = 0) THEN
        SELECT valor::numeric INTO NEW.monto_cargo_extra
        FROM   configuracion
        WHERE  clave = 'late_checkout_cargo_fijo';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION fn_auto_cargo_late_checkout() IS
    'Trigger function: auto-llena monto_cargo_extra desde configuracion.late_checkout_cargo_fijo '
    'cuando es_late_checkout = TRUE y el monto no fue especificado manualmente. '
    'El monto_cargo_extra almacenado es el valor histórico en el momento del checkout.';

CREATE TRIGGER tg_auto_cargo_late_checkout
    BEFORE INSERT OR UPDATE ON estancias
    FOR EACH ROW
    EXECUTE FUNCTION fn_auto_cargo_late_checkout();


-- ============================================================
-- DATOS SEMILLA: tipos_habitacion (HU-05 — 4 tipos requeridos)
-- ============================================================
INSERT INTO tipos_habitacion (nombre, descripcion, capacidad_maxima, precio_referencia)
VALUES
    ('Simple',
     'Habitación individual con cama simple, baño privado y escritorio de trabajo.',
     1, 150.00),

    ('Doble con camas individuales',
     'Habitación con dos camas individuales, ideal para compañeros de viaje o familiares.',
     2, 220.00),

    ('Doble matrimonial',
     'Habitación con cama matrimonial king-size, baño privado con tina y vista al jardín.',
     2, 280.00),

    ('Suite',
     'Suite de lujo con sala de estar separada, jacuzzi, minibar, caja fuerte y vista panorámica.',
     4, 580.00);


-- ============================================================
-- DATOS SEMILLA: habitaciones (12 habitaciones en 3 pisos)
-- ============================================================
INSERT INTO habitaciones (numero_habitacion, piso, estado, id_tipo_habitacion)
VALUES
    -- Piso 1: Habitaciones simples (Simple — capacidad 1)
    ('101', 1, 'disponible',        (SELECT id FROM tipos_habitacion WHERE nombre = 'Simple')),
    ('102', 1, 'disponible',        (SELECT id FROM tipos_habitacion WHERE nombre = 'Simple')),
    ('103', 1, 'mantenimiento',     (SELECT id FROM tipos_habitacion WHERE nombre = 'Simple')),

    -- Piso 2: Habitaciones dobles (capacidad 2)
    ('201', 2, 'disponible',        (SELECT id FROM tipos_habitacion WHERE nombre = 'Doble con camas individuales')),
    ('202', 2, 'disponible',        (SELECT id FROM tipos_habitacion WHERE nombre = 'Doble con camas individuales')),
    ('203', 2, 'disponible',        (SELECT id FROM tipos_habitacion WHERE nombre = 'Doble con camas individuales')),
    ('204', 2, 'disponible',        (SELECT id FROM tipos_habitacion WHERE nombre = 'Doble matrimonial')),
    ('205', 2, 'ocupada',           (SELECT id FROM tipos_habitacion WHERE nombre = 'Doble matrimonial')),

    -- Piso 3: Suites (capacidad 4)
    ('301', 3, 'disponible',        (SELECT id FROM tipos_habitacion WHERE nombre = 'Suite')),
    ('302', 3, 'disponible',        (SELECT id FROM tipos_habitacion WHERE nombre = 'Suite')),
    ('303', 3, 'disponible',        (SELECT id FROM tipos_habitacion WHERE nombre = 'Suite')),
    ('304', 3, 'fuera_de_servicio', (SELECT id FROM tipos_habitacion WHERE nombre = 'Suite'));


-- ============================================================
-- DATOS SEMILLA: contactos_servicios (6 servicios del hotel, HU-06)
-- ============================================================
INSERT INTO contactos_servicios (nombre_servicio, persona_contacto, telefono, correo, descripcion)
VALUES
    ('Restaurante El Mirador',
     'Chef María Quispe',
     '+51 1 234-5678',
     'restaurante@hotel.com',
     'Restaurante principal. Desayuno, almuerzo y cena. Horario: 06:00–22:00.'),

    ('Spa & Bienestar',
     'Lucía Flores',
     '+51 1 234-5679',
     'spa@hotel.com',
     'Masajes, tratamientos faciales, sauna y piscina termal. Reserva previa recomendada.'),

    ('Lavandería Express',
     'Roberto Salas',
     '+51 1 234-5680',
     'lavanderia@hotel.com',
     'Lavado y planchado. Entrega en 24 horas o servicio exprés en 4 horas.'),

    ('Transporte y Traslados',
     'Carlos Mamani',
     '+51 1 234-5681',
     'transporte@hotel.com',
     'Traslados al aeropuerto, tours locales y alquiler de vehículos con conductor.'),

    ('Room Service',
     'Ana Torres',
     '+51 1 234-5682',
     'roomservice@hotel.com',
     'Servicio a la habitación disponible las 24 horas con menú completo.'),

    ('Concierge',
     'Diego Paredes',
     '+51 1 234-5683',
     'concierge@hotel.com',
     'Reservas en restaurantes externos, entradas a atracciones y servicios personalizados.');


-- ============================================================
-- DATOS SEMILLA: configuracion (5 claves globales)
--
-- Propagación automática via triggers:
--   capacidad_maxima_habitacion_defecto → tipos_habitacion (tg_sync_configuracion)
--   late_checkout_cargo_fijo → estancias.monto_cargo_extra (tg_auto_cargo_late_checkout)
--
-- Leídas por la capa de servicio (sin trigger):
--   late_checkout_hora_limite, cancelacion_plazo_horas, cancelacion_mora_porcentaje
-- ============================================================
INSERT INTO configuracion (clave, valor, descripcion, tipo_dato)
VALUES
    ('late_checkout_hora_limite',
     '12:00',
     'Hora límite (HH:MM) a partir de la cual se aplica cargo por late checkout. '
     'Leída por la capa de servicio para determinar si aplica cargo.',
     'time'),

    ('late_checkout_cargo_fijo',
     '75.00',
     'Monto fijo (moneda local) cobrado automáticamente por late checkout. '
     'El trigger tg_auto_cargo_late_checkout lo escribe en estancias.monto_cargo_extra.',
     'numeric'),

    ('cancelacion_plazo_horas',
     '48',
     'Horas de anticipación antes del checkin dentro de las cuales '
     'la cancelación no genera mora. Leída por la capa de servicio.',
     'integer'),

    ('cancelacion_mora_porcentaje',
     '20',
     'Porcentaje (0-100) del costo total de la reserva cobrado como mora '
     'por cancelación fuera del plazo. Leído por la capa de servicio.',
     'integer'),

    ('capacidad_maxima_habitacion_defecto',
     '2',
     'Capacidad máxima por defecto. Al actualizar este valor, '
     'el trigger tg_sync_configuracion actualiza TODOS los tipos_habitacion.capacidad_maxima '
     'con el nuevo valor inmediatamente.',
     'integer');


-- ============================================================
-- FIN DEL ESQUEMA  (v3)
--
-- Instalación en limpio:
--   createdb hotel_db
--   psql -U postgres -d hotel_db -f Code/database/schema.sql
--
-- Verificación rápida:
--   \dt                                          -- 10 tablas
--   SELECT nombre, capacidad_maxima FROM tipos_habitacion ORDER BY id;
--   SELECT COUNT(*) FROM habitaciones;           -- 12
--   SELECT clave, valor, tipo_dato FROM configuracion ORDER BY clave;
--
-- Probar TRIGGER 1 (propagación capacidad):
--   UPDATE configuracion SET valor='3'
--   WHERE clave='capacidad_maxima_habitacion_defecto';
--   SELECT nombre, capacidad_maxima FROM tipos_habitacion;  -- todos en 3
--
-- Probar TRIGGER 2 (auto-cargo late checkout):
--   INSERT INTO estancias (id_reserva, timestamp_checkin) VALUES (<id>, NOW());
--   UPDATE estancias SET timestamp_checkout=NOW(), es_late_checkout=TRUE
--   WHERE id_reserva=<id>;
--   SELECT monto_cargo_extra FROM estancias WHERE id_reserva=<id>;  -- 75.00
-- ============================================================
