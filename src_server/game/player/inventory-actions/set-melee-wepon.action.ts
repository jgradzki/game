import { Component } from '@nestjs/common';
import { forEach } from 'lodash';

import { Player } from '../player.entity';
import { InventoryService } from '../../inventory';

import { IMeleeWeapon } from '../../items/interfaces/attributes/melee-wepon';

@Component()
export class SetMeleeWeponAction {

	constructor(private readonly inventoryService: InventoryService) {}

	async action(player: Player, data: any): Promise<any> {
		if (!data.slot && data.slot !== 0) {
			return {
				error: 'incorrect-data'
			};
		}

		const slot = parseInt(data.slot, 10);
		const item = player.inventory.getSlot(slot);

		if (!item || !item.isMeleeWepon) {
			return {
				error: 'incorrect-data'
			};
		}

		const oldWeapon = player.setMeleeWeapon(item);

		player.inventory.removeItem(item);
		if (oldWeapon) {
			player.inventory.addItem(oldWeapon);
		}

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
