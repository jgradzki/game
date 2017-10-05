import { log, initLogger } from './logger';
import Server from './core/Server.js';

initLogger();

log('info', 'Initializing...');
let server = new Server(require('./data/config'));

server.eventEmitter.on('SERVER_CONNECT_TO_DB_PRE', () => {
	log('info', 'Connecting to db...');
});

server.eventEmitter.on('SERVER_START_SERVER_END', server => {
	log('info', 'Server online');
	const Player = server.db.getModel('Player');

	Player.findOrCreate({
		where: {
			name: 'Admin'
		},
		defaults:
		{
			name: 'Admin',
			password: '123456',
			mapPosition: {
				x: 50,
				y: 50
			}
		}
	})
		.spread((player, created) => {
			if (created) {
				log('info', 'Player created.');
			}

			player.getBase()
				.then(base => {
					if (!base) {
						server.gameManager.locationManager.addLocation(
							server.db.getModel('MapElement').ElementTypes.PLAYER_BASE,
							{
								x: 50,
								y: 50
							},
							{
								width: 20,
								height: 20
							},
							{ owner: player.id },
							{},
							'home'
						)
							.then(inventory => {
								player.setBase(inventory);
							});
					}
				});


			player.getInventory()
				.then(inventory => {
					if (!inventory) {
						server.db.getModel('Inventory').create({
							size: server.config.get('player.defaultPlayerInventorySize', 5),
							content: []
						})
							.then(inventory => {
								player.setInventory(inventory);
							});

					}
				});

			return Promise.all([
				server.gameManager.locationManager.addLocation(
					server.db.getModel('MapElement').ElementTypes.DUNGEON,
					{
						x: 150,
						y: 50
					},
					{
						width: 20,
						height: 20
					},
					{ for: player.id },
					{},
					'building'
				),
				server.gameManager.locationManager.addLocation(
					server.db.getModel('MapElement').ElementTypes.DUNGEON,
					{
						x: 100,
						y: 60
					},
					{
						width: 20,
						height: 20
					},
					{ all: true },
					{},
					'building'
				)
			]);
		})
		.then(loc => {
			log('info', `Locations ${loc[0].id}, ${loc[1].id} created.`);

			return server.db.getModel('Player').count();
		})
		.then(count => {
			log('info', `Players in db: ${count}.`);

			return server.db.getModel('MapElement').count();
		})
		.then(count => {
			log('info', `Map elements in db: ${count}.`);

			return Promise.all([
				server.db.getModel('Dungeon').count()
			]);
		})
		.then(counts => {
			let count = 0;

			counts.forEach(v => count += v);
			log('info', `Locations in db: ${count}.`);
		})
		.catch(e => {
			log('error', e);
		});


});

log('info', 'Init complete. Starting.');
server.startServer();
