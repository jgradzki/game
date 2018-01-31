import { Component } from '@nestjs/common';
import { forEach } from 'lodash';

import { Player } from '../player.entity';
import { InventoryService } from '../../inventory';

import { IMeleeWeapon } from '../../items/interfaces/attributes/melee-wepon';

@Component()
export class RemoveMeleeWeponAction {

	constructor(private readonly inventoryService: InventoryService) {}

	async action(player: Player, data: any): Promise<any> {
		const item = player.meleeWeapon;

		if (!item) {
			return {
				error: 'no-melee-weapon-equiped'
			};
		}

		if (player.inventory.itemsCount >= player.inventory.size) {
			return {
				error: 'inventory-is-full'
			};
		}

		player.inventory.addItem(item);
		player.setMeleeWeapon(null);

		return {
			success: true,
			inventory: player.inventory.filtreItems(),
			meleeWeapon: player.meleeWeapon && player.meleeWeapon.getItemData(),
			hp: player.hp,
			hunger: player.hunger,
			energy: player.energy
		};
	}
}
