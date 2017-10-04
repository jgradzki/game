# Requirements
Application requires database supported by Sequelize and which supports Sequelize.ARRAY (Only PostgreSQL for now).

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
