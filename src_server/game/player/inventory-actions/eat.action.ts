import { Component } from '@nestjs/common';
//import {  EntityManager, Repository } from 'typeorm';
//import { find, reduce, filter, findIndex } from 'lodash';

//import { log } from '../../../logger';

import { Player } from '../player.entity';

import { InventoryService } from '../../inventory';

import { IEatable } from '../../items/interfaces/attributes/eatable';

@Component()
export class EatAction {

	constructor(private readonly inventoryService: InventoryService) {}

	async action(player: Player, data: any): Promise<any> {
		if (!data.slot) {
			return {
				error: 'incorrect-data'
			};
		}

		const slot = parseInt(data.slot, 10);
		const item = player.inventory.getSlot(slot) as any;

		if (!item.eatable) {
			return {
				error: 'incorrect-data'
			};
		}

		if (((item as any) as IEatable).eat(player)) {
			await this.inventoryService.utils.removeItem(player.inventory, item);
		}

		return {
			success: true,
			inventory: player.inventory.filtreItems(),
			hp: player.hp,
			hunger: player.hunger,
			energy: player.energy
		};
	}
}
