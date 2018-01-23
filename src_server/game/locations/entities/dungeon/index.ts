import { Dungeon } from './dungeon.entity';
import { DungeonService} from './dungeon.service';

export const DungeonLocation = {
	name: Dungeon.name,
	model: Dungeon,
	service: DungeonService,
	dependecies: DungeonService.dependecies
};
