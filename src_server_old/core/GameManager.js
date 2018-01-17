import _ from 'lodash';
import { log } from '../logger';
import requests from '../requests';
import PlayerManager from './PlayerManager';
import LocationManager from './LocationManager';
import MapManager from './MapManager';

import tasks from '../tasks';

/**
 *
 */
class GameManager {
	/**
	 * @param {Server} server
	 */
	constructor(server) {
		/**
		 * @type {Object}
		 */
		this._server = server;
		/**
		 * @type {Object}
		 */
		this._playerManager = new PlayerManager(server);
		/**
		 * @type {Object}
		 */
		this._mapManager = new MapManager(server.config, server.db);
		/**
		 * @type {Object}
		 */
		this._locationManager = new LocationManager(server.config, server.db, this._mapManager);
		/**
		 * @type {Object}
		 */
		this._tasks = tasks;
		/**
		 * @type {boolean}
		 */
		this._run = false;

		//ItemManager
	}

	get playerManager() {
		return this._playerManager;
	}

	get locationManager() {
		return this._locationManager;
	}

	get mapManager() {
		return this._mapManager;
	}

	/**
	 * @todo Kick players and disable login before saves.
	 */
	async onExit() {
		log('info', 'Processing game shutdown.');
		await this.playerManager.savePlayers();
		await this.mapManager.saveElements();
		await this.locationManager.saveLocations();
	}

	get running() {
		return this._run;
	}

	start() {
		this._startTasks();
	}

	clearSession(session) {
		session.playerID = 0;
		session.name = undefined;
	}

	checkClientSession(session) {
		if (!session.name) {
			return false;
		}

		let player = this.playerManager.getPlayer(session.name);

		if (!player) {
			return false;
		}

		if ( (player.id !== session.playerID) || (player.sessionId !== session.id)) {
			this._server.destroySession();
		} else {
			return true;
		}

		return false;
	}

	handleHttpRequest(webApplication) {
		webApplication.get(
			'/game/logout',
			(req, res) => this._logoutPlayer(req, res)
		);

		webApplication.post(
			'/game/request',
			(req, res, next) => this._authenticatePostRequest(req, res, next),
			(req, res) => this._handlePostRequest(req, res)
		);
	}

	handleWebsocetRequest(socket) {
		let session = socket.handshake.session;

		if (!this.checkClientSession(session)) {
			log('warn', 'unauthorised connection', session);
			socket.disconnect(true);
			return false;
		}

		let player = this.playerManager.getPlayer(session.name);

		if (player.socket) {
			player.socket.emit('anotherLogin');
			player.socket.disconnect(true);
		}
		player.socket = socket;
		this.playerManager.clearDisconnectTimeout(player.name);

		socket.on('action', req => {
			if (!this.checkClientSession(session)) {
				log('warn', 'unauthorised connection', session);
				socket.disconnect(true);
				return false;
			}

			player.activity();
			req.type = req.type.replace('server/', '');

			if (!req.type || !requests.websocket[req.type]) {
				log('warn', 'Unknown request: %j', req);
			} else {
				requests.websocket[req.type](
					req,
					socket,
					this._server,
					player
				);
			}
		});

		socket.on('disconnect', () => {
			this.playerManager.setDisconnectTimeout(player.name);
			//log('info', 'user disconnected');
		});
	}

	_startTasks() {
		this._run = true;

		for (let name in this._tasks) {
			this._requestTaskExecution(name, 0);
		}
	}

	_stopTasks() {
		this._run = false;
	}

	_requestTaskExecution(task, time) {
		if (this._run && this._tasks[task] && _.isFunction(this._tasks[task])) {
			setTimeout(
				() => this._tasks[task](
					time => this._requestTaskExecution(task, time),
					this._server
				),
				_.isNumber(time) ? time : 0
			);
		}
	}

	_handlePostRequest(req, res) {
		if (!req.body.type || !requests.http[req.body.type]) {
			res.send(JSON.stringify({ error: `Invalid request: ${req.body.type}` }));
		} else {
			let player = this.playerManager.getPlayer(req.session.name);

			player.activity();
			requests.http[req.body.type](
				req,
				res,
				this._server,
				player
			);
		}
	}

	_authenticatePostRequest(req, res, next) {
		if (!this.checkClientSession(req.session)) {
			return res.sendStatus(401);
		} else {
			return next();
		}
	}

	_logoutPlayer(req, res) {
		if (this.playerManager.isLoaded(req.session.name)) {
			this.playerManager.unloadPlayer(req.session.name)
				.then(() => {
					log('info', `Players online: ${this.playerManager.getOnlinePlayers().length}`);
				})
				.catch(error => {
					log('error', error);
				});
		}

		this.clearSession(req.session);
		res.redirect('/');
	}
}

export default GameManager;
