import { Entity, Column } from 'typeorm';
import { forEach, find, filter, map } from 'lodash';

import { ILocation } from '../../interfaces/location.interface';
import { IRoom } from './interfaces/room.interface';
import { DungeonPlayerData } from './interfaces/dungeon-player-data';
import { Player } from '../../../player/player.entity';
import { Inventory } from '../../../inventory';

import * as roomsGenerator from './utils/rooms-generator.utility';

@Entity({ name: 'Dungeon' })
export class Dungeon extends ILocation {

	@Column('json', { nullable: false })
	rooms: {[s: number]: {[s: number]: IRoom }} = {};

	@Column('json', { name: 'entry_room', nullable: false })
	entryRoom: {x: number, y: number} = { x: 0, y: 0 };

	@Column('json', { nullable: false })
	players: Array<DungeonPlayerData> = [];

	getType(): string {
		return 'Dungeon';
	}

	async afterLocationCreate(data: any): Promise<void> {}

	async onPlayerEnter(player: Player, data?: any): Promise<void> {
		const playerData = find(this.players, playersArray => playersArray.id === player.id);

		if (playerData) {
			playerData.position = this.entryRoom;
		} else {
			this.players.push({
				id: player.id,
				position: this.entryRoom
			});
		}
	}

	async onPlayerExit(player: Player): Promise<void> {
		this.players = filter(this.players, playersArray => playersArray.id !== player.id);
	}

	getPlayerPosition(id: string) {
		const playerData = find(this.players, playersArray => playersArray.id === id);

		if (playerData) {
			return playerData.position;
		}

		return this.entryRoom;
	}

	changePlayerPosition(player: Player, x: number, y: number) {
		const playerData = find(this.players, playersArray => playersArray.id === player.id);

		if (playerData && this.canMove(player, x, y)) {
			playerData.position = {x, y};
		}
	}

	canMove(player: Player, x: number, y: number) {
		const rooms = this.rooms;

		if (!rooms) {
			return false;
		}

		const playerPosition = this.getPlayerPosition(player.id);
		let doors: string;

		if (!playerPosition) {
			return false;
		}

		if (playerPosition.x - 1 === x && playerPosition.y === y) {
			// na lewo od current
			doors = 'right';
		} else if (playerPosition.x + 1 === x && playerPosition.y === y) {
			// na prawo od current
			doors = 'left';
		} else if (playerPosition.x === x && playerPosition.y - 1 === y) {
			// nad current
			doors = 'down';
		} else if (playerPosition.x === x && playerPosition.y + 1 === y) {
			// pod current
			doors = 'up';
		}

		if (rooms[x] &&  rooms[x][y] && rooms[x][y].doors && rooms[x][y].doors[doors]) {
			return true;
		}

		return false;
	}

	getRoom(x: number, y: number) {
		return this.rooms[x] && this.rooms[x][y];
	}

	generateRooms(min: number = 4, max: number = 6) {
		const generatedRooms = roomsGenerator.generateRooms(min, max);

		this.rooms = generatedRooms.rooms;
		this.entryRoom = generatedRooms.entry;
	}

	getRoomItems(room: IRoom) {
		return map(room.items, item => ({
			type: item.type,
			count: item.count
		}));
	}
}
