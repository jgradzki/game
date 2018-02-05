import { Component, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { find, reduce, filter, findIndex, isArray } from 'lodash';
import { log } from '../../../../logger';

import { LocationController } from '../../interfaces/location-controller.interface' ;
import { PlayerBase } from './player-base.entity';
import { Player } from '../../../player/player.entity';
import { InventoryService } from '../../../inventory';
import { PlayerBaseService } from './player-base.service';

@Component()
export class PlayerBaseController implements LocationController {
	protected readonly actions: {[s: string]: (data) => Promise<any> } = {};

	constructor(
		@InjectRepository(PlayerBase)
		private readonly playerBaseRepository: Repository<PlayerBase>,
		private readonly entityManager: EntityManager,
		private readonly inventoryService: InventoryService,
		@Inject(forwardRef(() => PlayerBaseService))
		private readonly playerBaseService: PlayerBaseService,
	) {
		this.actions.upgradeEquipment = data => this.upgradeEquipment(data);
	}

	async action(data: { location: PlayerBase, player: Player, requestData: any }) {
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

	async upgradeEquipment(data: { location: PlayerBase, player: Player, requestData: any }) {
		const { location, player, requestData } = data;
		const level = location.getEquipmentLevel(requestData.equipment);
		const costs = location.getUpgradeCosts(requestData.equipment, level) || [];

		if (!location.isUpgradeable(requestData.equipment, level)) {
			return{
				error: true,
				message: 'You cant upgrade it.'
			};
		} else {
			if (!this.inventoryService.utils.checkTypeArray(player.inventory.items, costs)) {
				return {
					error: true,
					message: 'Not enough items.'
				};
			} else {
				for (const cost of costs) {
					if (!cost.preserve) {
						await this.inventoryService.utils.takeCount(player.inventory, cost.type, cost.count);
					}
				}

				location.upgrade(requestData.equipment);
				const locationData = await this.playerBaseService.getDataForPlayer(location.id, player);

				return {
					success: true,
					equipment: locationData.equipment,
					inventory: player.inventory.filtreItems()
				};
			}
		}
	}
}
