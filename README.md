# Requirements

Application requires database supported by [TypeORM](https://github.com/typeorm/typeorm/blob/master/docs/connection-options.md#common-connection-options).

NodeGyp: https://github.com/nodejs/node-gyp#installation

# Installation

```
> npm install
> npm install gulp-cli -g
```

# Configuration

1. Make `db.config.json` using `src_server/db.config.example.json`
2. Edit databse configuration
```javascript
{
  "type": "postgres",
  "host": "localhost",
  "port": 5432,
  "username": "admin",
  "password": "",
  "database": "game",
  "synchronize": true, // set to false in production
  "logging": false,
  "dropSchema": false // dont set to true in production
}
```
3. You can change some game settings in `server_src/game/data/config.ts`

# Building

```
> npm run build
```

# Run

```
> npm start
```
# Development tools

## Live transpilation

```
> gulp
```

## Server nodemon

```
> gulp server
```

## Auto eslint fix

```
> gulp lint
```

## Cleaning build folder

```
> gulp clean-build
```
