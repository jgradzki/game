import { Component } from '@nestjs/common';
import { TypeOrmModule, InjectRepository } from '../../db';
import {  EntityManager, Repository } from 'typeorm';
import { map } from 'lodash';
import { log } from '../../logger';

import { MapPosition } from '../map/interfaces/map-position.interface';
import { MapIcon } from '../map/interfaces/map-icon.enum';
import { ILocationService } from './interfaces/location-service.interface';
import { ILocation } from './interfaces/location.interface';

import { LocationType } from './entities';

import { MapService } from '../map/map.service';
import { PlayerBaseService } from './entities/player-base';
import { DungeonService } from './entities/dungeon';

@Component()
export class LocationsService {
	public readonly locationsServices: { [s: string]: ILocationService } = {};

	constructor(
		private readonly entityManager: EntityManager,
		private readonly mapService: MapService,
		private readonly playerBaseService: PlayerBaseService,
		private readonly dungeonService: DungeonService,
	) {
		this.locationsServices = {
			[this.playerBaseService.getLocationName()]: this.playerBaseService,
			[this.dungeonService.getLocationName()]: this.dungeonService,
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

		const location = await this.locationsServices[type].create(visibilityRules, data, icon, isPerm);
		const mapElement = await this.mapService.create(mapPosition, icon, visibilityRules, [this.locationsServices[type].getLocationName()], size, isPerm);

		location.mapElement = mapElement;
		location.afterLocationCreate(data);
		await this.entityManager.save(location);

		return location;
	}

	async getLocation(type: LocationType, id: string): Promise<ILocation> {
		if (!this.locationsServices[type] || !this.locationsServices[type].create) {
			throw new TypeError(`${type} is not valid location type.`);
		}

		return await this.locationsServices[type].getLocation(id);
	}

	async getLocationById(type: LocationType, id: string): Promise<ILocation> {
		if (!this.locationsServices[type] || !this.locationsServices[type].create) {
			throw new TypeError(`${type} is not valid location type.`);
		}

		return await this.locationsServices[type].getLocationById(id);
	}

	getLocationService(type: LocationType): ILocationService {
		if (!this.locationsServices[type]) {
			throw new TypeError(`${type} is not valid location type.`);
		}

		return this.locationsServices[type];
	}

	async unloadAll() {
		await Promise.all(map(this.locationsServices, service => service.unloadAllLocations()));

		log('debug', 'Locations unloaded.');
	}
}
