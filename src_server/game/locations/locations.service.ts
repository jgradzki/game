import { Component } from '@nestjs/common';
import { TypeOrmModule, InjectRepository } from '../../db';
import {  EntityManager, Repository } from 'typeorm';
import { log } from '../../logger';

import { MapPosition } from '../map/interfaces/map-position.interface';
import { MapIcon } from '../map/interfaces/map-icon.enum';

import { LocationType } from './entities';

import { PlayerBaseService } from './entities/player-base/player-base.service';

@Component()
export class LocationsService {
	private locationsServices = {};

	constructor(
		private readonly entityManager: EntityManager,
		private readonly playerBaseService: PlayerBaseService,
	) {
		this.locationsServices = {
			[this.playerBaseService.getLocationName()]: this.playerBaseService
		};
	}

	async createLocation(
		type: LocationType,
		mapPosition: MapPosition,
		size: {width: number, height: number},
		visibilityRules: any,
		data?: any,
		icon: MapIcon = MapIcon.BUILDING,
		isPerm: boolean = false
	) {
		if (!this.locationsServices[type] || !this.locationsServices[type].create) {
			throw new TypeError(`${type} is not valid location type.`);
		}
		if (!mapPosition || !mapPosition.x || !mapPosition.y) {
			throw new Error(`Wrong position(${mapPosition}.`);
		}
		if (!size || !size.width || !size.height || (size.width <= 0) || (size.height <= 0)) {
			throw new Error(`Wrong size(${size}.`);
		}

		this.locationsServices[type].create(mapPosition, size, visibilityRules, data, icon, isPerm);
	}
}
