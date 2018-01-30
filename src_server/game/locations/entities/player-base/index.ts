import { LocationModule } from '../../interfaces/location-module.interface';
import { PlayerBase } from './player-base.entity';
import { PlayerBaseService } from './player-base.service';
import { PlayerBaseController } from './player-base-controller';

export const PlayerBaseLocation: LocationModule = {
	name: PlayerBase.name,
	model: PlayerBase,
	service: PlayerBaseService,
	dependecies: PlayerBaseService.dependecies,
	actionController: PlayerBaseController
};
