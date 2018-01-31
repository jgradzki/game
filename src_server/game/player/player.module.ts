import { Module } from '@nestjs/common';
import { TypeOrmModule } from '../../db';

import { Player } from './player.entity';

import { PlayerController } from './player.controller';
import { PlayersService } from './players.service';
import { PlayerFactory } from './player.factory';
import { ConfigModule } from '../config/config.module';
import { InventoryModule } from '../inventory';
import { ItemsModule } from '../items';

// Actions
import { EatAction } from './inventory-actions/eat.action';
import { SetMeleeWeponAction } from './inventory-actions/set-melee-wepon.action';
import { RemoveMeleeWeponAction } from './inventory-actions/remove_melee_weapon';

@Module({
  imports: [TypeOrmModule.forFeature([Player]), ConfigModule, ItemsModule, InventoryModule],
  controllers: [PlayerController],
  components: [
  	PlayerFactory,
  	PlayersService,
  	EatAction,
  	SetMeleeWeponAction,
  	RemoveMeleeWeponAction
  ],
  exports: [TypeOrmModule.forFeature([Player]), PlayersService]
})
export class PlayerModule {}
