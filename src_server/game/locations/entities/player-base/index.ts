import { PlayerBase } from './player-base.entity';
import { PlayerBaseService} from './player-base.service';

export const PlayerBaseLocation = {
	name: PlayerBase.name,
	model: PlayerBase,
	service: PlayerBaseService,
	dependecies: PlayerBaseService.dependecies
};
