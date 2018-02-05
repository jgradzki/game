import { Player } from '../../player/player.entity';
import { ILocation } from './location.interface';

export interface LocationController {
	action(data: { location: ILocation, player: Player, requestData: any }): Promise<any>;
}
