import { Component } from '@nestjs/common';
import { InjectRepository } from '../../../../db';
import { Repository } from 'typeorm';

import { ILocationService } from '../../interfaces/location-service.interface';

import { PlayerBase } from './player-base.entity';
import { Player } from '../../../player/player.entity';
import { MapService } from '../../../map/map.service';

import { MapPosition } from '../../../map/interfaces/map-position.interface';
import { MapIcon } from '../../../map/interfaces/map-icon.enum';

@Component()
export class PlayerBaseService implements ILocationService {
	static dependecies = [];

	constructor(
		@InjectRepository(PlayerBase)
		private readonly playerBaseRepository: Repository<PlayerBase>,
		private readonly mapService: MapService
	) {}

	getLocationName() {
		return PlayerBase.name;
	}

	async create(
		visibilityRules: any,
		data?: { player: Player },
		icon: MapIcon = MapIcon.HOME,
		isPerm: boolean = true
	) {
		console.log('PlayerBaseService.create');
	}

}
