import { MapPosition } from '../../map/interfaces/map-position.interface';
import { MapIcon } from '../../map/interfaces/map-icon.enum';

export interface ILocationService {
	getLocationName(): string;
	create(
		visibilityRules: any,
		data: any,
		icon: MapIcon,
		isPerm: boolean
	): Promise<any>;
	getLocation(id: string): Promise<any>;
}
