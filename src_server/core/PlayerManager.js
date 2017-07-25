import { log } from '../logger';

/**
 *
 */
class PlayerManager {
	/**
	 * @param {Server} server
	 */
	constructor(server) {
		/**
		 * @type {Server}
		 */
		this._server = server;

		this._players = [];
	}

	getPlayer(name) {
		let player = this._players.filter(player => player.name === name)[0];

		if (!player) {
			return undefined;
		} else {
			return player;
		}
	}

	getPlayers() {
		return this._players;
	}

	getPlayersInMemoryCount() {
		return this._players.length;
	}


	loadPlayer(player) {
		if (player && (player instanceof this._server.db.getModel('Player'))) {
			if (this._players.filter(p => p.name === player.name)) {
				this._players.push(player);
			}
		} else {
			throw new TypeError('player must be instance of Player model.');
		}
	}

	isLoaded(name) {
		let player = this._players.filter(player => player.name === name)[0];

		if (!player) {
			return false;
		} else {
			return true;
		}
	}

	async unloadPlayer(name) {
		if (!this.isLoaded(name)) {
			return;
		}

		let player = this.getPlayer(name);

		await player.save()
			.then(() => {
				player.inventory.save();
				this._players = this._players.filter(player => player.name !== name);
			})
			.catch(err => {
				log('error', err);
			});
	}

	async findPlayer() {
		try {
			let player = await this._server.db.getModel('Player').findOne({
				where: {
					name
				}
			});

			if (player) {
				this.loadPlayer(player);
				return player;
			} else {
				return undefined;
			}

		} catch (error) {
			log('error', error);
			return undefined;
		}
	}

	async savePlayers() {
		let playersSaved = 0;

		Promise.all(this._players.map(player => {
			return player.save()
				.then(() => playersSaved++)
				.catch(err => log('error', err));
		}))
			.then(() => log('info', `Players saved: ${playersSaved}`))
			.catch(err => log('error', err));


	}

	setDisconnectTimeout(name) {
		if (!this.isLoaded(name)) {
			return;
		}

		let player = this.getPlayer(name);

		player.disconnectTimeout = setTimeout(() => {
			this.unloadPlayer(player.name)
				.then(() => {
					log('info', `Players online: ${this.getPlayers().length}`);
				});

		}, this._server.config.get('gameServer.unloadPlayerTimeout', 10)*60*1000);
	}

	clearDisconnectTimeout(name) {
		if (!this.isLoaded(name)) {
			return;
		}
		clearTimeout(this.getPlayer(name).disconnectTimeout);
	}
}

export default PlayerManager;
