--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.usuarios DROP CONSTRAINT IF EXISTS usuarios_id_huesped_fkey;
ALTER TABLE IF EXISTS ONLY public.reservas DROP CONSTRAINT IF EXISTS reservas_id_habitacion_fkey;
ALTER TABLE IF EXISTS ONLY public.reserva_huespedes DROP CONSTRAINT IF EXISTS reserva_huespedes_id_reserva_fkey;
ALTER TABLE IF EXISTS ONLY public.reserva_huespedes DROP CONSTRAINT IF EXISTS reserva_huespedes_id_huesped_fkey;
ALTER TABLE IF EXISTS ONLY public.habitaciones DROP CONSTRAINT IF EXISTS habitaciones_id_tipo_habitacion_fkey;
ALTER TABLE IF EXISTS ONLY public.estancias DROP CONSTRAINT IF EXISTS estancias_id_reserva_fkey;
ALTER TABLE IF EXISTS ONLY public.cancelaciones DROP CONSTRAINT IF EXISTS cancelaciones_id_reserva_fkey;
DROP TRIGGER IF EXISTS tg_sync_configuracion ON public.configuracion;
DROP TRIGGER IF EXISTS tg_auto_cargo_late_checkout ON public.estancias;
DROP INDEX IF EXISTS public.idx_usuarios_id_huesped;
DROP INDEX IF EXISTS public.idx_usuarios_activos_rol;
DROP INDEX IF EXISTS public.idx_reservas_id_habitacion;
DROP INDEX IF EXISTS public.idx_reservas_habitacion_fechas;
DROP INDEX IF EXISTS public.idx_reservas_estado;
DROP INDEX IF EXISTS public.idx_reservas_activas_fecha_checkin;
DROP INDEX IF EXISTS public.idx_reserva_huespedes_titular;
DROP INDEX IF EXISTS public.idx_reserva_huespedes_huesped;
DROP INDEX IF EXISTS public.idx_huespedes_nombres_trgm;
DROP INDEX IF EXISTS public.idx_huespedes_documento_trgm;
DROP INDEX IF EXISTS public.idx_huespedes_apellidos_trgm;
DROP INDEX IF EXISTS public.idx_huespedes_apellidos_nombres;
DROP INDEX IF EXISTS public.idx_habitaciones_id_tipo;
DROP INDEX IF EXISTS public.idx_estancias_abiertas;
DROP INDEX IF EXISTS public.idx_contactos_activos;
DROP INDEX IF EXISTS public.idx_cancelaciones_id_reserva;
ALTER TABLE IF EXISTS ONLY public.usuarios DROP CONSTRAINT IF EXISTS usuarios_pkey;
ALTER TABLE IF EXISTS ONLY public.usuarios DROP CONSTRAINT IF EXISTS usuarios_correo_key;
ALTER TABLE IF EXISTS ONLY public.tipos_habitacion DROP CONSTRAINT IF EXISTS uq_tipos_habitacion_nombre;
ALTER TABLE IF EXISTS ONLY public.huespedes DROP CONSTRAINT IF EXISTS uq_huespedes_documento;
ALTER TABLE IF EXISTS ONLY public.habitaciones DROP CONSTRAINT IF EXISTS uq_habitaciones_numero;
ALTER TABLE IF EXISTS ONLY public.contactos_servicios DROP CONSTRAINT IF EXISTS uq_contactos_servicios_nombre;
ALTER TABLE IF EXISTS ONLY public.cancelaciones DROP CONSTRAINT IF EXISTS uq_cancelaciones_reserva;
ALTER TABLE IF EXISTS ONLY public.tipos_habitacion DROP CONSTRAINT IF EXISTS tipos_habitacion_pkey;
ALTER TABLE IF EXISTS ONLY public.reservas DROP CONSTRAINT IF EXISTS reservas_pkey;
ALTER TABLE IF EXISTS ONLY public.reserva_huespedes DROP CONSTRAINT IF EXISTS reserva_huespedes_pkey;
ALTER TABLE IF EXISTS ONLY public.huespedes DROP CONSTRAINT IF EXISTS huespedes_pkey;
ALTER TABLE IF EXISTS ONLY public.habitaciones DROP CONSTRAINT IF EXISTS habitaciones_pkey;
ALTER TABLE IF EXISTS ONLY public.reservas DROP CONSTRAINT IF EXISTS excl_reservas_sin_solapamiento;
ALTER TABLE IF EXISTS ONLY public.estancias DROP CONSTRAINT IF EXISTS estancias_pkey;
ALTER TABLE IF EXISTS ONLY public.estancias DROP CONSTRAINT IF EXISTS estancias_id_reserva_key;
ALTER TABLE IF EXISTS ONLY public.contactos_servicios DROP CONSTRAINT IF EXISTS contactos_servicios_pkey;
ALTER TABLE IF EXISTS ONLY public.configuracion DROP CONSTRAINT IF EXISTS configuracion_pkey;
ALTER TABLE IF EXISTS ONLY public.cancelaciones DROP CONSTRAINT IF EXISTS cancelaciones_pkey;
DROP TABLE IF EXISTS public.usuarios;
DROP TABLE IF EXISTS public.tipos_habitacion;
DROP TABLE IF EXISTS public.reservas;
DROP TABLE IF EXISTS public.reserva_huespedes;
DROP TABLE IF EXISTS public.huespedes;
DROP TABLE IF EXISTS public.habitaciones;
DROP TABLE IF EXISTS public.estancias;
DROP TABLE IF EXISTS public.contactos_servicios;
DROP TABLE IF EXISTS public.configuracion;
DROP TABLE IF EXISTS public.cancelaciones;
DROP FUNCTION IF EXISTS public.fn_sync_configuracion();
DROP FUNCTION IF EXISTS public.fn_auto_cargo_late_checkout();
DROP TYPE IF EXISTS public.tipo_documento;
DROP TYPE IF EXISTS public.rol_usuario;
DROP TYPE IF EXISTS public.estado_reserva;
DROP TYPE IF EXISTS public.estado_habitacion;
DROP SCHEMA IF EXISTS public;
--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA public;


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- Name: estado_habitacion; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.estado_habitacion AS ENUM (
    'disponible',
    'ocupada',
    'mantenimiento',
    'fuera_de_servicio'
);


