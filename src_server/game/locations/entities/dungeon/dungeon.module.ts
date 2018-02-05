import { Module  } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigModule } from '../../../config/config.module';
import { PlayerModule } from '../../../player/player.module';

import { Dungeon } from './dungeon.entity';
import { DungeonService } from './dungeon.service';
import { DungeonController } from './dungeon.controller';
import { InventoryModule } from '../../../inventory';
import { ItemsModule } from '../../../items';

@Module({
	imports: [ConfigModule, TypeOrmModule.forFeature([Dungeon]), ItemsModule, InventoryModule],
	components: [DungeonService, DungeonController],
	exports: [DungeonService]
})
export class DungeonModule {}
