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
- API REST

### Base de datos

- Pendiente de configuración

### Prototipado

- Figma

### Control de versiones

- Git
- GitHub

---

# Backend

El backend será desarrollado utilizando PHP y expondrá una API REST para permitir la comunicación con el frontend.

## Configuración

La estructura y configuración definitiva del backend se establecerán durante la siguiente etapa del proyecto.

La estructura prevista es:

```text
backend/
│
├── public/
│   └── index.php
│
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── config/
│
└── ...
```

## Ejecución

Una vez configurado el backend, podrá ejecutarse mediante el servidor integrado de PHP:

```bash
cd backend
php -S localhost:8000
```

> La estructura definitiva y los comandos de ejecución se actualizarán una vez finalizada la configuración del backend.

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

Estado: Pendiente

Integrante 1: Dhamar Patiño
 Implementar creación de eventos.
 Implementar consulta de eventos.
 Implementar búsqueda de eventos.
 Implementar filtros por categoría.
 Implementar filtros por fecha.
 Implementar filtros por facultad.
Integrante 2: Cristina Pihuave
 Implementar consulta del detalle de un evento.
 Implementar actualización de eventos.
 Implementar eliminación de eventos.
 Implementar registro de participantes.
 Implementar cancelación de participación.
Pruebas y documentación
 Realizar pruebas de endpoints.
 Probar endpoints utilizando Postman, navegador o consola.
 Capturar evidencias del backend funcionando.
 Actualizar la documentación del avance.
 Registrar los cambios en GitHub.
