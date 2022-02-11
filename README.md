# Introducción
**point_of_sale** es un proyecto de gestión digital que implementa tecnologías tales como:
- Graphql
- Express
- PostgreSQL
- Webhooks
- Sequelize ORM
- Migraciones
- Node

# 🏃 Pasos iniciales
## 🔨 Variables de entorno
Dentro del proyecto se encuentra una carpeta llamada **config** en la que encontraremos nuestros archivos de configuración para inicializar correctamente nuestro servidor (credenciales, variables de ambiente, etc.)
- **env.js** Archivo que contiene las configuraciones de nuestro ambiente (credenciales de mercado pago, credenciales de imagekit, host y puerto)
- **config.json** Archivo que contiene las configuraciones del ORM para que se conecte con nuestra base de datos

## ⚙️ Correr el proyecto
```
npm i
npm start
```
o
```
npm i
npm start:dev
```
La diferencia entre `npm start` con respecto a `npm start:dev` es que corre el servidor de forma normal, sin embargo al incluir `:dev` corre el servidor con nodemon

# 📚 Documentación de API
Toda la documentación puede ser consultada a través de [apollo studio](https://studio.apollographql.com/sandbox/explorer). Aquí podremos encontrar los schemas, los queries y los mutations. A su vez, se puede probar la API con dicha herramienta.

# Sequelize ORM
Para este proyecto se implementó Sequelize ORM para la comunicación y gestión de la base de datos.
## 🏃 Correr migraciones
La primera vez que correremos nuestro servidor, es importante correr las migraciones para tener nuestra base de datos debidamente configurada.
Para ello, basta con correr
```
npm migrate
```
NOTA: Antes de correr las migraciones es necesario tener instalado **postgreSQL**, haber configurado las **credenciales** y haber corrido el comando `npm i`

## ⚙️ Crear una nueva migración
Internamente, el proyecto maneja **sequelize-cli** para ayudarnos a crear y correr migraciones. Para crear una nueva migración junto con su modelo, basta con ejecutar el siguiente comando:

```
npx sequelize-cli model:generate --name <TABLE_NAME> --attributes <ATT_NAME>:<ATT_TYPE>,...
```
Por ejemplo:
```
npx sequelize-cli model:generate --name user --attributes firstName:string,lastName:string,email:string
```