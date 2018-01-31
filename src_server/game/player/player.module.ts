import { Module } from '@nestjs/common';
import { TypeOrmModule } from '../../db';

import { Player } from './player.entity';

import { PlayerController } from './player.controller';
import { PlayersService } from './players.service';
import { PlayerFactory } from './player.factory';
import { ConfigModule } from '../config/config.module';
import { InventoryModule } from '../inventory';

// Actions
import { EatAction } from './inventory-actions/eat.action';

@Module({
  imports: [TypeOrmModule.forFeature([Player]), ConfigModule, InventoryModule],
  controllers: [PlayerController],
  components: [
  	PlayerFactory,
  	PlayersService,
  	EatAction
  ],
  exports: [TypeOrmModule.forFeature([Player]), PlayersService]
})
export class PlayerModule {}
