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

## Instalación

Desde la raíz del proyecto:

```bash
cd backend
```

Instalar las dependencias:

```bash
composer install
```

Crear el archivo de configuración:

```bash
cp .env.example .env
```

Completar en `.env` los datos de conexión de Supabase y generar la clave de la aplicación:

```bash
php artisan key:generate
```

Crear las tablas en la base de datos:

```bash
php artisan migrate
```

> La guía detallada para conectar el proyecto con Supabase está en [docs/SUPABASE.md](docs/SUPABASE.md).

## Ejecución

```bash
php artisan serve
```

La API queda disponible en `http://localhost:8000/api`.

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
