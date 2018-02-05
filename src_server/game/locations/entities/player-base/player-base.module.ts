import { Module  } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigModule } from '../../../config/config.module';
import { PlayerModule } from '../../../player/player.module';

import { PlayerBase } from './player-base.entity';
import { PlayerBaseService } from './player-base.service';
import { PlayerBaseController } from './player-base.controller';
import { InventoryModule } from '../../../inventory';
import { ItemsModule } from '../../../items';

@Module({
	imports: [ConfigModule, TypeOrmModule.forFeature([PlayerBase]), ItemsModule, InventoryModule],
	components: [PlayerBaseService, PlayerBaseController],
	exports: [PlayerBaseService]
})
export class PlayerBaseModule {}
