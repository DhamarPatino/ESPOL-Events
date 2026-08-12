# ESPOL Events

Aplicación web para la gestión y centralización de eventos organizados por la ESPOL.

## Descripción

ESPOL Events es una aplicación web cuyo objetivo es centralizar la publicación y consulta de eventos organizados por la Escuela Superior Politécnica del Litoral (ESPOL).

La plataforma permitirá que los organizadores publiquen y administren sus eventos, mientras que los usuarios podrán consultar las actividades disponibles, buscar eventos según diferentes criterios y registrarse en aquellos que requieran inscripción.

El proyecto será desarrollado como parte de la asignatura de Lenguajes de Programación.

---

## Objetivo del proyecto

Desarrollar una plataforma web que facilite el acceso a la información de eventos de ESPOL mediante un espacio centralizado para su publicación, consulta y gestión.

---

## Tecnologías

### Frontend

- React
- JavaScript
- HTML5
- CSS3
- Vite

### Backend

- PHP
- Laravel
- API REST

### Base de datos

- PostgreSQL (Supabase)

### Prototipado

- Figma

### Control de versiones

- Git
- GitHub

---

# Backend

El backend está desarrollado con PHP y el framework Laravel, y expone una API REST que consume el frontend.

```text
backend/
│
├── app/
│   ├── Http/Controllers/
│   │   ├── EventController.php
│   │   └── RegistrationController.php
│   └── Models/
│       ├── Event.php
│       └── Registration.php
│
├── database/migrations/
├── routes/api.php
└── tests/Feature/
```

## Requisitos

- PHP 8.2 o superior
- Composer
- Extensiones de PHP: `pdo_pgsql`, `pgsql`, `zip`, `mbstring`, `openssl`, `curl`, `intl`

Para verificar qué extensiones están activas:

```bash
php -m
```

Si alguna falta, se activa quitando el `;` de la línea correspondiente en el archivo `php.ini`.

## Puesta en marcha

La base de datos del proyecto es **PostgreSQL alojada en Supabase**. Para ejecutar el backend se
necesitan las credenciales de conexión, que se solicitan a los integrantes del grupo y **no se
incluyen en el repositorio**.

**1.** Clonar el repositorio y entrar a la carpeta del backend:

```bash
git clone https://github.com/DhamarPatino/ESPOL-Events.git
```

```bash
cd ESPOL-Events/backend
```

**2.** Instalar las dependencias:

```bash
composer install
```

**3.** Crear el archivo de configuración a partir del ejemplo:

```bash
cp .env.example .env
```

**4.** Abrir el archivo `.env` y completar estos tres valores con los datos proporcionados:

```ini
DB_HOST=
DB_USERNAME=
DB_PASSWORD=
```

Las demás variables (`DB_CONNECTION`, `DB_PORT`, `DB_DATABASE` y `DB_SSLMODE`) ya vienen con el
valor correcto y no se modifican.

**5.** Generar la clave de la aplicación:

```bash
php artisan key:generate
```

**6.** Verificar la conexión:

```bash
php artisan db:show
```

Debe mostrar el motor PostgreSQL y el servidor de Supabase. Las tablas ya están creadas, por lo
que no es necesario ejecutar `php artisan migrate`.

**7.** Levantar el servidor:

```bash
php artisan serve
```

La API queda disponible en `http://localhost:8000/api`. Una primera comprobación rápida es abrir
`http://localhost:8000/api/events` en el navegador, que devuelve el listado de eventos en JSON.

Para probar el resto de los endpoints se incluye una colección de Postman en
[docs/postman/](docs/postman/ESPOL-Events.postman_collection.json), con todas las peticiones
listas y organizadas por integrante. Los endpoints de escritura (`POST`, `PUT`, `DELETE`) no
pueden probarse desde el navegador, ya que este solo realiza peticiones `GET`.

> Los detalles de la configuración de Supabase, incluida la resolución de problemas frecuentes de
> conexión, están en [docs/SUPABASE.md](docs/SUPABASE.md).

### Alternativa sin credenciales

Si se desea revisar la API sin acceso a la base de datos del grupo, el proyecto también funciona
sobre SQLite, que no requiere servidor. En el paso 4, en lugar de los datos de Supabase, se
reemplazan todas las líneas que empiezan con `DB_` por estas dos:

```ini
DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite
```

Luego se crea el archivo de la base y se ejecutan las migraciones:

```bash
type nul > database\database.sqlite
```

```bash
php artisan migrate
```

En este caso la base inicia vacía, por lo que primero debe crearse un evento con
`POST /api/events` antes de probar los demás endpoints. Requiere la extensión `pdo_sqlite`. En
Linux o macOS, el archivo se crea con `touch database/database.sqlite`.

## Pruebas

```bash
php artisan test
```

Las pruebas se ejecutan sobre una base de datos SQLite en memoria, por lo que no modifican los datos de Supabase.

## Endpoints

| Método | Endpoint | Descripción | Responsable |
|---|---|---|---|
| `POST` | `/api/events` | Crear un evento | Dhamar Patiño |
| `GET` | `/api/events` | Listar, buscar y filtrar eventos | Dhamar Patiño |
| `GET` | `/api/events/{id}` | Consultar el detalle de un evento | Cristina Pihuave |
| `PUT` / `PATCH` | `/api/events/{id}` | Actualizar un evento | Cristina Pihuave |
| `DELETE` | `/api/events/{id}` | Eliminar un evento | Cristina Pihuave |
| `GET` | `/api/events/{id}/registrations` | Listar los participantes inscritos | Cristina Pihuave |
| `POST` | `/api/events/{id}/registrations` | Registrar participación | Cristina Pihuave |
| `DELETE` | `/api/events/{id}/registrations/{id}` | Cancelar participación | Cristina Pihuave |

En `docs/postman/` se incluye una colección de Postman con todas las peticiones listas para probar.

# Frontend

El frontend está desarrollado utilizando React y Vite.

## Instalación

Desde la raíz del proyecto:

```bash
cd frontend
```

Instalar las dependencias:

```bash
npm install
```

## Ejecución

Ejecutar el servidor de desarrollo:

```bash
npm run dev
```

## Avance 1: Backend

Estado: Completado

- Creación de eventos y consulta con búsqueda y filtros — Dhamar Patiño
- Detalle, actualización y eliminación de eventos, y registro y cancelación de participación — Cristina Pihuave
