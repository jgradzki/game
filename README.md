# Requirements

Application requires database supported by [TypeORM](https://github.com/typeorm/typeorm/blob/master/docs/connection-options.md#common-connection-options).

NodeGyp: https://github.com/nodejs/node-gyp#installation

# Installation

```
> npm install
> npm install gulp-cli -g
```

# Configuration

1. Make `ormconfig.json` using `ormconfig.example.json`
2. Edit databse configuration
```javascript
{
  "type": "postgres",
  "host": "127.0.0.1",
  "port": 5432,
  "username": "root",
  "password": "",
  "database": "game",
  "entities": ["./src_server/**/**.entity.ts"], // dont change it
  "synchronize": true // set this to false in production
}
```
3. You can change some game settings in `/server_src/game/data/config.ts`

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

## Server

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
