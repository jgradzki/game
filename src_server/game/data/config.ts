const config = {
	host: {
		adress: 'localhost',
		port: 3000
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
		unloadPlayerTimeout: 1 // minutes
	},
	player: {
		defaultPlayerOnMapPosition: {
			x: 50,
			y: 100
		},
		playerSpeedOnMap: 50,
		hungerOnMapRate: 2, // rate of hunger increase when moving on map
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

export default config;
