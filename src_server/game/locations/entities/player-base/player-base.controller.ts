import { Component } from '@nestjs/common';
import { InjectRepository } from '../../../../db';
import { EntityManager, Repository } from 'typeorm';
import { find, reduce, filter, findIndex, isArray } from 'lodash';
import { log } from '../../../../logger';

import { LocationController } from '../../interfaces/location-controller.interface' ;
import { PlayerBase } from './player-base.entity';
import { Player } from '../../../player/player.entity';

@Component()
export class PlayerBaseController implements LocationController {

	constructor(
		@InjectRepository(PlayerBase)
		private readonly playerBaseRepository: Repository<PlayerBase>,
		private readonly entityManager: EntityManager
	) {}

	async action(data: { location: PlayerBase, player: Player, requestData: any }) {
		if (!data.requestData || !data.requestData.type) {
			return {
				error: 'no-action-type'
			};
		}

		return {
			error: 'unknown-action'
		};
	}
}
