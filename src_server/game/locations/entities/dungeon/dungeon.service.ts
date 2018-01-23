import { Component } from '@nestjs/common';
import { InjectRepository } from '../../../../db';
import { EntityManager, Repository } from 'typeorm';
import { find, reduce, filter, findIndex } from 'lodash';
import { log } from '../../../../logger';

import { ILocationService } from '../../interfaces/location-service.interface';

import { Dungeon } from './dungeon.entity';
import { Player } from '../../../player/player.entity';

import { MapPosition } from '../../../map/interfaces/map-position.interface';
import { MapIcon } from '../../../map/interfaces/map-icon.enum';

@Component()
export class DungeonService extends ILocationService {
	static dependecies = [];

	dungeons: Dungeon[] = [];

	constructor(
		@InjectRepository(Dungeon)
		private readonly dungeonRepository: Repository<Dungeon>,
		private readonly entityManager: EntityManager
	) {
		super();
	}

	getLocationName() {
		return Dungeon.name;
	}

	async create(
		visibilityRules: any,
		data?: {player: Player},
		icon: MapIcon = MapIcon.HOME,
		isPerm: boolean = false
	) {
		const dungeon = this.dungeonRepository.create({ isPerm });

		await this.entityManager.save(dungeon);

		return dungeon;
	}

	loadLocation(location: Dungeon): boolean {
		if (location.constructor.name !== Dungeon.name) {
			log('error', `${location} is not Dungeon instance:`);
			log('error', location);
			return false;
		}

		if (find(this.dungeons, pa => pa.id === location.id)) {
			log('debug', `Dungeon ${location.id} already loaded.`);
			return true;
		}

		this.dungeons.push(location);
		log('debug', `Dungeon ${location.id} loaded.`);

		return true;
	}

	async unloadLocation(location: Dungeon, save = true): Promise<boolean> {
		if (location.constructor.name !== Dungeon.name) {
			log('error', `${location} is not PlayerBase instance:`);
			log('error', location);
			return false;
		}

		const toUnload = find(this.dungeons, ptu => ptu.id === location.id);

		if (!toUnload) {
			log('debug', `@unloadLocation: Dungeon ${location.id} not loaded.`);
			return false;
		}

		if (save) {
			await this.saveLocation(toUnload);
		}

		const index = findIndex(this.dungeons, pa => pa.id === location.id);

		if (index > -1) {
			this.dungeons.splice(index, 1);
		} else {
			log('error', `@unloadLocation: Error finding index in Dungeon of ${location.id}`);
		}
		log('debug', `Dungeon ${toUnload.id} unloaded.`);

		return true;
	}

	async unloadAllLocations() {
		for (const location of this.dungeons) {
			await this.unloadLocation(location);
		}
	}

	async saveLocation(location: Dungeon): Promise<boolean> {
		if (location.constructor.name !== Dungeon.name) {
			log('error', `${location} is not Dungeon instance:`);
			log('error', location);
			return false;
		}

		if (!location.isPerm) {
			return;
		}

		await this.entityManager.save(location);
		log('debug', `Dungeon ${location.id} saved.`);

		return true;
	}

	async getLocation(mapElementId: string): Promise<Dungeon> {
		const location = find(this.dungeons, loadedDungeons => loadedDungeons.mapElement.id === mapElementId);
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

	async getLocationById(id: string): Promise<Dungeon> {
		const location = find(this.dungeons, loadedDungeons => loadedDungeons.id === id);
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

	private async findById(id: string): Promise<Dungeon> {
		return await this.dungeonRepository.findOne({
			where: {
				id
			}
		});
	}

	private async findByMapElementId(mapElementId: string): Promise<Dungeon> {
		return await this.dungeonRepository.findOne({
			where: {
				mapElement: mapElementId
			},
			relations: ['mapElement']
		});
	}
}
