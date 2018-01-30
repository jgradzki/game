import { LocationModule } from '../../interfaces/location-module.interface';
import { Dungeon } from './dungeon.entity';
import { DungeonService} from './dungeon.service';
import { DungeonController } from './dungeon.controller';

export const DungeonLocation: LocationModule = {
	name: Dungeon.name,
	model: Dungeon,
	service: DungeonService,
	dependecies: DungeonService.dependecies,
	actionController: DungeonService.controller
};
