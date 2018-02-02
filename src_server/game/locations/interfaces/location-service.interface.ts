import { MapPosition } from '../../map/interfaces/map-position.interface';
import { MapIcon } from '../../map/interfaces/map-icon.enum';
import { ILocation } from './location.interface';
import { LocationController } from './location-controller.interface';
import { Player } from '../../player';

export abstract class ILocationService {
	abstract getLocationName(): string;
	abstract create(
		visibilityRules: any,
		data: any,
		icon: MapIcon,
		isPerm: boolean
	): Promise<any>;
	abstract getLocation(id: string): Promise<ILocation>;
	abstract getLocationById(id: string): Promise<ILocation>;
	abstract unloadLocation(location: ILocation, save?: boolean);
	abstract unloadAllLocations(): Promise<any>;
	abstract getDataForPlayer(locationId: string, player: Player, data?: any): Promise<any>;
	abstract controller(): LocationController;
}
