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

	Player.find({
		where: {
			name: 'Admin'
		}
	})
		.then(admin => {
			if (!admin) {
				return server.gameManager.playerManager.createPlayer('Admin', 123456);
			} else {
				return new Promise(resolve => resolve(false));
			}
		})
		.then(created => {
			if (created) {
				log('info', 'Admin account created.');
			}

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
