import { Module  } from '@nestjs/common';
import { TypeOrmModule } from '../../../../db';

import { ConfigModule } from '../../../config/config.module';
import { PlayerModule } from '../../../player/player.module';

import { Dungeon } from './dungeon.entity';
import { DungeonService } from './dungeon.service';
import { DungeonController } from './dungeon.controller';

@Module({
	imports: [ConfigModule, TypeOrmModule.forFeature([Dungeon])],
	components: [DungeonService, DungeonController],
	exports: [DungeonService]
})
export class DungeonModule {}
