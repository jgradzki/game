import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

import { MapPosition } from './interfaces/map-position.interface';
import { MapElementType } from './interfaces/mapElementType.enum';

@Entity({ name: 'MapElements' })
export class MapElement {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ name: 'map_position', type: 'json' })
	mapPosition: MapPosition;

	@Column({ name: 'map_icon', default: 'default' })
	mapIcon: string;

	@Column({ type: 'json' })
	size: { x: number, y: number };

	@Column({ type: 'json' })
	visibilityRules = {};

	@Column({ name: 'is_perm', type: 'boolean', nullable: false })
	isPerm = false;

	dataForPlayer(): any {
		return {
			mapPosition: this.mapPosition,
			size: this.size
		};
	}

}
