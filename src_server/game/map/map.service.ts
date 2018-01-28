import { Component } from '@nestjs/common';
import { InjectRepository } from '../../db';
import { EntityManager, Repository } from 'typeorm';
import { find, map, forEach, findIndex } from 'lodash';

import { log } from '../../logger';

import { MapElement } from './MapElement.entity';
import { MapPosition } from './interfaces/map-position.interface';
import { MapIcon } from './interfaces/map-icon.enum';

@Component()
export class MapService {
	private readonly elements: MapElement[] = [];

	constructor(
		private readonly entityManager: EntityManager,
		@InjectRepository(MapElement)
		private readonly mapElementRepository: Repository<MapElement>
	) {
		this.loadElements();
	}

	private async loadElements() {
		const elements = await this.mapElementRepository.findAndCount();

		forEach(elements[0], element => this.loadMapElement(element));

		log('info', `Loaded ${elements[1]} map elements.`);
	}

	async create(
		mapPosition: MapPosition,
		mapIcon: MapIcon,
		visibilityRules,
		locationTypes: Array<string>,
		size?: { width: number, height: number },
		isPerm = false
	): Promise<MapElement> {
		const mapElement = await this.mapElementRepository.create({
			mapPosition,
			mapIcon,
			size,
			visibilityRules,
			locationTypes,
			isPerm
		});

		await this.entityManager.save(mapElement);
		this.elements.push(mapElement);

		return mapElement;
	}

	mapElements(): Array<MapElement> {
		return this.elements;
	}

	async saveMapElement(mapElement: MapElement): Promise<boolean> {
		if (mapElement.constructor.name !== MapElement.name) {
			log('error', `${mapElement} is not mapElement instance:`);
			log('error', mapElement);
			return false;
		}

		await this.entityManager.save(mapElement);
		log('debug', `mapElement ${mapElement.id} saved.`);

		return true;
	}

	async unloadAllMapElements() {
		for (const element of this.elements) {
			await this.unloadMapElement(element);
		}
	}

	async getMapElementById(id: string): Promise<MapElement> {
		const mapElement = find(this.elements, (loadedME: MapElement) => loadedME.id === id);

		if (mapElement) {
			return mapElement;
		}

		return null;
	}

	getElementsForPlayer(id: string, filter = false) {
		const elements = this.getElementsByVisibilityRules({
					all: true,
					owner: id,
					for: id
		});

		if (filter) {
			return map(elements, element => this.filterElement(element));
		} else {
			return elements;
		}
	}

	getElementsByVisibilityRules(rules: any = { all: true }): MapElement[] {
		const elements = this.elements.filter(element => this._checkRules(element, rules));

		return elements;
	}

	filterElement(element: MapElement) {
		return {
			id: element.id,
			icon: element.mapIcon,
			position: element.mapPosition,
			size: element.size,
			types: element.locationTypes
		};
	}

	private loadMapElement(mapElement: MapElement): boolean {
		if (mapElement.constructor.name !== MapElement.name) {
			log('error', `${mapElement} is not mapElement instance:`);
			log('error', mapElement);
			return false;
		}

		if (find(this.elements, (pa: MapElement) => pa.id === mapElement.id)) {
			log('debug', `mapElement ${mapElement.id} already loaded.)`);
			return true;
		}

		this.elements.push(mapElement);
		log('debug', `mapElement ${mapElement.id} loaded.`);

		return true;
	}

	private async unloadMapElement(mapElement: MapElement): Promise<boolean> {

		if (mapElement.constructor.name !== MapElement.name) {
			log('error', `${mapElement} is not mapElement instance:`);
			log('error', mapElement);
			return false;
		}

		const toUnload = find(this.elements, element => element.id === mapElement.id);

		if (!toUnload) {
			log('debug', `@unloadMapElement: mapElement ${toUnload.id} not loaded.`);
			return false;
		}

		await this.saveMapElement(toUnload);

		const index = findIndex(this.elements, element => element.id === toUnload.id);

		if (index > -1) {
			this.elements.splice(index, 1);
		} else {
			log('error', `@unloadMapElement: Error finding index in elements of ${toUnload.id}`);
		}
		log('debug', `mapElement ${toUnload.id} unloaded.`);

		return true;
	}

	private _checkRules(element, rules): boolean {
		if (!element || !element.visibilityRules || !rules) {
			return false;
		}

		const visibilityRules = element.visibilityRules;

		if (rules.all && visibilityRules.all) {
			return true;
		}

		if (rules.owner && visibilityRules.owner) {
			if (rules.owner === visibilityRules.owner) {
				return true;
			}
		}

		if (rules.for && visibilityRules.for) {
			if (rules.for === visibilityRules.for) {
				return true;
			}
		}

		return false;
	}
}
