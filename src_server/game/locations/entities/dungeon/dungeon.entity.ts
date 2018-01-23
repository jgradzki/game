import { Entity, Column } from 'typeorm';
import { forEach } from 'lodash';

import { ILocation } from '../../interfaces/location.interface';
import { IRoom } from './interfaces/room.interface';
import { Player } from '../../../player/player.entity';

import * as roomsGenerator from './utils/rooms-generator.utility';

@Entity({ name: 'Dungeon' })
export class Dungeon extends ILocation {

	@Column('json')
	rooms: {[s: number]: {[s: number]: IRoom }} = {};

	@Column('json', { name: 'entry_room' })
	entryRoom: {x: number, y: number} = { x: 0, y: 0 };

	getType(): string {
		return 'Dungeon';
	}

	async afterLocationCreate(data: any): Promise<void> {
		this.generateRooms();
	}

	async onPlayerEnter(player: Player, data?: any): Promise<void> {

	}

	async onPlayerExit(player: Player): Promise<void> {

	}

	async getDataForPlayer(player: Player, data?: any): Promise<any> {
		const playerPosition = (data && data.position) || this.getPlayerLocation(player.id) || this.entryRoom;
		const filteredRooms = {};

		forEach( this.rooms, (v: {[s: number]: IRoom }, x) => {
			filteredRooms[x] = {};
			return forEach(v, (room: IRoom, y) => {
				if (playerPosition.x === x && playerPosition.y === y) {
					filteredRooms[x][y] = {
						...room,
						/*enemies: room.enemies && room.enemies.map(enemy => ({
							name: enemy.name,
							hp: enemy.hp,
							attackPower: enemy.attackPower,
							attackSpeed: enemy.attackSpeed
						}))*/
					};
				} else {
					filteredRooms[x][y] = {
						is: true,
						doors: room.doors
					};
				}
			});
		});

		return {
			rooms: filteredRooms,
			position: playerPosition
		};
	}

	getPlayerLocation(id) {
		return this.entryRoom;
	}

	private generateRooms() {
		const generatedRooms = roomsGenerator.generateRooms(2, 3);

		this.rooms = generatedRooms.rooms;
		this.entryRoom = generatedRooms.entry;
	}
}
