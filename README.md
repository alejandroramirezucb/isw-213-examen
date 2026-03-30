# Raidenhotel

## Instrucciones de ejecución

**Requisitos** Node.js 18+ y PostgreSQL

1. Instalar dependencias:

   ```bash
   cd Code
   npm install
   ```

2. Crear la base de datos y cargar el schema:

   ```bash
   # Crear la base de datos
   createdb -U postgres hotel_db

   # Cargar el dump en la base de datos
   psql -U postgres -d hotel_db -f database/dump_local.sql
   ```

3. Configurar variables de entorno (crear archivo `.env` en `Code/`):

   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=<tu_contraseña>
   DB_NAME=hotel_db
   ```

4. Ejecutar en modo desarrollo (backend + frontend al mismo tiempo):

   ```bash
   npm run dev
   ```

   - Backend: `http://localhost:5000`
   - Frontend: `http://localhost:3000`

---

## Arquitectura de software

El sistema sigue una arquitectura **cliente-servidor** separada en tres capas:

- **Frontend** — Se usa React corre en el puerto 3000. Se comunica con el backend a través de `Code/src/presentacion/api`.
- **Backend** — Se usa Express (Node.js + TypeScript) corriendo en el puerto 5000. Esta organizado en Rutas → Controladores → Servicios → Repositorios → Modelos.
- **Base de datos** — PostgreSQL y TypeORM (que gestiona la conexión y sincronización con el esquema).

```
Frontend (React :3000)
       ↓ /api
Backend (Express :5000)
       ↓ TypeORM
PostgreSQL
```

---

## Tecnologías

| Capa              | Tecnología                       |
| ----------------- | -------------------------------- |
| Frontend          | React 18, TypeScript, Vite 5     |
| Backend           | Express 5, TypeScript            |
| ORM               | TypeORM 0.3                      |
| Manejo de errores | ts-results 3.3                   |
| Base de datos     | PostgreSQL ( con el driver `pg`) |

---

## Estructura del proyecto

