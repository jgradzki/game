# Requirements

Application requires database supported by TypeORM.

NodeGyp: https://github.com/nodejs/node-gyp#installation

# Installation

```
> npm install
> npm install gulp-cli -g
```

# Configuration

1. Go to `src_server/data/`
2. Make `config.js` using `config.example.js`
2. Edit databse configuration
```javascript
db: {
	adress: '127.0.0.1',
	port: 5432,
	user: '',
	password: '',
	db_name: '',
	dialect: 'postgres'
}
```
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
> gulp eslint
```

## Cleaning build folder

```
> gulp clean-build
```
