/*import Express from 'express'
import Session from 'express-session'
import sharedsession from 'express-socket.io-session'
import createSocketIoMiddleware from 'redux-socket.io'
import bodyParser from 'body-parser'


import { store, initStore } from './server/libs/store'
import { db, initDB } from './server/libs/mysql'
import PlayersManager from './server/libs/player'
import LocationsManager from './server/libs/locationsManager'
import locationsTypes from './server/locations/index'
import MapManager from './server/libs/map'

import config from './server/data/config'

import { playerMoveTick } from './server/intervals/movePlayerOnMap'
*/
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

	//let location;

	/*server.db.getModel('MapElement').create({
		type: server.db.getModel('MapElement').ElementTypes.DUNGEON,
		mapPosition: { x: 0, y: 0 },
		size: { width: 20, height: 20 }
	})
	.then(cos => {
		location = cos;
		return server.db.getModel('Dungeon').create({
			rooms: {'cos':true},
			entryRoom: true
		});
	})
	.then(cos => {
		return cos.setMapPosition(location);
	})
	.then( co => {
		co.mapPosition = location;
		//console.log(co);
		//console.log(co.mapPosition)
		return co.getMapPosition();
	})
	.then( data => {
		//console.log(data);
	})
	.catch(e => {
		console.log(e)
	});*/

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
			}
			return Promise.all([
				server.gameManager.locationManager.addLocation(
					server.db.getModel('MapElement').ElementTypes.DUNGEON,
					{ x: 50,
						y: 50 },
					{ width: 20,
						height: 20 },
					{ for: player.id },
					{},
					'building'
				),
				server.gameManager.locationManager.addLocation(
					server.db.getModel('MapElement').ElementTypes.DUNGEON,
					{ x: 100,
						y: 60 },
					{ width: 20,
						height: 20 },
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


/*
process.stdin.resume();
let stdin;
let didExit = false;
const stopServer = (err) => {
	if(didExit) return;
	didExit=true;
	log('info', 'Server stop');
	if(err) log('error', 'ERRRRRRRRRROOOOOOOOOORRRRRRRRR', err)
	if(io) io.emit('SERVER_SHUTDOWN');
	if(http) http.close();
	if(db.disconnect) db.disconnect();
	process.exit(0);
}
const startServer = () => {
	log('info', 'Server start')
	stdin = process.openStdin();
	stdin.addListener("data", function(d) {
		let command = d.toString().trim();
		switch (command) {
			case 'close':
				stopServer();
				break;
			default:
				console.log('Unknown command:' + command);
		}
	});
	setTimeout(playerMoveTick, 100);
	http.listen(store.getState().config.server.port, store.getState().config.server.ip, function() {
		//http.listen(process.env.PORT, function(){
		var host = http.address().address
		var port = http.address().port
		log('info', "Server listening at http://%s:%s", host, port)
	});
}

//do something when app is closing
process.on('exit', stopServer);

//catches ctrl+c event
process.on('SIGINT', stopServer);

//catches uncaught exceptions
process.on('uncaughtException', stopServer);


console.log('Initializing logger');
initLogger();

log('info', 'Creating store...')
initStore(config);
store.subscribe(() => {
	//console.log(store.getState());
})

log('info', 'Initializing MapManager...');
MapManager.init();

log('info', 'Initializing locations...');
LocationsManager.addLocationType('playerBase', locationsTypes.PlayerBase)
LocationsManager.addLocationType('dungeon', locationsTypes.Dungeon)

LocationsManager.addNewLocation('playerBase', { x: 50, y: 100 }, { width: 20, height: 20 }, { owner: 1}, true);
LocationsManager.addNewLocation('playerBase', { x: 100, y: 100 }, { width: 20, height: 20 }, { owner: 2}, true);
LocationsManager.addNewLocation('dungeon', { x: 150, y: 100 }, { width: 20, height: 20 }, { global: true}, true);
LocationsManager.addNewLocation('dungeon', { x: 140, y: 280 }, { width: 20, height: 20 }, { global: true}, true);

//MapManager.addNewElement('home', { x: 50, y: 100 }, { width: 20, height: 20 }, { owner: 1 }, true);
//MapManager.addNewElement('home', { x: 100, y: 100 }, { width: 20, height: 20 }, { owner: 2 }, true);
//MapManager.addNewElement('building', { x: 150, y: 100 }, { width: 20, height: 20 }, { for: 'global', rooms: rollRooms('randomV3', { min: 5, max: 10, width: 5, height: 5 }) }, true);
//MapManager.addNewElement('building', { x: 140, y: 280 }, { width: 20, height: 20 }, { for: 'global', rooms: rollRooms('randomV3', { min: 5, max: 10, width: 5, height: 5 }) }, true);

log('info', 'Initializing database...')
initDB('127.0.0.1', undefined, 'bt', 'reskuletuw', 'bt'); //
db.connection.on('error', function(err) {
	log('error', err);
	if (err.fatal == true) {
		stopServer();
	}
});


log('info', 'Setting up http server...')
var app = Express();
var http = require('http').Server(app);
var io = require('socket.io')(http);


let session = Session({
	secret: 'fasdhntg4652nt',
	resave: true,
	saveUninitialized: true
});

app.use(session);
io.use(sharedsession(session));
//
app.use(Express.static('public'));

//post
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//old session
/*
var sessionMiddleware = esession({
    secret: 'ssshhhhh',
    resave: false,
    saveUninitialized: false
});
io.use(function(socket, next) {
    sessionMiddleware(socket.request, socket.request.res, next);
});
app.use(sessionMiddleware);*/
//app.use(session({secret: 'ssshhhhh', resave: false, saveUninitialized: false}));


/*

const auth = (req, res, next) => {
	if (!req.session.login) return res.redirect('/');
	let player = PlayersManager.getPlayer(req.session.playerID);

	if (!player) return res.redirect('/');

	if (player.getSessionID() !== req.session.id) {
		req.session.destroy(function(err) {
			if (err) {
				log('error', err);
			}
			return res.redirect('/');
		});
	} else {
		return next();
	}
}

const checkPlayerSession = (session) => {
	if (!session.login) return false
	let player = PlayersManager.getPlayer(session.playerID);

	if (!player) return false

	if (player.getSessionID() !== session.id) {
		session.destroy(function(err) {
			if (err) {
				log('error', err);
			}
			return false
		});
	} else {
		return true;
	}
}

const authPost = (req, res, next) => {
	if(!checkPlayerSession(req.session)){
		return res.send('{error: "auth"}');
	}else{
		return next();
	}
	/*if (!req.session.login) return res.send('{error: "auth"}');
	let player = PlayersManager.getPlayer(req.session.playerID);

	if (!player) return res.send('{error: "auth"}');

	if (player.getSessionID() !== req.session.id) {
		req.session.destroy(function(err) {
			if (err) {
				log('error', err);
			}
			return res.send('{error: "auth"}');
		});
	} else {
		return next();
	}*/
/*
}
/*
var sess;


app.get('/', function(req, res) {
	res.sendFile(__dirname + '\\server_resources\\html\\index.html');
});

app.get('/game', auth, function(req, res) {
	res.sendFile(__dirname + '\\server_resources\\html\\gra.html');
});

app.post('/game', auth, function(req, res) {
	res.sendFile(__dirname + '\\server_resources\\html\\gra.html');
});

app.get('/logout', function(req, res) {
	req.session.destroy(function(err) {
		if (err) {
			log('error', err);
		}
		res.redirect('/');
	});
});

//*** Main page post requests
app.post('/', require('./server/requests/loginReq'));

app.post('/register', require('./server/requests/registerReq'));

//*** GAME POST REQUESTS
app.post('/game/request', authPost, require('./server/requests'));
/////

app.get('*', function(req, res) {
	res.sendFile(__dirname + '\\server_resources\\html\\index.html');
});

log('info', 'Setting up socket.io')
io.on('connection', function(socket) {
	let session = socket.handshake.session;

	if (!checkPlayerSession(session)) {
		log('warn', 'unauthorised connection');
		socket.disconnect(true);
	} else {

		log('info', 'a user connected: %s', session.login)
		let player = PlayersManager.getPlayer(session.playerID);
		player.disableDisconnectTimeout();
		if (player.getSocket()) {
			player.getSocket().emit('anotherLogin');
			player.getSocket().disconnect(true);
		}
		player.setSocket(socket);
		socket.emit('action', { type: 'changePlayerPosition', newPosition: player.getMapPosition() });
		socket.emit('action', { type: 'changeDestination', position: player.getMapTarget() });
	}
	socket.on('action', (action) => {
		if (!checkPlayerSession(session)) {
			log('warn', 'unauthorised connection');
			socket.disconnect(true);
		} else {
			let player = PlayersManager.getPlayer(session.playerID);
			switch (action.type) {
				case 'server/changeDestination':
					if(player.inLocation()){
						socket.emit('showError', { msg: 'Nie możesz się poruszać gdy jesteś w lokacji' });
					}else{
						let ms = store.getState().config.mapSize;
						if (
							(action.position.x < 0) ||
							(action.position.y < 0) ||
							(action.position.x > ms.width) ||
							(action.position.y > ms.height)
						) {
							log('warn', 'Player %s(%d) requested destination change with wrong coordinates: %j', player.getName(), player.getID(), action.position);
							socket.emit('showlog', 'Bad coordinates, please contact developers.');
						} else {
							//PlayersManager.setPlayerMapTarget(session.playerID, action.position);
							player.setMapTarget(action.position);
							socket.emit('action', { type: 'changeDestination', position: action.position });
						}
					}
					break;
				case 'server/locationAction':
					if(player.inLocation()){
						LocationsManager.getLocationHandler(player.inLocation()).onAction(player.inLocation(), player, action.data);
					}else{
						socket.emit('showlog', 'You are not in location');
					}
					break;
				default:
					log('error', 'Unknown action: %j', action)
			}
		}
	});
	socket.on('disconnect', function() {
		let player = PlayersManager.getPlayer(session.playerID);
		player.setDisconnectTimeout(session);
		log('info', 'user disconnected');
	});
});


const handleDBconnect = (err) => {
	if (!err) {
		startServer();
	} else {
		process.exit(0);
	}
}

log('info', 'Connecting to db')
db.connect(handleDBconnect);
*/
