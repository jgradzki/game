let config = {
	host: {
		//ip: '192.168.1.246',
		adress: 'localhost',
		port: 3000
	},
	db: {
		adress: '127.0.0.1',
		port: 5432,
		user: '',
		password: '',
		db_name: '',
		dialect: 'postgres',
		sync: true,
		forceSync: false
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
		sendingPositionOnMapInterval: 10, //seconds
		unloadPlayerTimeout: 5 //minutes
	},
	player: {
		defaultPlayerOnMapPosition: {
			x: 50,
			y: 100
		},
		playerSpeedOnMap: 50,
		defaultPlayerInventorySize: 3
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
