import { Module  } from '@nestjs/common';
import { TypeOrmModule } from '../../../../db';

import { ConfigModule } from '../../../config/config.module';
import { PlayerModule } from '../../../player/player.module';

import { PlayerBase } from './player-base.entity';
import { PlayerBaseService } from './player-base.service';
import { PlayerBaseController } from './player-base.controller';

@Module({
	imports: [ConfigModule, TypeOrmModule.forFeature([PlayerBase])],
	components: [PlayerBaseService, PlayerBaseController],
	exports: [PlayerBaseService]
})
export class PlayerBaseModule {}
