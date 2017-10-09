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
		this._playerModel = this._server.db.getModel('Player');

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

	getOnlinePlayers() {
		return this._players.filter(player => player.onlineStatus);
	}

	getPlayersInMemoryCount() {
		return this._players.length;
	}


	loadPlayer(player) {
		if (player && (player instanceof this._playerModel)) {
			if (this._players.filter(p => p.name === player.name)) {
				this._players.push(player);
			}
		} else {
			throw new TypeError(`laodPlayer: player must be instance of Player model. Value: ${player}`);
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

		player.onLogout();
		await player.save()
			.then(() => {
				this._players = this._players.filter(player => player.name !== name);
				return player.inventory.save();
			})
			.catch(err => {
				log('error', err);
			});
	}

	async findPlayer(name) {
		try {
			let player = await this._playerModel.findOne({
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

	createPlayer(name, password, position) {
		return new Promise((resolve, reject) => {
			this.findPlayer(name)
				.then(player => {
					if (player) {
						reject('Username already taken.');
						return;
					}

					return this._playerModel.create({
						name,
						password,
						mapPosition: this._findStartPosition(position)
					});
				})
				.then(player => {
					return Promise.all([
						player,
						this._createPlayerInventory(player),
						this._createPlayerBase(player),
						this._createFirstDungeon(player)
					]);
				})
				.then(results => resolve(results[0]))
				.catch(error => reject(error));
		});
	}

	checkPlayerAssociations(player) {
		return new Promise((resolve, reject) => {
			if (player && (player instanceof this._playerModel)) {
				Promise.all([
					player.getInventory(),
					player.getBase()
				])
					.then(results => {
						let toFix = [];

						if (!results[0]) {
							toFix.push(this._createPlayerInventory(player));
						}
						if (!results[1]) {
							toFix.push(this._createPlayerBase(player));
						}
						if (toFix.length > 0) {
							Promise.all(toFix)
								.then(() => resolve(player))
								.catch(error => reject(error));
						} else {
							resolve(player);
						}
					})
					.catch(error =>	reject(error));
			} else {
				throw new TypeError(`checkPlayerAssociations: player must be instance of Player model. Value: ${player}`);
			}
		});
	}

	_findStartPosition(position = 'default') {
		if (position === 'default' || !position.x || !position.y) {
			return this._server.config.get(
				'player.defaultPlayerOnMapPosition',
				{
					x: 50,
					y: 50
				}
			);
		} else {
			//todo
			return {
				x: 50,
				y: 50
			};
		}
	}

	_createPlayerInventory(player) {
		return new Promise((resolve, reject) => {
			this._server.db.getModel('Inventory').create({
				size: this._server.config.get('player.defaultPlayerInventorySize', 5),
				content: []
			})
				.then(inventory => {
					return player.setInventory(inventory);
				})
				.then(inventory => {
					player.inventory = inventory;
					resolve(inventory);
				})
				.catch(error => reject(error));
		});
	}

	_createPlayerBase(player, position) {
		return new Promise((resolve, reject) => {
			Promise.all([
				this._server.gameManager.locationManager.addLocation(
					this._server.db.getModel('MapElement').ElementTypes.PLAYER_BASE,
					this._findStartPosition(position),
					{
						width: 20,
						height: 20
					},
					{ owner: player.id },
					{},
					'home'
				),
				this._server.db.getModel('Inventory').create({
					size: 10,
					content: []
				}),
				this._server.db.getModel('Inventory').create({
					size: 10,
					content: []
				}),
				this._server.db.getModel('Inventory').create({
					size: 10,
					content: []
				})
			])
				.then(result => {
					let base = result[0];
					let box1 = result[1];
					let box2 = result[2];
					let box3 = result[3];

					return Promise.all([
						player.setBase(base),
						this._server.gameManager.locationManager.getLocation(base.id, base.getType()),
						base.setBox1(box1),
						base.setBox2(box2),
						base.setBox3(box3),
					]);
				})
				.then(base => {
					base = base[1];

					player.base = base;
					resolve(base);
				})
				.catch(error => reject(error));
		});
	}

	_createFirstDungeon(player) {
		return new Promise((resolve, reject) => {
			this._server.gameManager.locationManager.addLocation(
				this._server.db.getModel('MapElement').ElementTypes.DUNGEON,
				{
					x: player.mapPosition.x+20,
					y: player.mapPosition.y+20
				},
				{
					width: 20,
					height: 20
				},
				{ for: player.id },
				{
					min: 2,
					max: 3,
					maxEnemies: 2,
					difficulty: 1
				},
				'building',
				true
			)
				.then(location => resolve(location))
				.catch(error => reject(error));
		});
	}
}

export default PlayerManager;
