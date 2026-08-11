# Conexion del backend con Supabase

Supabase es un servicio que ofrece una base de datos PostgreSQL administrada. El backend de
ESPOL Events se conecta a ella igual que a cualquier otra base de datos relacional, usando el
driver `pgsql` de Laravel. No se necesitan librerias adicionales.

## 1. Crear el proyecto en Supabase

1. Entrar a https://supabase.com y crear una cuenta.
2. Crear un nuevo proyecto (`New project`).
3. Elegir un nombre (por ejemplo `espol-events`), definir una contrasena para la base de datos
   y seleccionar la region mas cercana.
4. Guardar la contrasena, se necesita en el paso siguiente y no se vuelve a mostrar.

## 2. Obtener la cadena de conexion

En el panel del proyecto: **Connect** (o `Project Settings > Database`) y seleccionar
**Session pooler**. Se obtiene algo asi:

```text
postgresql://postgres.abcdefghijklmnop:[YOUR-PASSWORD]@aws-1-us-east-1.pooler.supabase.com:5432/postgres
```

De ahi salen los valores:

| Dato | Valor |
|---|---|
| `DB_HOST` | `aws-1-us-east-1.pooler.supabase.com` |
| `DB_PORT` | `5432` |
| `DB_DATABASE` | `postgres` |
| `DB_USERNAME` | `postgres.abcdefghijklmnop` |
| `DB_PASSWORD` | la contrasena definida al crear el proyecto |

> Se usa el **Session pooler** (puerto 5432) y no la conexion directa porque la conexion directa
> solo responde por IPv6. Tampoco se usa el *Transaction pooler* (puerto 6543) porque no admite
> sentencias preparadas y las migraciones de Laravel fallan.

## 3. Habilitar la extension de PostgreSQL en PHP

Laravel necesita `pdo_pgsql`. Para verificar:

```bash
php -m
```

Si `pdo_pgsql` no aparece, abrir el archivo `php.ini` y quitar el `;` de estas dos lineas:

```ini
extension=pdo_pgsql
extension=pgsql
```

Luego reiniciar la terminal (y Apache si se usa XAMPP).

## 4. Configurar el archivo .env

Desde la carpeta `backend/`:

```bash
cp .env.example .env
```

Completar los valores de Supabase en `.env` y generar la clave de la aplicacion:

```bash
php artisan key:generate
```

El archivo `.env` no se sube al repositorio porque contiene la contrasena. Solo se versiona
`.env.example`.

## 5. Crear las tablas

```bash
php artisan migrate
```

Esto crea en Supabase las tablas `events`, `registrations`, `users`, `cache` y `jobs`. Se pueden
revisar desde el panel de Supabase en la seccion **Table Editor**.

Para verificar la conexion sin ejecutar migraciones:

```bash
php artisan db:show
```

## 6. Levantar el servidor

```bash
php artisan serve
```

La API queda disponible en `http://localhost:8000/api`.

## Notas

- Las busquedas de eventos usan el operador `ilike` cuando el motor es PostgreSQL, para que no
  distinga mayusculas de minusculas.
- Las pruebas automaticas (`php artisan test`) no usan Supabase: corren sobre una base SQLite en
  memoria configurada en `phpunit.xml`, para no modificar los datos reales.
- Si aparece el error `SSL connection has been closed unexpectedly`, verificar que
  `DB_SSLMODE=require` este presente en el `.env`.
