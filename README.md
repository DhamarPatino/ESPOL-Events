# ESPOL Events

Aplicación web para la gestión y centralización de eventos organizados por la ESPOL.

Permite a los organizadores publicar y administrar eventos, y a los usuarios consultarlos, buscarlos por distintos criterios e inscribirse en ellos.

Proyecto de la asignatura de Lenguajes de Programación.

**Integrantes:** Dhamar Patiño Castro y Cristina Pihuave Gómez

---

## Tecnologías

| Componente | Herramientas |
|---|---|
| Backend | PHP, Laravel, API REST |
| Frontend | React, Vite, JavaScript |
| Base de datos | PostgreSQL (Supabase) |
| Almacenamiento de imágenes | Supabase Storage |
| Prototipado | Figma |

---

## Requisitos

- PHP 8.2 o superior, con las extensiones `pdo_pgsql`, `pgsql`, `zip`, `mbstring`, `openssl`, `curl`, `intl` y `gd`
- Composer
- Node.js 18 o superior

Para verificar las extensiones activas de PHP:

```bash
php -m
```

Si falta alguna, se activa quitando el `;` de la línea correspondiente en `php.ini`.

---

## Puesta en marcha

La aplicación necesita **dos servidores corriendo al mismo tiempo**, cada uno en su propia terminal: el backend en el puerto 8000 y el frontend en el 5173.

La base de datos está alojada en Supabase y sus credenciales no se incluyen en el repositorio. El archivo `.env` con la configuración se entrega por aula virtual.

### 1. Clonar el repositorio

```bash
git clone https://github.com/DhamarPatino/ESPOL-Events.git
```

### 2. Backend

```bash
cd ESPOL-Events/backend
```

```bash
composer install
```

Colocar el archivo `.env` proporcionado dentro de la carpeta `backend/` y comprobar la conexión:

```bash
php artisan db:show
```

Debe mostrar el motor PostgreSQL y el servidor de Supabase. Las tablas ya están creadas allí.

Crear el enlace de almacenamiento y levantar el servidor:

```bash
php artisan storage:link
```

```bash
php artisan serve
```

La API queda disponible en `http://localhost:8000/api`. Para comprobarlo, abrir `http://localhost:8000/api/events` en el navegador: devuelve el listado de eventos en formato JSON.

### 3. Frontend

En una **segunda terminal**, desde la raíz del proyecto:

```bash
cd frontend
```

```bash
npm install
```

```bash
npm run dev
```

La aplicación queda disponible en `http://localhost:5173`.

> Si el catálogo muestra "No se pudieron cargar los eventos", es porque el backend no está levantado.

---

## Notas de configuración

**Imágenes de los eventos.** Se comprimen automáticamente (se reducen a 1280 px de ancho y se convierten a WebP) y se suben a Supabase Storage, por lo que quedan accesibles desde cualquier equipo. Si las variables `SUPABASE_URL` y `SUPABASE_SERVICE_KEY` del `.env` están vacías, se guardan en la carpeta local `storage/` y solo se ven en el equipo que las subió; para ese caso es necesario el `php artisan storage:link` del paso 2.

**Dirección de la API.** Está definida en `frontend/src/config.js`. Se puede cambiar sin tocar el código creando un archivo `.env` en la carpeta `frontend/` con la variable `VITE_API_URL`; si no existe, usa `http://127.0.0.1:8000/api`.

**Despliegue.** Los pasos para publicar la aplicación en Render (backend) y Vercel (frontend) están en [docs/DESPLIEGUE.md](docs/DESPLIEGUE.md). 

---

## Pruebas

Desde la carpeta `backend/`:

```bash
php artisan test
```

Se ejecutan sobre una base SQLite en memoria, por lo que no modifican los datos de Supabase.

---

## Endpoints

Todos bajo la ruta base `/api`. En [docs/postman/](docs/postman/ESPOL-Events.postman_collection.json) se incluye una colección de Postman con las peticiones listas para probar.

| Método | Endpoint | Descripción | Responsable |
|---|---|---|---|
| `POST` | `/events` | Crear un evento | Dhamar Patiño |
| `GET` | `/events` | Listar, buscar y filtrar eventos | Dhamar Patiño |
| `POST` | `/login` | Iniciar sesión | Dhamar Patiño |
| `GET` | `/events/{id}` | Consultar el detalle de un evento | Cristina Pihuave |
| `PUT` / `PATCH` | `/events/{id}` | Actualizar un evento | Cristina Pihuave |
| `DELETE` | `/events/{id}` | Eliminar un evento | Cristina Pihuave |
| `GET` | `/events/{id}/registrations` | Listar los participantes inscritos | Cristina Pihuave |
| `POST` | `/events/{id}/registrations` | Registrar participación | Cristina Pihuave |
| `DELETE` | `/events/{id}/registrations/{id}` | Cancelar participación | Cristina Pihuave |
| `GET` | `/registrations?email=` | Consultar las inscripciones de un participante | Cristina Pihuave |
| `POST` | `/register` | Crear una cuenta | Cristina Pihuave |

Los endpoints de escritura (`POST`, `PUT`, `DELETE`) no pueden probarse desde el navegador, ya que este solo realiza peticiones `GET`.

---

## Estado del proyecto

### Avance 1: Backend — Completado

| Implementación | Responsable |
|---|---|
| Creación de eventos | Dhamar Patiño |
| Consulta del catálogo, búsqueda y filtrado | Dhamar Patiño |
| Detalle de un evento | Cristina Pihuave |
| Actualización y eliminación de eventos | Cristina Pihuave |
| Registro y cancelación de participación | Cristina Pihuave |
| Consulta de participantes inscritos | Cristina Pihuave |

### Avance 2: Frontend — Completado

| Implementación | Responsable |
|---|---|
| Formulario de Inicio de Sesión | Dhamar Patiño |
| Catálogo de eventos con búsqueda y filtros | Dhamar Patiño |
| Creación y edición de eventos | Dhamar Patiño |
| Inicio de sesión | Dhamar Patiño |
| Perfil de usuario | Dhamar Patiño |
| Detalle del evento e inscripción | Cristina Pihuave |
| Consulta y cancelación de inscripciones | Cristina Pihuave |
| Creación de cuenta | Cristina Pihuave |
| Panel del organizador | Cristina Pihuave |
| Página de facultades | Cristina Pihuave |

### Pendiente

| Implementación | Responsable |
|---|---|
| Mejorar la presentación visual y la experiencia de uso | Dhamar Patiño y Cristina Pihuave |
| Despliegue de la aplicación | Dhamar Patiño y Cristina Pihuave |
