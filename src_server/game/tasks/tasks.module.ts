import { Module  } from '@nestjs/common';

import { ConfigModule } from '../config/config.module';
import { PlayerModule } from '../player/player.module';

import { TasksService } from './tasks.service';

import { PlayerMoveOnMapTask } from './player-move-on-map/player-move-on-map.task';

@Module({
	imports: [ConfigModule, PlayerModule],
	controllers: [],
	components: [TasksService, PlayerMoveOnMapTask],
	exports: [TasksService]
})
export class TasksModule {}
