import Sequelize, { Model } from 'sequelize';
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

	locationCreated() {
		this.generate();
	}

	generate() {
		let roll = rollRooms();

		this.setDataValue('rooms', roll.rooms);
		this.setDataValue('entryRoom', roll.mainRoom);
	}

	async getDataForPlayer(id) {
		return {
			rooms: this.rooms,
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
	}

	onPlayerExit(player) {
		if (!this.players.hasOwnProperty(player.id) ) {
			throw new Error(`Player ${player.id} is not in location ${this.id}`);
		}

		this.players[player.id] = undefined;
	}

	changePlayerPosition(player, x, y) {
		if (!this._canMove(player, x, y)) {
			return false;
		}

		this.players[player.id].position = {
			x,
			y
		};

		return true;
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
