CREATE TABLE public.cancelaciones (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  id_reserva bigint NOT NULL UNIQUE,
  timestamp_cancelacion timestamp with time zone NOT NULL DEFAULT now(),
  motivo text,
  monto_mora numeric NOT NULL DEFAULT 0 CHECK (monto_mora >= 0::numeric),
  registrado_por text,
  creado_en timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT cancelaciones_pkey PRIMARY KEY (id),
  CONSTRAINT cancelaciones_id_reserva_fkey FOREIGN KEY (id_reserva) REFERENCES public.reservas(id)
);
CREATE TABLE public.configuracion (
  clave text NOT NULL,
  valor text NOT NULL,
  descripcion text,
  tipo_dato text NOT NULL DEFAULT 'text'::text CHECK (tipo_dato = ANY (ARRAY['text'::text, 'integer'::text, 'numeric'::text, 'boolean'::text, 'time'::text])),
  actualizado_en timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT configuracion_pkey PRIMARY KEY (clave)
);
CREATE TABLE public.contactos_servicios (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  nombre_servicio text NOT NULL UNIQUE,
  persona_contacto text,
  telefono text,
  correo text CHECK (correo IS NULL OR correo ~~ '%@%'::text),
  descripcion text,
  activo boolean NOT NULL DEFAULT true,
  creado_en timestamp with time zone NOT NULL DEFAULT now(),
  actualizado_en timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT contactos_servicios_pkey PRIMARY KEY (id)
);
CREATE TABLE public.estancias (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  id_reserva bigint NOT NULL UNIQUE,
  timestamp_checkin timestamp with time zone NOT NULL DEFAULT now(),
  registrado_checkin_por text,
  observaciones_checkin text,
  timestamp_checkout timestamp with time zone,
  es_late_checkout boolean,
  monto_cargo_extra numeric DEFAULT 0 CHECK (monto_cargo_extra >= 0::numeric),
  registrado_checkout_por text,
  observaciones_checkout text,
  creado_en timestamp with time zone NOT NULL DEFAULT now(),
  actualizado_en timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT estancias_pkey PRIMARY KEY (id),
  CONSTRAINT estancias_id_reserva_fkey FOREIGN KEY (id_reserva) REFERENCES public.reservas(id)
);
CREATE TABLE public.habitaciones (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  numero_habitacion text NOT NULL UNIQUE,
  piso integer NOT NULL CHECK (piso >= 0),
  estado USER-DEFINED NOT NULL DEFAULT 'disponible'::estado_habitacion,
  id_tipo_habitacion bigint NOT NULL,
  creado_en timestamp with time zone NOT NULL DEFAULT now(),
  actualizado_en timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT habitaciones_pkey PRIMARY KEY (id),
  CONSTRAINT habitaciones_id_tipo_habitacion_fkey FOREIGN KEY (id_tipo_habitacion) REFERENCES public.tipos_habitacion(id)
);
CREATE TABLE public.huespedes (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  tipo_documento USER-DEFINED NOT NULL,
  numero_documento text NOT NULL,
  nombres text NOT NULL,
  apellidos text NOT NULL,
  correo text NOT NULL CHECK (correo ~~ '%@%'::text),
  telefono text,
  creado_en timestamp with time zone NOT NULL DEFAULT now(),
  actualizado_en timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT huespedes_pkey PRIMARY KEY (id)
);
CREATE TABLE public.reserva_huespedes (
  id_reserva bigint NOT NULL,
  id_huesped bigint NOT NULL,
  es_titular boolean NOT NULL DEFAULT false,
  CONSTRAINT reserva_huespedes_pkey PRIMARY KEY (id_reserva, id_huesped),
  CONSTRAINT reserva_huespedes_id_reserva_fkey FOREIGN KEY (id_reserva) REFERENCES public.reservas(id),
  CONSTRAINT reserva_huespedes_id_huesped_fkey FOREIGN KEY (id_huesped) REFERENCES public.huespedes(id)
);
CREATE TABLE public.reservas (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  id_habitacion bigint NOT NULL,
  fecha_checkin date NOT NULL,
  fecha_checkout date NOT NULL,
  cantidad_personas integer NOT NULL CHECK (cantidad_personas > 0),
  estado USER-DEFINED NOT NULL DEFAULT 'pendiente'::estado_reserva,
  notas text,
  creado_en timestamp with time zone NOT NULL DEFAULT now(),
  actualizado_en timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT reservas_pkey PRIMARY KEY (id),
  CONSTRAINT reservas_id_habitacion_fkey FOREIGN KEY (id_habitacion) REFERENCES public.habitaciones(id)
);
CREATE TABLE public.tipos_habitacion (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  nombre text NOT NULL UNIQUE,
  descripcion text,
  capacidad_maxima integer NOT NULL CHECK (capacidad_maxima > 0),
  precio_referencia numeric NOT NULL CHECK (precio_referencia > 0::numeric),
  creado_en timestamp with time zone NOT NULL DEFAULT now(),
  actualizado_en timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT tipos_habitacion_pkey PRIMARY KEY (id)
);
CREATE TABLE public.usuarios (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  correo text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  rol USER-DEFINED NOT NULL,
  activo boolean NOT NULL DEFAULT true,
  id_huesped bigint,
  creado_en timestamp with time zone NOT NULL DEFAULT now(),
  actualizado_en timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT usuarios_pkey PRIMARY KEY (id),
  CONSTRAINT usuarios_id_huesped_fkey FOREIGN KEY (id_huesped) REFERENCES public.huespedes(id)
);