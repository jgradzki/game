import { Component } from '@nestjs/common';
import { InjectRepository } from '../../../../db';
import { EntityManager, Repository } from 'typeorm';
import { find, reduce, filter, findIndex } from 'lodash';
import { log } from '../../../../logger';

import { ILocationService } from '../../interfaces/location-service.interface';

import { PlayerBase } from './player-base.entity';
import { Player } from '../../../player/player.entity';

import { MapPosition } from '../../../map/interfaces/map-position.interface';
import { MapIcon } from '../../../map/interfaces/map-icon.enum';

@Component()
export class PlayerBaseService extends ILocationService {
	static dependecies = [];

	bases: PlayerBase[] = [];

	constructor(
		@InjectRepository(PlayerBase)
		private readonly playerBaseRepository: Repository<PlayerBase>,
		private readonly entityManager: EntityManager
	) {
		super();
	}

	getLocationName() {
		return PlayerBase.name;
	}

	async create(
		visibilityRules: any,
		data?: {player: Player},
		icon: MapIcon = MapIcon.HOME,
		isPerm: boolean = false
	) {
		const playerBase = this.playerBaseRepository.create({ isPerm });
		playerBase.player = data.player;

		await this.entityManager.save(playerBase);

		return playerBase;
	}

	loadLocation(location: PlayerBase): boolean {
		if (location.constructor.name !== PlayerBase.name) {
			log('error', `${location} is not PlayerBase instance:`);
			log('error', location);
			return false;
		}

		if (find(this.bases, pa => pa.id === location.id)) {
			log('debug', `PlayerBase ${location.id} already loaded.`);
			return true;
		}

		this.bases.push(location);
		log('debug', `PlayerBase ${location.id} loaded.`);

		return true;
	}

	async unloadLocation(location: PlayerBase, save = true): Promise<boolean> {
		if (location.constructor.name !== PlayerBase.name) {
			log('error', `${location} is not PlayerBase instance:`);
			log('error', location);
			return false;
		}

		const toUnload = find(this.bases, ptu => ptu.id === location.id);

		if (!toUnload) {
			log('debug', `@unloadLocation: PlayerBase ${location.id} not loaded.`);
			return false;
		}

		if (save) {
			await this.saveLocation(toUnload);
		}

		const index = findIndex(this.bases, pa => pa.id === location.id);

		if (index > -1) {
			this.bases.splice(index, 1);
		} else {
			log('error', `@unloadLocation: Error finding index in PlayerBases of ${location.id}`);
		}
		log('debug', `PlayerBase ${toUnload.id} unloaded.`);

		return true;
	}

	async unloadAllLocations() {
		for (const location of this.bases) {
			await this.unloadLocation(location);
		}
	}

	async saveLocation(location: PlayerBase): Promise<boolean> {
		if (location.constructor.name !== PlayerBase.name) {
			log('error', `${location} is not PlayerBase instance:`);
			log('error', location);
			return false;
		}

		if (!location.isPerm) {
			return;
		}

		await this.entityManager.save(location);
		log('debug', `PlayerBase ${location.id} saved.`);

		return true;
	}

	async getLocation(mapElementId: string): Promise<PlayerBase> {
		const location = find(this.bases, loadedBases => loadedBases.mapElement.id === mapElementId);
		if (location) {
			return location;
		}

		const baseToLoad = await this.findByMapElementId(mapElementId);

		if (baseToLoad) {
			this.loadLocation(baseToLoad);
			return baseToLoad;
		}

		return null;
	}

	async getLocationById(id: string): Promise<PlayerBase> {
		const location = find(this.bases, loadedBases => loadedBases.id === id);
		if (location) {
			return location;
		}

		const baseToLoad = await this.findById(id);

		if (baseToLoad) {
			this.loadLocation(baseToLoad);
			return baseToLoad;
		}

		return null;
	}

	private async findById(id: string): Promise<PlayerBase> {
		return await this.playerBaseRepository.findOne({
			where: {
				id
			}
		});
	}

	private async findByMapElementId(mapElementId: string): Promise<PlayerBase> {
		return await this.playerBaseRepository.findOne({
			where: {
				mapElement: mapElementId
			},
			relations: ['mapElement']
		});
	}
}