```
Code/
├── images/
│   └── schema.svg
├── src/
│   ├── config/
│   │   ├── BaseDatos.ts
│   │   ├── RespuestaHttp.ts
│   │   └── ServidorApp.ts
│   ├── control/
│   ├── dtos/
│   │   ├── Estancia/
│   │   │   ├── RegistrarCheckinDTO.ts
│   │   │   └── RegistrarCheckoutDTO.ts
│   │   ├── Huesped/
│   │   │   ├── ActualizarHuespedDTO.ts
│   │   │   └── CrearHuespedDTO.ts
│   │   ├── Reserva/
│   │   │   ├── CancelarReservaDTO.ts
│   │   │   └── CrearReservaDTO.ts
│   │   ├── TiposHabitacion/
│   │   │   ├── ActualizarTipoHabitacionDTO.ts
│   │   │   └── CrearTipoHabitacionDTO.ts
│   │   └── Usuario/
│   │       ├── AutenticarUsuarioDTO.ts
│   │       └── CrearUsuarioDTO.ts
│   ├── modelos/
│   │   ├── Cancelacion.ts
│   │   ├── Configuracion.ts
│   │   ├── ContactoServicio.ts
│   │   ├── Estancia.ts
│   │   ├── Habitacion.ts
│   │   ├── Huesped.ts
│   │   ├── Reserva.ts
│   │   ├── ReservaHuesped.ts
│   │   ├── TiposHabitacion.ts
│   │   └── Usuario.ts
│   ├── repositorio/
│   │   ├── RepositorioCancelacion.ts
│   │   ├── RepositorioConfiguracion.ts
│   │   ├── RepositorioContactoServicio.ts
│   │   ├── RepositorioEstancia.ts
│   │   ├── RepositorioHabitacion.ts
│   │   ├── RepositorioHuesped.ts
│   │   ├── RepositorioReserva.ts
│   │   ├── RepositorioReservaHuesped.ts
│   │   ├── RepositorioTipoHabitacion.ts
│   │   └── RepositorioUsuario.ts
│   ├── rutas/
│   │   ├── RutaCancelacion.ts
│   │   ├── RutaContactoServicio.ts
│   │   ├── RutaEstancia.ts
│   │   ├── RutaHabitacion.ts
│   │   ├── RutaHuesped.ts
│   │   ├── RutaReserva.ts
│   │   ├── RutaTipoHabitacion.ts
│   │   └── RutaUsuario.ts
│   ├── servicios/
│   │   ├── estrategy/
│   │   │   ├── EstrategiaHabitacion.ts
│   │   │   ├── HabitacionDobleIndividual.ts
│   │   │   ├── HabitacionDobleMatrimonial.ts
│   │   │   ├── HabitacionSimple.ts
│   │   │   └── HabitacionSuite.ts
│   │   ├── factory/
│   │   │   └── FabricaTipoHabitacion.ts
│   │   ├── ServicioCancelacion.ts
│   │   ├── ServicioContactoServicio.ts
│   │   ├── ServicioEstancia.ts
│   │   ├── ServicioHabitacion.ts
│   │   ├── ServicioHuesped.ts
│   │   ├── ServicioReserva.ts
│   │   ├── ServicioReservaHuesped.ts
│   │   ├── ServicioTipoHabitacion.ts
│   │   └── ServicioUsuario.ts
│   ├── presentacion/
│   │   ├── index.css
│   │   ├── index.html
│   │   └── index.tsx
│   └── main.ts
├── package.json
├── skills-lock.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

---

## Base de datos

### Modelo entidad-relación

![Modelo de base de datos](Code/images/schema.svg)

### Enumeraciones

| Enum               | Valores                                                       |
| ------------------ | ------------------------------------------------------------- |
| `EstadoReserva`    | `pendiente`, `activa`, `completada`, `cancelada`              |
| `EstadoHabitacion` | `disponible`, `ocupada`, `mantenimiento`, `fuera_de_servicio` |
| `TipoDocumento`    | `carnet`, `carnet_extranjero`, `pasaporte`, `nit`             |
| `RolUsuario`       | `recepcionista`, `administrador`                              |
| `TipoDato`         | `text`, `integer`, `numeric`, `boolean`, `time`               |

### Índices

| Índice                          | Tabla               | Columnas                               | Tipo            |
| ------------------------------- | ------------------- | -------------------------------------- | --------------- |
| `idx_reserva_huespedes_titular` | `reserva_huespedes` | `id_reserva` WHERE `es_titular = TRUE` | Único parcial   |
| `uq_huespedes_documento`        | `huespedes`         | `(tipo_documento, numero_documento)`   | Único compuesto |
|                                 | `habitaciones`      | `numero_habitacion`                    | Único           |
|                                 | `usuarios`          | `correo`                               | Único           |

### Restricciones CHECK

| Restricción                   | Tabla           | Condición                                                                       |
| ----------------------------- | --------------- | ------------------------------------------------------------------------------- |
| `chk_reservas_fechas`         | `reservas`      | `fecha_checkout > fecha_checkin`                                                |
| `chk_habitaciones_piso`       | `habitaciones`  | `piso >= 0`                                                                     |
| `chk_huespedes_correo`        | `huespedes`     | `correo LIKE '%@%'`                                                             |
| `chk_configuracion_tipo_dato` | `configuracion` | `tipo_dato IN ('text','integer','numeric','boolean','time')`                    |
| `monto_cargo_extra >= 0`      | `estancias`     | `monto_cargo_extra >= 0`                                                        |
| `ck_checkout_consistente`     | `estancias`     | `timestamp_checkout` y `es_late_checkout` deben ser ambos NULL o ambos NOT NULL |

### Clave primaria especial

La tabla `configuracion` usa una clave primaria de tipo `text` (columna `clave`) en lugar de un ID numérico, para permitir que se acceda directamente por el nombre del parámetro.

---

# Historias de Usuario

## HU-01 — Registrar huésped

#### Historia

Como recepcionista quiero registrar los datos básicos de un huésped para poder usar su información al momento de realizar reservas.

#### Criterios de aceptación e implementación

**AC-1:** Dado que la recepcionista accede al formulario de registro, cuando complete los campos obligatorios y guarde, entonces el sistema debe registrar correctamente al huésped.

> `POST /api/huesped` → `ControladorHuesped.registrar()` → `ServicioHuesped.registrar()` → `RepositorioHuesped.save()`. Devuelve 201 con el huésped creado.

**AC-2:** Dado que falta uno o más campos obligatorios, cuando intente guardar el formulario, entonces el sistema debe mostrar validaciones y no registrar al huésped.

> El DTO `CrearHuespedDTO` define los campos requeridos. TypeORM rechaza `NOT NULL` si faltan valores, retornando error 400.

**AC-3:** Dado que ya existe un huésped con el mismo documento de identidad, cuando se intente registrar nuevamente, entonces el sistema debe impedir el duplicado.

> `ServicioHuesped.registrar()` llama `RepositorioHuesped.buscarPorDocumento()` antes de guardar. Si existe, retorna `Err('DOCUMENTO_YA_REGISTRADO')` → HTTP 409.

---

## HU-02 — Crear reserva de habitación

#### Historia

Como recepcionista quiero registrar una reserva asociando huésped, habitación y fechas de estadía para organizar el uso de las habitaciones disponibles del hotel.

#### Criterios de aceptación e implementación

**AC-1:** Dado que existen huéspedes y habitaciones precargadas, cuando el usuario complete los datos requeridos de la reserva, entonces el sistema debe registrarla correctamente.

> `POST /api/reserva` → `ControladorReserva.crear()` → `ServicioReserva.crear()`. Crea la reserva y la asocia al huésped titular en `reserva_huespedes`. Devuelve 201.

**AC-2:** Dado que la fecha de salida no es posterior a la fecha de ingreso, cuando se intente guardar la reserva, entonces el sistema debe impedir el registro.

> La tabla `reservas` tiene el CHECK `fecha_checkout > fecha_checkin`. Si no cumple, la base de datos rechaza la inserción.

**AC-3:** Dado que una habitación ya está reservada en el mismo rango de fechas, cuando se intente registrar una nueva reserva, entonces el sistema debe impedir el solapamiento.

> `ServicioReserva.crear()` llama `RepositorioReserva.tieneConflictoFechas()` usando `LessThan`/`MoreThan` de TypeORM, filtrando solo estados PENDIENTE y ACTIVA. Si hay conflicto retorna `Err('HABITACION_NO_DISPONIBLE')` → HTTP 400.

**AC-4:** Dado que la cantidad de personas supera la capacidad de la habitación, cuando se intente guardar la reserva, entonces el sistema debe rechazarla.

> `ServicioReserva.crear()` compara `dto.cantidad_personas` con `habitacion.tipo_habitacion.capacidad_maxima`. Retorna `Err('CAPACIDAD_EXCEDIDA')` → HTTP 400.

---

## HU-03 — Consultar reservas activas y futuras

#### Historia

Como recepcionista quiero visualizar las reservas registradas del hotel para consultar rápidamente la agenda de hospedajes.

#### Criterios de aceptación e implementación

**AC-1:** Dado que existen reservas registradas, cuando el usuario ingrese al listado, entonces el sistema debe mostrar las reservas activas y futuras con sus datos principales.

> `GET /api/reserva/activas` → `ControladorReserva.listarActivas()` → `ServicioReserva.listarActivas()` → `RepositorioReserva.buscarActivas()`. Filtra `estado IN (PENDIENTE, ACTIVA)` e incluye la relación `habitacion`.

**AC-2:** Dado que las reservas tienen fecha de ingreso, cuando se presenten en la lista, entonces deben aparecer ordenadas cronológicamente.

> `RepositorioReserva.buscarActivas()` aplica `order: { fecha_checkin: 'ASC' }`.

**AC-3:** Dado que no existen reservas para mostrar, cuando el usuario abra la vista, entonces el sistema debe informar que no hay datos disponibles.

> El endpoint retorna un arreglo vacío `[]` cuando no hay reservas.

---

## HU-04 — Registrar check-in

#### Historia

Como recepcionista quiero registrar el check-in de una reserva existente para marcar el ingreso del huésped al hotel.

#### Criterios de aceptación e implementación

**AC-1:** Dado que existe una reserva vigente, cuando el usuario ejecute el check-in, entonces el sistema debe registrar la fecha y hora de ingreso.

> `POST /api/estancia/:idReserva/checkin` → `ControladorEstancia.registrarCheckin()` → `ServicioEstancia.registrarCheckin()`. Crea una `Estancia` con `timestamp_checkin` y actualiza el estado de la reserva a `ACTIVA`. Devuelve 201.

**AC-2:** Dado que la reserva está cancelada, cuando se intente hacer check-in, entonces el sistema debe impedir la operación.

> `ServicioEstancia.registrarCheckin()` verifica `reserva.estado === CANCELADA`. Retorna `Err('RESERVA_CANCELADA')` → HTTP 400.

**AC-3:** Dado que una reserva ya realizó check-in, cuando el usuario intente registrarlo nuevamente, entonces el sistema debe evitar duplicarlo.

> El servicio verifica si ya existe una `Estancia` para esa reserva usando `RepositorioEstancia.buscarPorReserva()`. Retorna `Err('YA_TIENE_CHECKIN')` → HTTP 409.

**AC-4:** Dado que el check-in fue realizado, entonces la reserva debe cambiar a estado de estadía en curso.

> Al guardar la estancia, `ServicioEstancia` actualiza `reserva.estado` a `EstadoReserva.ACTIVA`.

---

## HU-05 — Gestionar variación de tipo de habitación

#### Historia

Como recepcionista quiero seleccionar una variación de habitación al registrar una reserva para que el sistema asigne automáticamente las características base correspondientes a ese tipo.

#### Criterios de aceptación e implementación

**AC-1 y AC-2:** El sistema contempla los tipos: Simple, Suite, Doble Individual y Doble Matrimonial.

> `GET /api/tipo-habitacion` lista todos los tipos registrados. Los cuatro tipos estándar son creados mediante `FabricaTipoHabitacion` + patrón Strategy. Cada tipo es una clase (`HabitacionSimple`, `HabitacionSuite`, `HabitacionDobleIndividual`, `HabitacionDobleMatrimonial`) que implementa `EstrategiaHabitacion`. La fábrica selecciona la estrategia por nombre.

**AC-3:** Dado que el usuario seleccione una variación, el sistema debe asignar automáticamente sus características base.

> `POST /api/tipo-habitacion` con `{ "nombre": "Suite" }` → `ServicioTipoHabitacion.crear()` llama `FabricaTipoHabitacion.crear(nombre)`. Si el nombre es estándar, la estrategia correspondiente retorna `capacidad_maxima` y `precio_referencia` predefinidos.

**AC-4:** Cada variación tiene características distintas visibles en la reserva.

> `GET /api/tipo-habitacion/:id` y `GET /api/habitacion/:id` retornan los datos del tipo con sus características. `RepositorioHabitacion.buscarConTipo()` carga la relación `tipo_habitacion`.

**AC-5:** No se puede registrar una reserva sin variación válida.

> `ServicioReserva.crear()` llama `RepositorioHabitacion.buscarConTipo()`. Si la habitación no existe, retorna `Err('HABITACION_NO_ENCONTRADA')` → HTTP 404.

---

## HU-06 — Visualizar contactos de servicios del hotel

#### Historia

Como recepcionista quiero consultar la lista de contactos de los servicios del hotel para comunicarme rápidamente con las áreas de apoyo.

#### Criterios de aceptación e implementación

**AC-1:** Dado que existen contactos cargados, cuando el usuario ingrese a la página, entonces debe mostrar la lista de contactos disponibles.

> `GET /api/contacto-servicio` → `ControladorContactoServicio.listarActivos()` → `ServicioContactoServicio.listarActivos()` → `RepositorioContactoServicio.buscarActivos()`. Filtra solo contactos activos.

**AC-2:** Deben mostrarse al menos el nombre del servicio, encargado y teléfono.

> La entidad `ContactoServicio` incluye los campos `nombre`, `encargado` y `telefono`. Estos se retornan en el JSON de respuesta.

**AC-3:** Dado que no existe información cargada, entonces el sistema debe informar que no hay contactos.

> El endpoint retorna `[]` cuando no hay registros activos.

---

## HU-08 — Registrar check-out con late check-out

#### Historia

Como recepcionista quiero registrar el check-out de una reserva en curso para cerrar la estadía y aplicar recargo si la salida fue fuera del horario permitido.

#### Criterios de aceptación e implementación

**AC-1:** Dado que una reserva tiene check-in registrado, cuando el usuario realice el check-out, entonces el sistema debe registrar la fecha y hora de salida.

> `PUT /api/estancia/:idReserva/checkout` → `ControladorEstancia.registrarCheckout()` → `ServicioEstancia.registrarCheckout()`. Actualiza la estancia con `timestamp_checkout` y actualiza la reserva a `COMPLETADA`.

**AC-2:** Dado que la reserva no tiene check-in previo, cuando se intente hacer check-out, entonces el sistema debe impedir la operación.

> `ServicioEstancia.registrarCheckout()` busca la estancia con `RepositorioEstancia.buscarPorReserva()`. Si no existe, retorna `Err('ESTANCIA_NO_ENCONTRADA')` → HTTP 404.

**AC-3:** Dado que la salida ocurre después del horario límite, entonces el sistema debe calcular y registrar el cargo por late check-out.

> `ServicioEstancia.registrarCheckout()` obtiene la hora límite con `RepositorioConfiguracion.obtenerTexto('late_checkout_hora_limite', '12:00')`, evalúa `esSalidaTardia()` comparando la hora actual con el límite, y si aplica calcula `monto_cargo_extra` y marca `es_late_checkout = true`.
