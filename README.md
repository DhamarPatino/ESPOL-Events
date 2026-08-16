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
- Extensiones de PHP: `pdo_pgsql`, `pgsql`, `zip`, `mbstring`, `openssl`, `curl`, `intl`, `gd`

Para verificar qué extensiones están activas:

```bash
php -m
```

Si alguna falta, se activa quitando el `;` de la línea correspondiente en el archivo `php.ini`.

## Puesta en marcha

La base de datos del proyecto es **PostgreSQL alojada en Supabase**. Para ejecutar el backend se necesitan las credenciales de conexión, que se solicitan a los integrantes del grupo y **no se incluyen en el repositorio**. El grupo las proporcionará al profesor mediante aula virtual.

### Configuración inicial (solo la primera vez)

Estos pasos se realizan **una sola vez**, al clonar el repositorio por primera vez. El archivo `.env` no está versionado (Git lo ignora), pero será proporcionado por un miembro del grupo por aula virtual o por privado.

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

**3.** Abrir el archivo `.env` y verificar todos los datos estén completos.

**4.** Verificar la conexión:

```bash
php artisan db:show
```

Debe mostrar el motor PostgreSQL y el servidor de Supabase. Las tablas ya están creadas, por lo que no es necesario ejecutar `php artisan migrate`.

**5.** Crear el enlace de almacenamiento público. Sin este paso, las imágenes de los eventos se suben pero no se muestran:

```bash
php artisan storage:link
```

> Las imágenes se guardan en la carpeta `storage/` de cada equipo, no en Supabase. Por eso una imagen subida desde otra computadora no se visualiza localmente, aunque el evento sí aparezca.

### Uso diario

Una vez hecha la configuración inicial, para levantar el backend nuevamente basta con entrar a la carpeta y arrancar el servidor:

```bash
cd ESPOL-Events/backend
```

```bash
php artisan serve
```

Solo necesitas volver a ejecutar `composer install` si cambian las dependencias (por ejemplo, tras un `git pull` que modifique `composer.json`).

Una primera comprobación rápida es abrir `http://localhost:8000/api/events` en el navegador, que devuelve el listado de eventos en JSON.

Para probar el resto de los endpoints se incluye una colección de Postman en [docs/postman/](docs/postman/ESPOL-Events.postman_collection.json), con todas las peticiones listas y organizadas por integrante. Los endpoints de escritura (`POST`, `PUT`, `DELETE`) no pueden probarse desde el navegador, ya que este solo realiza peticiones `GET`.

> Los detalles de la configuración de Supabase, incluida la resolución de problemas frecuentes de
> conexión, están en [docs/SUPABASE.md](docs/SUPABASE.md).

### Alternativa sin credenciales

Si se desea revisar la API sin acceso a la base de datos del grupo, el proyecto también funciona sobre SQLite, se hace lo siguiente:
Crear el archivo de configuración a partir del ejemplo:

```bash
cp .env.example .env
```

**4.** Abrir el archivo `.env` y completar estos tres valores con los datos proporcionados:

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

En este caso la base inicia vacía, por lo que primero debe crearse un evento con `POST /api/events` antes de probar los demás endpoints. Requiere la extensión `pdo_sqlite`. En Linux o macOS, el archivo se crea con `touch database/database.sqlite`.

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

El frontend está desarrollado con React y Vite. Es una aplicación de una sola página que consume la API REST del backend.

```text
frontend/src/
│
├── components/
│   ├── EventCard.jsx          Tarjeta de evento del catálogo
│   ├── Header.jsx             Barra de navegación
│   └── ImagePlaceholder.jsx
│
├── pages/
│   ├── HomePage.jsx               Catálogo, búsqueda y filtros
│   ├── EventDetailPage.jsx        Detalle del evento e inscripción
│   ├── MyRegistrationsPage.jsx    Inscripciones del participante
│   ├── OrganizerDashboardPage.jsx Panel del organizador
│   ├── CreateEventPage.jsx        Formulario de creación y edición
│   ├── FacultiesPage.jsx          Eventos por facultad
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   └── ProfilePage.jsx
│
├── services/
│   ├── eventService.js        Llamadas a los endpoints de eventos
│   └── registrationService.js Llamadas a los endpoints de inscripciones
│
└── App.jsx                    Navegación y sesión del usuario
```

## Requisitos

- Node.js 18 o superior
- El **backend debe estar corriendo** en `http://localhost:8000`, ya que el frontend consume su API

## Instalación

Desde la raíz del proyecto:

```bash
cd frontend
```

```bash
npm install
```

## Ejecución

```bash
npm run dev
```

La aplicación queda disponible en `http://localhost:5173`.

> Se necesitan **dos terminales abiertas al mismo tiempo**: una con `php artisan serve` en la carpeta `backend` y otra con `npm run dev` en `frontend`. Si el catálogo muestra el mensaje "No se pudieron cargar los eventos", es porque el backend no está levantado.

La dirección de la API está definida en los archivos de `src/services/`. Si el backend se levanta en otro puerto, debe actualizarse allí.

## Estado del proyecto

**Avance 1: Backend** — Completado

- Creación de eventos, consulta, búsqueda y filtros — Dhamar Patiño
- Detalle, actualización y eliminación de eventos, y registro y cancelación de participación — Cristina Pihuave

**Avance 2: Frontend** — Completado

- Catálogo de eventos, búsqueda y filtros, creación de eventos e inicio de sesión — Dhamar Patiño
- Detalle del evento, inscripción y cancelación, creación de cuenta y panel del organizador — Cristina Pihuave

**Pendiente**

- Página de perfil de usuario — Dhamar Patiño
- Despliegue de la aplicación — Dhamar Patiño y Cristina Pihuave
