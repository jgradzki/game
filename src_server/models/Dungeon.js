import Sequelize, { Model } from 'sequelize';
import _ from 'lodash';
import { rollRooms } from '../libs/dungeonGenerator';

export default class Dungeon extends Model {

	static fields = {
		id: {
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4,
			unique: true,
			primaryKey: true
		},
		rooms: {
			type: Sequelize.JSON,
			defaultValue: {}
		},
		entryRoom: {
			type: Sequelize.JSON,
			field: 'entry_room',
			defaultValue: {}
		},
		players: {
			type: Sequelize.JSON,
			defaultValue: {}
		}
	};

	static options = {
		underscored: true
	};

	static associate(models) {
		models['Dungeon'].belongsTo(
			models['MapElement'],
			{
				as: 'mapPosition',
				foreignKey: 'map_position'
			}
		);
	}

	getType() {
		return 'DUNGEON';
	}

	locationCreated(data) {
		this.generate(data);
	}

	generate(data) {
		let roll = rollRooms(data);

		this.setDataValue('rooms', roll.rooms);
		this.setDataValue('entryRoom', roll.mainRoom);
	}

	getDataForPlayer(id, position) {
		const playerPosition = position || this.getPlayerLocation(id) || this.entryRoom;

		const rooms = this.rooms.map((yrooms, y) => {
			return yrooms.map((room, x) => {
				if (playerPosition.x === x && playerPosition.y === y) {

					return {
						...room,
						enemies: room.enemies && room.enemies.map(enemy => ({
							name: enemy.name,
							hp: enemy.hp,
							attackPower: enemy.attackPower,
							attackSpeed: enemy.attackSpeed
						}))
					};
				} else {
					return {
						is: true,
						doors: room.doors,
						lock: room.lock
					};
				}
			});
		});

		return {
			rooms: rooms,
			position: this.getPlayerLocation(id) || this.entryRoom
		};
	}

	onPlayerEnter(player) {
		this.setDataValue('players', {
			...this.players,
			[player.id]: {
				position: this.entryRoom
			}
		});

		return {
			location: this,
			data: {
				fight: this._checkFight(player),
				...this.getDataForPlayer(player.id, this.entryRoom)
			}
		};

	}

	onPlayerExit(player) {
		if (!this.players.hasOwnProperty(player.id) ) {
			throw new Error(`Player ${player.id} is not in location ${this.id}`);
		}

		this.players[player.id] = undefined;
	}

	changePlayerPosition(player, x, y) {
		if (!this._canMove(player, x, y)) {
			return {
				location: this,
				cant: true
			};
		}

		this.players[player.id].position = {
			x,
			y
		};

		return {
			location: this,
			data: {
				fight: this._checkFight(player),
				...this.getDataForPlayer(player.id, {x, y})
			}
		};
	}

	getRoomItems(room) {
		if (!this.rooms[room.y] || !this.rooms[room.y][room.x]) {
			throw new Error(`Romm ${room.y}:${room.x} not found in ${this.id}`);
		}

		return this.rooms[room.y][room.x].items;
	}

	setRoomItems(room, items) {
		if (!this.rooms[room.y] || !this.rooms[room.y][room.x]) {
			throw new Error(`Romm ${room.y}:${room.x} not found in ${this.id}`);
		}

		this.rooms[room.y][room.x].items = items;
	}

	getPlayerLocation(id) {
		if (!this.players[id]) {
			return;
		}

		return this.players[id].position;
	}

	_getRoom(x, y) {
		return (x || x === 0) && (y || y === 0) && this.rooms && this.rooms[y] && this.rooms[y][x];
	}

	_checkFight(player) {
		const { x, y } = this.getPlayerLocation(player.id);
		let room = this._getRoom(x, y);

		if (!room || !_.isArray(room.enemies) || room.enemies.length === 0) {
			return;
		}

		const fightLog = this._runFight(player, room);

		return {
			fightLog,
			playerHP: player.hp
		};
	}

	_runFight(player, room) {
		let log = '';
		let tick = 0;
		let playerLastTurn = 0;
		const playersWeapon = player.inventory.getMeleeWeapon();
		const playerAttackSpeed = _.round(50 / ((playersWeapon && playersWeapon.speed) || 4));
		const playerAttackPower = (playersWeapon && playersWeapon.attck) || 5;

		log += `Liczba napotkanych przeciwników: ${room.enemies.length}.\n`;
		room.enemies.forEach(enemy =>  log += `${enemy.name} `);
		log += '\n';

		while (player.hp > 0 && room.enemies.length > 0) {
			room.enemies.forEach((enemy, number) => {
				const enemySpeed = _.round(50 / (enemy.attackSpeed || 3));
				const attackPower = enemy.attackPower || 5;
				let lastTurn = enemy.lastTurn || 0;

				if ((lastTurn+enemySpeed) >= tick) {
					player.hp -= attackPower;
					enemy.lastTurn = tick;
					log += `Przeciwnik ${number+1}(${enemy.name}) atakuje i zadaje ${attackPower}.\n`;
				}
			});

			if (player.hp > 0) {
				if ((playerLastTurn+playerAttackSpeed) >= tick) {
					let enemy = room.enemies[0];

					enemy.hp -= playerAttackPower;
					if (enemy.hp > 0) {
						log += `Zadajesz ${playerAttackPower} obrażeń dla ${enemy.name}.\n`;
					} else {
						log += `Zadajesz ${playerAttackPower} obrażeń i zabijasz ${enemy.name} .\n`;
					}
					playerLastTurn = tick;
				}

				room.enemies = room.enemies.filter(enemy => enemy.hp > 0);
			}

			tick++;
		}

		if (player.hp <= 0) {
			log += 'Zginąłeś.\n';
		}
		if (room.enemies.length === 0) {
			log += 'Pokonałeś wszystkich wrogów.\n';
		}

		return log;
	}

	_canMove(player, x, y) {
		let can = false;
		let rooms = this.rooms;

		if (!rooms) {
			return false;
		}

		let playerPosition = this.getPlayerLocation(player.id);

		if (!playerPosition) {
			return false;
		}

		if (playerPosition.x-1 === x && playerPosition.y === y) {
			//na lewo od current
			if (rooms[y][x].doors.right) {
				can = true;
			}
		} else if (playerPosition.x+1 === x && playerPosition.y === y) {
			//na prawo od current
			if (rooms[y][x].doors.left) {
				can = true;
			}
		} else if (playerPosition.x === x && playerPosition.y-1 === y) {
			//nad current
			if (rooms[y][x].doors.down) {
				can = true;
			}
		} else if (playerPosition.x === x && playerPosition.y+1 === y) {
			//pod current
			if (rooms[y][x].doors.up) {
				can = true;
			}
		}

		return can;
	}
}
