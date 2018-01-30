import { Component } from '@nestjs/common';
import { InjectRepository } from '../../../../db';
import { EntityManager, Repository } from 'typeorm';
import { find, reduce, filter, findIndex, isArray } from 'lodash';
import { log } from '../../../../logger';

import { LocationController } from '../../interfaces/location-controller.interface' ;
import { Dungeon } from './dungeon.entity';
import { Player } from '../../../player/player.entity';

@Component()
export class DungeonController implements LocationController {
	protected readonly actions: {[s: string]: (data) => Promise<any> } = {};

	constructor(
		@InjectRepository(Dungeon)
		private readonly dungeonRepository: Repository<Dungeon>,
		private readonly entityManager: EntityManager
	) {
		this.actions.dungeonChangePosition = this.dungeonChangePositionAction;
		this.actions.takeLoot = this.takeLoot;
	}

	async action(data: { location: Dungeon, player: Player, requestData: any }) {
		if (!data.requestData || !data.requestData.type) {
			return {
				error: 'no-action-type'
			};
		}

		const action = this.actions[data.requestData.type];

		if (!action) {
			return {
				error: 'unknown-action'
			};
		}

		return await action(data);
	}

	private async dungeonChangePositionAction(data: { location: Dungeon, player: Player, requestData: any }) {
		const { location, player, requestData } = data;
		const { position } = requestData;

		if (!position || (!position.x && position.x !== 0) || (!position.y && position.y !== 0)) {
			return {
				error: 'no-position-given'
			};
		}

		if (!location.canMove(player, position.x, position.y)) {
			return {
				error: 'cant-move'
			};
		}

		location.changePlayerPosition(player, position.x, position.y);

		return {
			success: true,
			data: {
				// fight: this._checkFight(player),
				...(await location.getDataForPlayer(player))
			}
		};
	}

	private async takeLoot(data: { location: Dungeon, player: Player, requestData: any }) {
		const { location, player, requestData } = data;
		const { position } = requestData;
		const playerPosition = location.getPlayerPosition(player.id);
		const room = location.getRoom(playerPosition.x, playerPosition.y);
		const { slot } = requestData;

		if (!room.items || !room.items[slot]) {
			return {
				error: 'incorrect-slot'
			};
		}

		try {
			player.inventory.addItem(room.items[slot]);
			room.items.splice(slot, 1);
		} catch (e) {
			return {
				error: 'internal-server-error'
			};
		}

		return {
			success: true,
			newInventory: player.inventory.filtreItems(),
			lootInventory: location.getRoomItems(room)
		};
	}
}