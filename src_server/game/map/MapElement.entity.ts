import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

import { MapPosition } from './interfaces/map-position.interface';
import { MapElementType } from './interfaces/mapElementType.enum';
import { MapIcon } from './interfaces/map-icon.enum';

@Entity({ name: 'MapElements' })
export class MapElement {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ name: 'map_position', type: 'json' })
	mapPosition: MapPosition;

	@Column({ name: 'map_icon', default: 'default' })
	mapIcon: MapIcon;

	@Column({ type: 'json' })
	size = { width: 20, height: 20 };

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
