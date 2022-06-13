# Games Dashboard Project

## About

MVC dashboard build on ExpressJS/NodeJS containing users, games, and scores data. The dashboard is also able to create, read, update, and delete the data.

## Setup

- Make sure you have installed RDBMS.
- Install the required packages.
- Install sequelize-cli to global environment.
- Create a file named `sequelize.config.json` in root folder, adjust the content of this file by your own configurations. Example:

```json
{
  "development": {
    "username": "postgres",
    "password": "password",
    "database": "database_development",
    "host": "localhost",
    "port": 5432,
    "dialect": "postgres"
  },
  "production": {
    "username": "postgres",
    "password": "password",
    "database": "database_production",
    "host": "localhost",
    "port": 5432,
    "dialect": "postgres"
  }
}
```

- Create `.env` file in root folder with this format:

```
DATABASE_USERNAME=---insert your config here---
DATABASE_PASSWORD=---insert your config here---
DATABASE_NAME=---insert your config here---
DATABASE_HOST=---insert your config here---
DATABASE_PORT=---insert your config here---
DATABASE_TYPE=---insert your config here---
APP_PORT=---insert your config here---
ADMIN_USERNAME=---insert your config here---
ADMIN_PASSWORD=---insert your config here---
```

- Run these command in your terminal:

```
sequelize db:create --config './sequelize.config.json'

sequelize db:migrate --config './sequelize.config.json'

sequelize db:seed:all --config './sequelize.config.json'
```

- After successful database creation, mingration, and seeding, you can run the app using:

```
node app.js
```

## Restful API Routes (Users)

| Route                | HTTP   | Body                                                                                                                                                                         | Description                |
| -------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| /api/users           | POST   | `username:String` (required), `password:String` (required), `email:String` (required), `firstname:String` (optional), `lastname: String` (optional)                          | Create a user              |
| /api/users           | GET    | none                                                                                                                                                                         | Get all users data         |
| /api/users/:userUuid | GET    | none                                                                                                                                                                         | Get a user data (detailed) |
| /api/users           | PUT    | `uuid:UUIDV4` (required),`username:String` (required), `password:String` (required), `email:String` (required), `firstname:String` (optional), `lastname: String` (optional) | Update a user data         |
| /api/users/:userUuid | DELETE | none                                                                                                                                                                         | Delete a user data         |

## Restful API Routes (Games)

| Route                | HTTP | Body                                                                                                                                    | Description                |
| -------------------- | ---- | --------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| /api/games           | POST | `title:String` (required), `details:String` (optional), `genre:String` (optional), `imglink:String` (optional)                          | Create a game              |
| /api/games           | GET  | none                                                                                                                                    | Get all games data         |
| /api/games/:gameUuid | GET  | none                                                                                                                                    | Get a game data (detailed) |
| /api/games           | PUT  | `uuid:UUIDV4` (required),`title:String` (required), `details:String` (optional), `genre:String` (optional), `imglink:String` (optional) | Update a game data         |

## Restful API Routes (Scores)

| Route                        | HTTP   | Body                                                  | Description                   |
| ---------------------------- | ------ | ----------------------------------------------------- | ----------------------------- |
| /api/scores/:userUuid        | POST   | `gameid:Number` (required), `score:Number` (required) | Create a game                 |
| /api/scores/user/:userUuid   | GET    | none                                                  | Get scores data per User UUID |
| /api/scores/game/:gameUuid   | GET    | none                                                  | Get scores data per Game UUID |
| /api/scores/score/:scoreUuid | DELETE | none                                                  | Delete a score data           |

## Contact

Gregorius Ferry - [Github Page](https://github.com/grgsferry)
