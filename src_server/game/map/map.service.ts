import { Component } from '@nestjs/common';
import { TypeOrmModule, InjectRepository } from '../../db';
import { EntityManager, Repository } from 'typeorm';
import { find } from 'lodash';

import { log } from '../../logger';

import { MapElement } from './MapElement.entity';

@Component()
export class MapService {
	private readonly elements: MapElement[] = [];

	constructor(
		private readonly entityManager: EntityManager,
		@InjectRepository(MapElement)
		private readonly mapElementRepository: Repository<MapElement>,
	) {}
}
