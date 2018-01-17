let config = {
	host: {
		//ip: '192.168.1.246',
		adress: 'localhost',
		port: 3000
	},
	db: {
		adress: '127.0.0.1',
		port: 5432,
		user: 'bt',
		password: 'reskuletuw',
		db_name: 'bt',
		dialect: 'postgres',
		sync: true,
		forceSync: true
	},
	session: {
		secret: 'fasdhntg4652nt',
		resave: true,
		saveUninitialized: true
	},
	httpPublicFolder: 'public',
	site: {
		enableRegister: true
	},
	gameServer: {
		tickrate: 10, //ticks per second
		sendingPositionOnMapInterval: 5, //seconds
		unloadPlayerTimeout: 1 //minutes
	},
	player: {
		defaultPlayerOnMapPosition: {
			x: 50,
			y: 100
		},
		playerSpeedOnMap: 50,
		hungerOnMapRate: 2, //rate of hunger increase when moving on map
		hungerDamage: {
			90: 5,
			70: 3,
			50: 1
		},
		defaultPlayerInventorySize: 10
	},
	world: {
		mapSize: {
			width: 1794,
			height: 797
		}
	},
	features: {

	}
};

module.exports = config;