--
-- Name: estado_reserva; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.estado_reserva AS ENUM (
    'pendiente',
    'activa',
    'completada',
    'cancelada'
);


--
-- Name: rol_usuario; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.rol_usuario AS ENUM (
    'recepcionista',
    'administrador'
);


--
-- Name: tipo_documento; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.tipo_documento AS ENUM (
    'carnet',
    'pasaporte',
    'carnet_extranjero',
    'nit'
);


--
-- Name: fn_auto_cargo_late_checkout(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.fn_auto_cargo_late_checkout() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF NEW.es_late_checkout = TRUE
       AND (NEW.monto_cargo_extra IS NULL OR NEW.monto_cargo_extra = 0) THEN
        SELECT valor::numeric INTO NEW.monto_cargo_extra
        FROM   configuracion
        WHERE  clave = 'late_checkout_cargo_fijo';
    END IF;
    RETURN NEW;
END;
$$;


--
-- Name: fn_sync_configuracion(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.fn_sync_configuracion() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    IF NEW.clave = 'capacidad_maxima_habitacion_defecto' THEN
        UPDATE tipos_habitacion
        SET    capacidad_maxima = NEW.valor::integer,
               actualizado_en  = NOW();
    END IF;
    RETURN NEW;
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: cancelaciones; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cancelaciones (
    id bigint NOT NULL,
    id_reserva bigint NOT NULL,
    timestamp_cancelacion timestamp with time zone DEFAULT now() NOT NULL,
    motivo text,
    monto_mora numeric(10,2) DEFAULT 0 NOT NULL,
    registrado_por text,
    creado_en timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT cancelaciones_monto_mora_check CHECK ((monto_mora >= (0)::numeric))
);


--
-- Name: TABLE cancelaciones; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.cancelaciones IS 'Registro de cancelaciones de reservas. Una reserva solo puede cancelarse una vez. La mora se calcula segÃºn dÃ­as de anticipaciÃ³n y se almacena como valor histÃ³rico.';


--
-- Name: COLUMN cancelaciones.timestamp_cancelacion; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.cancelaciones.timestamp_cancelacion IS 'Momento exacto (con timezone) en que se registrÃ³ la cancelaciÃ³n.';


--
-- Name: COLUMN cancelaciones.motivo; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.cancelaciones.motivo IS 'RazÃ³n de la cancelaciÃ³n ingresada por el personal o el huÃ©sped.';


--
-- Name: COLUMN cancelaciones.monto_mora; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.cancelaciones.monto_mora IS 'Penalidad por cancelaciÃ³n tardÃ­a. Cero si fue oportuna. Valor histÃ³rico â€” calculado y almacenado en el momento del evento.';


--
-- Name: cancelaciones_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.cancelaciones ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.cancelaciones_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: configuracion; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.configuracion (
    clave text NOT NULL,
    valor text NOT NULL,
    descripcion text,
    tipo_dato text DEFAULT 'text'::text NOT NULL,
    actualizado_en timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT configuracion_tipo_dato_check CHECK ((tipo_dato = ANY (ARRAY['text'::text, 'integer'::text, 'numeric'::text, 'boolean'::text, 'time'::text])))
);


--
-- Name: contactos_servicios; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.contactos_servicios (
    id bigint NOT NULL,
    nombre_servicio text NOT NULL,
    persona_contacto text,
    telefono text,
    correo text,
    descripcion text,
    activo boolean DEFAULT true NOT NULL,
    creado_en timestamp with time zone DEFAULT now() NOT NULL,
    actualizado_en timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT chk_contactos_correo CHECK (((correo IS NULL) OR (correo ~~ '%@%'::text)))
);


--
-- Name: TABLE contactos_servicios; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.contactos_servicios IS 'Directorio de contactos de servicios del hotel (restaurante, spa, lavanderÃ­a, etc.). Datos precargados. El campo activo permite baja lÃ³gica sin eliminar el registro.';


--
-- Name: COLUMN contactos_servicios.nombre_servicio; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.contactos_servicios.nombre_servicio IS 'Nombre del servicio ofrecido por el hotel o proveedor externo. Ãšnico.';


--
-- Name: COLUMN contactos_servicios.activo; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.contactos_servicios.activo IS 'Baja lÃ³gica: FALSE oculta el servicio sin eliminarlo de la base de datos.';


--
-- Name: contactos_servicios_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.contactos_servicios ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.contactos_servicios_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: estancias; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.estancias (
    id bigint NOT NULL,
    id_reserva bigint NOT NULL,
    timestamp_checkin timestamp with time zone DEFAULT now() NOT NULL,
    registrado_checkin_por text,
    observaciones_checkin text,
    timestamp_checkout timestamp with time zone,
    es_late_checkout boolean,
    monto_cargo_extra numeric(10,2) DEFAULT 0,
    registrado_checkout_por text,
    observaciones_checkout text,
    creado_en timestamp with time zone DEFAULT now() NOT NULL,
    actualizado_en timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT ck_checkout_consistente CHECK ((((timestamp_checkout IS NULL) AND (es_late_checkout IS NULL)) OR ((timestamp_checkout IS NOT NULL) AND (es_late_checkout IS NOT NULL)))),
    CONSTRAINT estancias_monto_cargo_extra_check CHECK ((monto_cargo_extra >= (0)::numeric))
);


--
-- Name: estancias_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.estancias ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.estancias_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: habitaciones; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.habitaciones (
    id bigint NOT NULL,
    numero_habitacion text NOT NULL,
    piso integer NOT NULL,
    estado public.estado_habitacion DEFAULT 'disponible'::public.estado_habitacion NOT NULL,
    id_tipo_habitacion bigint NOT NULL,
    creado_en timestamp with time zone DEFAULT now() NOT NULL,
    actualizado_en timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT habitaciones_piso_check CHECK ((piso >= 0))
);


--
-- Name: TABLE habitaciones; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.habitaciones IS 'Inventario fÃ­sico de habitaciones del hotel. Cada habitaciÃ³n pertenece a un tipo que define su capacidad y precio base. Datos precargados; no requieren mÃ³dulo de mantenimiento en el prototipo.';


--
-- Name: COLUMN habitaciones.numero_habitacion; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.habitaciones.numero_habitacion IS 'Identificador visible en la puerta (ej: "101", "202B"). Ãšnico en el hotel.';


--
-- Name: COLUMN habitaciones.piso; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.habitaciones.piso IS 'NÃºmero de piso donde se ubica la habitaciÃ³n. CHECK >= 0.';


--
-- Name: COLUMN habitaciones.estado; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.habitaciones.estado IS 'Estado operativo actual: disponible, ocupada, mantenimiento, fuera_de_servicio.';


--
-- Name: COLUMN habitaciones.id_tipo_habitacion; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.habitaciones.id_tipo_habitacion IS 'FK al tipo de habitaciÃ³n. Determina capacidad mÃ¡xima y precio de referencia. Indexada manualmente (PostgreSQL no crea Ã­ndices en FK automÃ¡ticamente).';


--
-- Name: habitaciones_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.habitaciones ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.habitaciones_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: huespedes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.huespedes (
    id bigint NOT NULL,
    tipo_documento public.tipo_documento NOT NULL,
    numero_documento text NOT NULL,
    nombres text NOT NULL,
    apellidos text NOT NULL,
    correo text NOT NULL,
    telefono text,
    creado_en timestamp with time zone DEFAULT now() NOT NULL,
    actualizado_en timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT chk_huespedes_correo CHECK ((correo ~~ '%@%'::text))
);


--
-- Name: TABLE huespedes; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.huespedes IS 'Registro de huÃ©spedes del hotel. La combinaciÃ³n (tipo_documento, numero_documento) es Ãºnica para evitar duplicados (HU-01).';


--
-- Name: COLUMN huespedes.tipo_documento; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.huespedes.tipo_documento IS 'Tipo de documento de identidad: dni, pasaporte, carnet_extranjeria, ruc.';


--
-- Name: COLUMN huespedes.numero_documento; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.huespedes.numero_documento IS 'NÃºmero del documento. Junto con tipo_documento forma la clave natural Ãºnica.';


--
-- Name: COLUMN huespedes.nombres; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.huespedes.nombres IS 'Nombres del huÃ©sped tal como aparecen en el documento de identidad.';


--
-- Name: COLUMN huespedes.apellidos; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.huespedes.apellidos IS 'Apellidos del huÃ©sped tal como aparecen en el documento de identidad.';


--
-- Name: COLUMN huespedes.correo; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.huespedes.correo IS 'Correo electrÃ³nico del huÃ©sped. ValidaciÃ³n mÃ­nima de formato con CHECK.';


--
-- Name: huespedes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.huespedes ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.huespedes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: reserva_huespedes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reserva_huespedes (
    id_reserva bigint NOT NULL,
    id_huesped bigint NOT NULL,
    es_titular boolean DEFAULT false NOT NULL
);


--
-- Name: reservas; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reservas (
    id bigint NOT NULL,
    id_habitacion bigint NOT NULL,
    fecha_checkin date NOT NULL,
    fecha_checkout date NOT NULL,
    cantidad_personas integer NOT NULL,
    estado public.estado_reserva DEFAULT 'pendiente'::public.estado_reserva NOT NULL,
    notas text,
    creado_en timestamp with time zone DEFAULT now() NOT NULL,
    actualizado_en timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT chk_reservas_fechas CHECK ((fecha_checkout > fecha_checkin)),
    CONSTRAINT reservas_cantidad_personas_check CHECK ((cantidad_personas > 0))
)
WITH (fillfactor='90');


--
-- Name: TABLE reservas; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.reservas IS 'Reservas que vinculan un huÃ©sped con una habitaciÃ³n para un rango de fechas. La restricciÃ³n EXCLUDE previene solapamiento de fechas para la misma habitaciÃ³n en reservas pendientes o activas. La validaciÃ³n cantidad_personas â‰¤ capacidad_maxima se realiza en capa de servicio (PostgreSQL no permite subqueries en CHECK inline).';


--
-- Name: COLUMN reservas.fecha_checkin; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.reservas.fecha_checkin IS 'Fecha de entrada prevista (inclusiva). Hora exacta â†’ tabla checkins.';


--
-- Name: COLUMN reservas.fecha_checkout; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.reservas.fecha_checkout IS 'Fecha de salida prevista (exclusiva en el rango). Debe ser > fecha_checkin.';


--
-- Name: COLUMN reservas.cantidad_personas; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.reservas.cantidad_personas IS 'NÃºmero de personas. Validado contra tipos_habitacion.capacidad_maxima en la capa de servicio.';


--
-- Name: COLUMN reservas.estado; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.reservas.estado IS 'Ciclo de vida: pendiente â†’ activa (check-in) â†’ completada (check-out) | cancelada.';


--
-- Name: reservas_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.reservas ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.reservas_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: tipos_habitacion; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tipos_habitacion (
    id bigint NOT NULL,
    nombre text NOT NULL,
    descripcion text,
    capacidad_maxima integer NOT NULL,
    precio_referencia numeric(10,2) NOT NULL,
    creado_en timestamp with time zone DEFAULT now() NOT NULL,
    actualizado_en timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT tipos_habitacion_capacidad_maxima_check CHECK ((capacidad_maxima > 0)),
    CONSTRAINT tipos_habitacion_precio_referencia_check CHECK ((precio_referencia > (0)::numeric))
);


--
-- Name: TABLE tipos_habitacion; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.tipos_habitacion IS 'CatÃ¡logo de tipos de habitaciÃ³n disponibles en el hotel. Define la capacidad mÃ¡xima y el precio base por noche. Precargados: Simple, Doble individual, Doble matrimonial, Suite.';


--
-- Name: COLUMN tipos_habitacion.id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.tipos_habitacion.id IS 'Clave primaria surrogate. BIGINT GENERATED ALWAYS AS IDENTITY (no SERIAL).';


--
-- Name: COLUMN tipos_habitacion.nombre; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.tipos_habitacion.nombre IS 'Nombre del tipo de habitaciÃ³n. Ãšnico en el sistema.';


--
-- Name: COLUMN tipos_habitacion.capacidad_maxima; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.tipos_habitacion.capacidad_maxima IS 'NÃºmero mÃ¡ximo de personas que admite este tipo de habitaciÃ³n.';


--
-- Name: COLUMN tipos_habitacion.precio_referencia; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.tipos_habitacion.precio_referencia IS 'Precio base por noche. NUMERIC(10,2) para aritmÃ©tica exacta â€” nunca FLOAT.';


--
-- Name: tipos_habitacion_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.tipos_habitacion ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.tipos_habitacion_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.usuarios (
    id bigint NOT NULL,
    correo text NOT NULL,
    password_hash text NOT NULL,
    rol public.rol_usuario NOT NULL,
    activo boolean DEFAULT true NOT NULL,
    id_huesped bigint,
    creado_en timestamp with time zone DEFAULT now() NOT NULL,
    actualizado_en timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.usuarios ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.usuarios_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Data for Name: cancelaciones; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cancelaciones (id, id_reserva, timestamp_cancelacion, motivo, monto_mora, registrado_por, creado_en) FROM stdin;
\.


--
-- Data for Name: configuracion; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.configuracion (clave, valor, descripcion, tipo_dato, actualizado_en) FROM stdin;
late_checkout_hora_limite	12:00	Hora lÃ­mite (HH:MM) para late checkout. LeÃ­da por la capa de servicio.	time	2026-03-28 11:43:28.889613-04
late_checkout_cargo_fijo	75.00	Monto fijo cobrado por late checkout. El trigger tg_auto_cargo_late_checkout lo escribe en estancias.monto_cargo_extra.	numeric	2026-03-28 11:43:28.889613-04
cancelacion_plazo_horas	48	Horas de anticipaciÃ³n para cancelar sin mora. LeÃ­da por la capa de servicio.	integer	2026-03-28 11:43:28.889613-04
cancelacion_mora_porcentaje	20	Porcentaje del costo total aplicado como mora por cancelaciÃ³n tardÃ­a.	integer	2026-03-28 11:43:28.889613-04
capacidad_maxima_habitacion_defecto	2	Al actualizar este valor, el trigger tg_sync_configuracion actualiza TODOS los tipos_habitacion.capacidad_maxima inmediatamente.	integer	2026-03-28 11:43:28.889613-04
\.


--
-- Data for Name: contactos_servicios; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.contactos_servicios (id, nombre_servicio, persona_contacto, telefono, correo, descripcion, activo, creado_en, actualizado_en) FROM stdin;
1	Restaurante El Mirador	Chef MarÃ­a Quispe	+51 1 234-5678	restaurante@hotel.com	Restaurante principal del hotel. Desayuno, almuerzo y cena. Horario: 06:00â€“22:00.	t	2026-03-28 09:16:26.523494-04	2026-03-28 09:16:26.523494-04
2	Spa & Bienestar	LucÃ­a Flores	+51 1 234-5679	spa@hotel.com	Masajes, tratamientos faciales, sauna y piscina termal. Reserva previa recomendada.	t	2026-03-28 09:16:26.523494-04	2026-03-28 09:16:26.523494-04
3	LavanderÃ­a Express	Roberto Salas	+51 1 234-5680	lavanderia@hotel.com	Lavado y planchado. Entrega en 24 horas o servicio exprÃ©s en 4 horas.	t	2026-03-28 09:16:26.523494-04	2026-03-28 09:16:26.523494-04
4	Transporte y Traslados	Carlos Mamani	+51 1 234-5681	transporte@hotel.com	Traslados al aeropuerto, tours locales y alquiler de vehÃ­culos con conductor.	t	2026-03-28 09:16:26.523494-04	2026-03-28 09:16:26.523494-04
5	Room Service	Ana Torres	+51 1 234-5682	roomservice@hotel.com	Servicio a la habitaciÃ³n disponible las 24 horas con menÃº completo.	t	2026-03-28 09:16:26.523494-04	2026-03-28 09:16:26.523494-04
6	Concierge	Diego Paredes	+51 1 234-5683	concierge@hotel.com	Reservas en restaurantes externos, entradas a atracciones y servicios personalizados.	t	2026-03-28 09:16:26.523494-04	2026-03-28 09:16:26.523494-04
\.


--
-- Data for Name: estancias; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.estancias (id, id_reserva, timestamp_checkin, registrado_checkin_por, observaciones_checkin, timestamp_checkout, es_late_checkout, monto_cargo_extra, registrado_checkout_por, observaciones_checkout, creado_en, actualizado_en) FROM stdin;
\.


--
-- Data for Name: habitaciones; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.habitaciones (id, numero_habitacion, piso, estado, id_tipo_habitacion, creado_en, actualizado_en) FROM stdin;
1	101	1	disponible	1	2026-03-28 09:16:26.51941-04	2026-03-28 09:16:26.51941-04
2	102	1	disponible	1	2026-03-28 09:16:26.51941-04	2026-03-28 09:16:26.51941-04
3	103	1	mantenimiento	1	2026-03-28 09:16:26.51941-04	2026-03-28 09:16:26.51941-04
4	201	2	disponible	2	2026-03-28 09:16:26.51941-04	2026-03-28 09:16:26.51941-04
5	202	2	disponible	2	2026-03-28 09:16:26.51941-04	2026-03-28 09:16:26.51941-04
6	203	2	disponible	3	2026-03-28 09:16:26.51941-04	2026-03-28 09:16:26.51941-04
7	204	2	ocupada	3	2026-03-28 09:16:26.51941-04	2026-03-28 09:16:26.51941-04
8	301	3	disponible	4	2026-03-28 09:16:26.51941-04	2026-03-28 09:16:26.51941-04
9	302	3	disponible	4	2026-03-28 09:16:26.51941-04	2026-03-28 09:16:26.51941-04
10	303	3	fuera_de_servicio	4	2026-03-28 09:16:26.51941-04	2026-03-28 09:16:26.51941-04
12	304	3	fuera_de_servicio	4	2026-03-28 11:43:28.889613-04	2026-03-28 11:43:28.889613-04
\.


--
-- Data for Name: huespedes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.huespedes (id, tipo_documento, numero_documento, nombres, apellidos, correo, telefono, creado_en, actualizado_en) FROM stdin;
\.


--
-- Data for Name: reserva_huespedes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.reserva_huespedes (id_reserva, id_huesped, es_titular) FROM stdin;
\.


--
-- Data for Name: reservas; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.reservas (id, id_habitacion, fecha_checkin, fecha_checkout, cantidad_personas, estado, notas, creado_en, actualizado_en) FROM stdin;
\.


--
-- Data for Name: tipos_habitacion; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tipos_habitacion (id, nombre, descripcion, capacidad_maxima, precio_referencia, creado_en, actualizado_en) FROM stdin;
1	Simple	HabitaciÃ³n individual con cama simple, baÃ±o privado y escritorio de trabajo.	1	150.00	2026-03-28 09:16:26.515874-04	2026-03-28 09:16:26.515874-04
3	Doble matrimonial	HabitaciÃ³n con cama matrimonial king-size, baÃ±o privado con tina y vista al jardÃ­n.	2	280.00	2026-03-28 09:16:26.515874-04	2026-03-28 09:16:26.515874-04
4	Suite	Suite de lujo con sala de estar separada, jacuzzi, minibar, caja fuerte y vista panorÃ¡mica.	4	580.00	2026-03-28 09:16:26.515874-04	2026-03-28 09:16:26.515874-04
2	Doble con camas individuales	HabitaciÃ³n con dos camas individuales, ideal para compaÃ±eros de viaje o familiares.	2	220.00	2026-03-28 09:16:26.515874-04	2026-03-28 09:33:31.951225-04
\.


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.usuarios (id, correo, password_hash, rol, activo, id_huesped, creado_en, actualizado_en) FROM stdin;
\.


--
-- Name: cancelaciones_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.cancelaciones_id_seq', 1, false);


--
-- Name: contactos_servicios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.contactos_servicios_id_seq', 6, true);


--
-- Name: estancias_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.estancias_id_seq', 1, false);


--
-- Name: habitaciones_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.habitaciones_id_seq', 12, true);


--
-- Name: huespedes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.huespedes_id_seq', 1, false);


--
-- Name: reservas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.reservas_id_seq', 1, false);


--
-- Name: tipos_habitacion_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tipos_habitacion_id_seq', 4, true);


--
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 1, false);


--
-- Name: cancelaciones cancelaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cancelaciones
    ADD CONSTRAINT cancelaciones_pkey PRIMARY KEY (id);


--
-- Name: configuracion configuracion_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.configuracion
    ADD CONSTRAINT configuracion_pkey PRIMARY KEY (clave);


--
-- Name: contactos_servicios contactos_servicios_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contactos_servicios
    ADD CONSTRAINT contactos_servicios_pkey PRIMARY KEY (id);


--
-- Name: estancias estancias_id_reserva_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.estancias
    ADD CONSTRAINT estancias_id_reserva_key UNIQUE (id_reserva);


--
-- Name: estancias estancias_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.estancias
    ADD CONSTRAINT estancias_pkey PRIMARY KEY (id);


--
-- Name: reservas excl_reservas_sin_solapamiento; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reservas
    ADD CONSTRAINT excl_reservas_sin_solapamiento EXCLUDE USING gist (id_habitacion WITH =, daterange(fecha_checkin, fecha_checkout, '[)'::text) WITH &&) WHERE ((estado <> 'cancelada'::public.estado_reserva));


--
-- Name: habitaciones habitaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.habitaciones
    ADD CONSTRAINT habitaciones_pkey PRIMARY KEY (id);


--
-- Name: huespedes huespedes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.huespedes
    ADD CONSTRAINT huespedes_pkey PRIMARY KEY (id);


--
-- Name: reserva_huespedes reserva_huespedes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reserva_huespedes
    ADD CONSTRAINT reserva_huespedes_pkey PRIMARY KEY (id_reserva, id_huesped);


--
-- Name: reservas reservas_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reservas
    ADD CONSTRAINT reservas_pkey PRIMARY KEY (id);


--
-- Name: tipos_habitacion tipos_habitacion_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tipos_habitacion
    ADD CONSTRAINT tipos_habitacion_pkey PRIMARY KEY (id);


--
-- Name: cancelaciones uq_cancelaciones_reserva; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cancelaciones
    ADD CONSTRAINT uq_cancelaciones_reserva UNIQUE (id_reserva);


--
-- Name: contactos_servicios uq_contactos_servicios_nombre; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contactos_servicios
    ADD CONSTRAINT uq_contactos_servicios_nombre UNIQUE (nombre_servicio);


--
-- Name: habitaciones uq_habitaciones_numero; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.habitaciones
    ADD CONSTRAINT uq_habitaciones_numero UNIQUE (numero_habitacion);


--
-- Name: huespedes uq_huespedes_documento; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.huespedes
    ADD CONSTRAINT uq_huespedes_documento UNIQUE (tipo_documento, numero_documento);


--
-- Name: tipos_habitacion uq_tipos_habitacion_nombre; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tipos_habitacion
    ADD CONSTRAINT uq_tipos_habitacion_nombre UNIQUE (nombre);


--
-- Name: usuarios usuarios_correo_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_correo_key UNIQUE (correo);


--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- Name: idx_cancelaciones_id_reserva; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_cancelaciones_id_reserva ON public.cancelaciones USING btree (id_reserva);


--
-- Name: idx_contactos_activos; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_contactos_activos ON public.contactos_servicios USING btree (nombre_servicio) WHERE (activo = true);


--
-- Name: idx_estancias_abiertas; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_estancias_abiertas ON public.estancias USING btree (id_reserva) WHERE (timestamp_checkout IS NULL);


--
-- Name: idx_habitaciones_id_tipo; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_habitaciones_id_tipo ON public.habitaciones USING btree (id_tipo_habitacion);


--
-- Name: idx_huespedes_apellidos_nombres; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_huespedes_apellidos_nombres ON public.huespedes USING btree (apellidos, nombres) INCLUDE (id, tipo_documento, numero_documento, correo, telefono);


--
-- Name: idx_huespedes_apellidos_trgm; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_huespedes_apellidos_trgm ON public.huespedes USING gin (apellidos public.gin_trgm_ops);


--
-- Name: idx_huespedes_documento_trgm; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_huespedes_documento_trgm ON public.huespedes USING gin (numero_documento public.gin_trgm_ops);


--
-- Name: idx_huespedes_nombres_trgm; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_huespedes_nombres_trgm ON public.huespedes USING gin (nombres public.gin_trgm_ops);


--
-- Name: idx_reserva_huespedes_huesped; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_reserva_huespedes_huesped ON public.reserva_huespedes USING btree (id_huesped);


--
-- Name: idx_reserva_huespedes_titular; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX idx_reserva_huespedes_titular ON public.reserva_huespedes USING btree (id_reserva) WHERE (es_titular = true);


--
-- Name: idx_reservas_activas_fecha_checkin; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_reservas_activas_fecha_checkin ON public.reservas USING btree (fecha_checkin, estado) INCLUDE (id_habitacion, fecha_checkout, cantidad_personas) WHERE (estado <> 'cancelada'::public.estado_reserva);


--
-- Name: idx_reservas_estado; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_reservas_estado ON public.reservas USING btree (estado);


--
-- Name: idx_reservas_habitacion_fechas; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_reservas_habitacion_fechas ON public.reservas USING btree (id_habitacion, fecha_checkin, fecha_checkout) WHERE (estado <> 'cancelada'::public.estado_reserva);


--
-- Name: idx_reservas_id_habitacion; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_reservas_id_habitacion ON public.reservas USING btree (id_habitacion);


--
-- Name: idx_usuarios_activos_rol; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_usuarios_activos_rol ON public.usuarios USING btree (rol) WHERE (activo = true);


--
-- Name: idx_usuarios_id_huesped; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_usuarios_id_huesped ON public.usuarios USING btree (id_huesped);


--
-- Name: estancias tg_auto_cargo_late_checkout; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tg_auto_cargo_late_checkout BEFORE INSERT OR UPDATE ON public.estancias FOR EACH ROW EXECUTE FUNCTION public.fn_auto_cargo_late_checkout();


--
-- Name: configuracion tg_sync_configuracion; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tg_sync_configuracion AFTER UPDATE ON public.configuracion FOR EACH ROW EXECUTE FUNCTION public.fn_sync_configuracion();


--
-- Name: cancelaciones cancelaciones_id_reserva_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cancelaciones
    ADD CONSTRAINT cancelaciones_id_reserva_fkey FOREIGN KEY (id_reserva) REFERENCES public.reservas(id) ON DELETE RESTRICT;


--
-- Name: estancias estancias_id_reserva_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.estancias
    ADD CONSTRAINT estancias_id_reserva_fkey FOREIGN KEY (id_reserva) REFERENCES public.reservas(id) ON DELETE RESTRICT;


--
-- Name: habitaciones habitaciones_id_tipo_habitacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.habitaciones
    ADD CONSTRAINT habitaciones_id_tipo_habitacion_fkey FOREIGN KEY (id_tipo_habitacion) REFERENCES public.tipos_habitacion(id) ON DELETE RESTRICT;


--
-- Name: reserva_huespedes reserva_huespedes_id_huesped_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reserva_huespedes
    ADD CONSTRAINT reserva_huespedes_id_huesped_fkey FOREIGN KEY (id_huesped) REFERENCES public.huespedes(id) ON DELETE RESTRICT;


--
-- Name: reserva_huespedes reserva_huespedes_id_reserva_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reserva_huespedes
    ADD CONSTRAINT reserva_huespedes_id_reserva_fkey FOREIGN KEY (id_reserva) REFERENCES public.reservas(id) ON DELETE CASCADE;


--
-- Name: reservas reservas_id_habitacion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reservas
    ADD CONSTRAINT reservas_id_habitacion_fkey FOREIGN KEY (id_habitacion) REFERENCES public.habitaciones(id) ON DELETE RESTRICT;


--
-- Name: usuarios usuarios_id_huesped_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_id_huesped_fkey FOREIGN KEY (id_huesped) REFERENCES public.huespedes(id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

