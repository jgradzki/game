import path from 'path';
import Express from 'express';
import Session from 'express-session';
import sharedsession from 'express-socket.io-session';
import bodyParser from 'body-parser';

import { log } from '../logger';
import EventEmitter from './EventEmitter';
import Config from './Config';
import DB from './DB';
import GameManager from './GameManager';

/**
 * @class
 */
class Server {
	/**
     *
     */
	constructor(config) {
		/**
         * @type {Object}
         */
		this._eventEmitter = new EventEmitter();
		/**
         * @type {Object}
         */
		this._config = new Config(config);
		/**
         * @type {MySQLDB}
         */
		this._database = new DB(
			this.config.get('db.user'),
			this.config.get('db.password'),
			this.config.get('db.db_name'),
			this.config.get('db.adress'),
			this.config.get('db.port'),
			this.config.get('db.dialect')
		);
		/**
         * @type {Object} - HTTP Server
         */
		this._http;
		/**
         * @type {Object} - Express application
         */
		this._app;
		/**
         * @type {Object} - websockets
         */
		this._ws;
		/**
         * @type {Object} - session
         */
		this._session;
		/**
         * @type {GameManager}
         */
		this._gm;


		this._catchProcessExit();
	}

	startServer() {
		this.eventEmitter.emit('SERVER_START_SERVER_START', this);
		log('info', 'Connecting to db.');
		this.db.connect(this.config.get('db.sync', true), this.config.get('db.forceSync', false))
			.then(() => {
				this.eventEmitter.emit('SERVER_CONNECT_TO_DB_SUCCESS', this);
				log('info', 'Setting up http server.');
				return this._setupHttpServer();
			})
			.then(() => {
				this.eventEmitter.emit('SERVER_SETUP_HTTP_SERVER_SUCCESS', this);
				log('info', 'Setting up websockets.');
				return this._setupWebSockets();
			})
			.then(() => {
				this.eventEmitter.emit('SERVER_SETUP_WEBSOCKET_SERVER_SUCCESS', this);
				log('info', 'Setting up game.');
				this._setupGame();
				this.eventEmitter.emit('SERVER_SETUP_GAME_SUCCESS', this);
				log('info', 'Starting...');
				return this._run();
			})
			.then(() => {
				this.eventEmitter.emit('SERVER_START_SERVER_END', this);
				let address = this.httpServer.address();

				log('info', `Server listening at http://${address.address}:${address.port}`);
			})
			.catch(e => {
				this.eventEmitter.emit(
					'SERVER_START_SERVER_ERROR', {
						server: this,
						error: e
					}
				);

				log('error', e);
				process.exit(1);
			});

	}

	closeServer() {
		process.exit(0);
	}

	get eventEmitter() {
		return this._eventEmitter;
	}

	get config() {
		return this._config;
	}

	get db() {
		return this._database;
	}

	get httpServer() {
		return this._http;
	}

	get webApplication() {
		return this._app;
	}

	get webSockets() {
		return this._ws;
	}

	get gameManager() {
		return this._gm;
	}

	destroySession(session) {
		return new Promise((resolve, reject) => {
			this.gameManager.clearSession(session);
			session.destroy(err => {
				if (err) {
					log('error', err);
					reject(err);
				} else {
					resolve();
				}
			});
		});
	}

	_setupGame() {
		this._gm = new GameManager(this);
	}

	_setupHttpServer() {
		this._app = Express();
		this._http = require('http').Server(this._app);

		if ( !this.config.has('session') ) {
			log('warn', 'No session settings in config.');
		}

		//Session
		this._session = Session(this.config.get('session'));
		this._app.use(this._session);

		//Public Folder
		this._app.use(Express.static(path.resolve(__dirname, '..', this.config.get('httpPublicFolder', 'public'))));
		//post
		this._app.use(bodyParser.json());
		this._app.use(bodyParser.urlencoded({ extended: true }));

		this._setupHtppRoutes();
	}

	_setupWebSockets() {
		this._ws = require('socket.io')(this.httpServer);

		//Session
		this._ws.use(sharedsession(this._session));

		this._ws.on('connection', socket => {
			//let session = socket.handshake.session;
		});
	}

	_run() {
		return new Promise((resolve, reject) => {
			this.gameManager.start();

			this.httpServer.listen(
				this.config.get('host.port', 'localhost'),
				this.config.get('host.adress', 3000),
				() => resolve(true)
			);
		});
	}

	_catchProcessExit() {
		process.on('exit', code => this._handleExit(code));
		process.on('SIGINT', code => this._handleExit(code));
		process.on('uncaughtException', err => this._handleUncaughtException(err));
	}

	_onExit() {
		this.eventEmitter.emit('SERVER_CLOSE', this);
		log('info', 'Server close.');
		if (this.gameManager) {
			this.gameManager.onExit(3)
				.then(() => {
					return this.db.connection.sync();
				})
				.then( () => {
					process.exit(3);
				})
				.catch(error => {
					log('error', 'Unable to clean server.', error);
					//What to do exacly here?
				});
		} else {
			process.exit();
		}
	}

	_handleExit(code) {
		if (code !== 3) {
			this._onExit();
		}
	}

	/**
     * @todo Save exception info.
     */
	_handleUncaughtException(error) {
		log('error', error);
		this._onExit();
	}

	_setupHtppRoutes() {
		this.webApplication.get('/', (req, res) => {
			res.sendFile(path.resolve(__dirname, '../server_resources/html/index.html'));
		});

		/*
    	 * @todo auth
    	 */
		this.webApplication.get(
			'/game',
			(req, res, next) => {
				if (!this.gameManager.checkClientSession(req.session)) {
					res.redirect('/');
				} else {
					next();
				}
			},
			(req, res) => {
				res.sendFile(path.resolve(__dirname, '../server_resources/html/main.html'));
			});

		/*this.webApplication.post('/game', auth, (req, res) => {
			res.sendFile(__dirname + '\\server_resources\\html\\gra.html');
		});*/

		//*** Main page post requests
		this.webApplication.post('/', (req, res) => require('../requests/http/loginReq')(req, res, this));
		this.webApplication.post('/register', (req, res) => require('../requests/http/registerReq')(req, res, this));

		//react-router
		this.webApplication.get('*', (req, res) => {
			res.sendFile(path.resolve(__dirname, '../server_resources/html/index.html'));
		});

	}

}

export default Server;
