import { MapPosition } from '../../map/interfaces/map-position.interface';
import { MapIcon } from '../../map/interfaces/map-icon.enum';

export abstract class ILocationService {
	abstract getLocationName(): string;
	abstract create(
		visibilityRules: any,
		data: any,
		icon: MapIcon,
		isPerm: boolean
	): Promise<any>;
	abstract getLocation(id: string): Promise<any>;
}
