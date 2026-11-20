# Santex Academy - FootballAPI

Aplicación full-stack para explorar, filtrar, visualizar, crear y editar jugadores de FIFA (dataset de jugadores masculinos), desarrollada para el Challenge Individual de XAcademy 2026.

## Funcionalidades implementadas

- **Autenticación de usuarios**: registro e inicio de sesión con JWT. Todas las rutas de jugadores están protegidas tanto en el backend como en el frontend.
- **Listado de jugadores**: tabla paginada con filtros por nombre, club y posición.
- **Exportación a CSV**: descarga del listado filtrado directamente desde la vista principal.
- **Detalle del jugador**: ficha individual con sus datos y un gráfico tipo radar (Chart.js) para visualizar sus estadísticas clave (*Rating, Velocidad, Tiro, Regate y Pase*).
- **Creación y edición**: formulario reutilizable para dar de alta nuevos jugadores o actualizar los existentes.

## Decisiones técnicas

### Backend (`football-api/backend`)
- **NestJS + Sequelize + MySQL 8**: se estructuró el módulo de jugadores (`PlayersModule`) usando el patrón **Repository** mediante la interfaz `IPlayerRepository` inyectada en `PlayersService`. De esta forma la lógica de negocio queda desacoplada del ORM (`SequelizePlayerRepository`).
- **DTOs y validación**: se configuró un `ValidationPipe` global (`whitelist: true`, `transform: true`) junto con `class-validator` para validar entradas y query params (`QueryPlayerDto`, `CreatePlayerDto`, `UpdatePlayerDto`) y formatear las respuestas (`PlayerDto`).
- **Seguridad con JWT**: se implementó `AuthModule` con `bcryptjs` para el hash de contraseñas y `passport-jwt` (`JwtAuthGuard`) protegiendo todos los endpoints de `/api/players`.
- **Documentación**: se integró Swagger con soporte Bearer Auth disponible en `/api/docs`.

### Frontend (`football-api/frontend`)
- **Angular 20 (Standalone Components)**: se optó por componentes standalone sin `NgModules` para simplificar la estructura (`LoginComponent`, `PlayerListComponent`, `PlayerComponent`, `PlayerFormComponent`).
- **Rutas protegidas e interceptor**: `authGuard` restringe el acceso a las vistas de jugadores si no hay sesión iniciada, y un `authInterceptor` adjunta automáticamente el token JWT en las peticiones al backend.
- **Visualización**: se eligió **Chart.js** en el componente de detalle para mostrar de forma clara las métricas del jugador en un gráfico radar.

### Base de datos e infraestructura
- Se cargó el dataset de jugadores masculinos en MySQL mediante [init.sql](football-api/docker/db/init.sql) montado en el contenedor de Docker, de modo que al levantar el proyecto la base ya queda lista para usar sin pasos manuales.

---

## Pasos para correr

1. Instalar Docker Desktop: Si no lo tienen, es el primer paso.
2. Clonar tu repositorio: 
   
   ```bash
   git clone <URL_DE_TU_REPOSITORIO>
   ```
3. Navegar a la carpeta del proyecto:
    ```bash
    cd football-api
   ```
4. Copiar las variable de entorno del archivo de ejemplo al de ambiente
    ```bash
    cp .env.sample .env
   ```
5. Levantar todo con: 
   ```bash
    docker compose up
   ```

## Alternativa
Aca las instruciones para correr cada servicio por separado

### Reiniciar los datos

``` bash
docker compose down -v # Esto detiene los contenedores y elimina los volúmenes (incluido db_data)
docker compose up -d   # Esto vuelve a crear todo desde cero, ejecutando init.sql
```

### Conectarse a MySQL desde el Terminal / Consola

```bash
mysql -h 127.0.0.1 -P 3306 --user=football_api --password=password football_db
```

```bash
mysql> SHOW TABLES;
```

```bash
mysql> SELECT * FROM users;
```

```bash
mysql> exit;
```

### Inicializar API

```bash
$ npm install
```

### Compilar y correr el BackEnd

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
