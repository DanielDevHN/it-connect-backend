# API - IT Manager Documentation

Esta API permite gestionar usuarios, incidentes, solicitudes, categorias utilizando PrismaORM para conectar y gestionar una base de datos PostgreSQL y Swagger para la documentación de la API.

## Tecnologías Usadas

- **Express**: Framework para construir la API.
- **PostgreSQL**: Base de datos relacional para almacenar los datos.
- **PrismaORM**: ORM para interactuar con la base de datos PostgreSQL.
- **Cors**: Middleware para habilitar CORS en la API.
- **JWT**: Para generar token de usuario.
- **Swagger JSDoc y Swagger UI**: Para documentar y visualizar la API.
- **Dotenv**: Para gestionar las variables de entorno, incluida la cadena de conexión a la base de datos.

## Pre-requisitos

- Node.js (versión 14 o superior)
- Git

## Estructura del Proyecto
```
📦src 
 ┣ 📂assets
 ┣ 📂auth
 ┣ 📂categories
 ┣ 📂comments
 ┣ 📂incidents
 ┣ 📂knowledgearticles
 ┣ 📂requests
 ┣ 📂users
 ┣ 📜main.ts
 ┣ 📜package.json
 ┗ 📜README.md
 ```

## Configuración del Ambiente Local

Sigue estos pasos para clonar y ejecutar el proyecto en tu máquina local.

### Paso 1: Clonar el Repositorio

Ejecuta el siguiente comando en tu terminal para clonar el repositorio:

```
git clone https://github.com/DanielDevHN/it-connect-backend.git
```

### Paso 2: Instalar Dependencias

Navega a la carpeta del proyecto e instala las dependencias:

```
cd tu_repositorio
npm install
```

### Paso 3: Configurar Variables de Entorno

Crea un archivo .env en la raíz del proyecto y define la cadena de conexión para la base de datos MongoDB. Aquí tienes un ejemplo:

```
POSTRGRES_URI="your mongodb uri"
```
Nota:: En el repositorio encontraras un archivo .env.example el cual puedes usar para crear tu .env

### Paso 4: Ejecutar el Servidor

Inicia el servidor en modo de desarrollo:

```
npm run dev
```

El servidor debería iniciar en http://localhost:3000 de manera predeterminada.

## Documentación de la API con Swagger

La documentación de la API está disponible en:

http://localhost:3000/api

Consulta la documentación en Swagger para obtener detalles sobre los parámetros y las respuestas de cada endpoint.