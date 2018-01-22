import { Module } from '@nestjs/common';
import { TypeOrmModule } from '../../db';

import { Player } from './player.entity';

import { PlayerController } from './player.controller';
import { PlayersService } from './players.service';
import { PlayerFactory } from './player.factory';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [TypeOrmModule.forFeature([Player]), ConfigModule],
  controllers: [PlayerController],
  components: [PlayerFactory, PlayersService],
  exports: [TypeOrmModule.forFeature([Player]), PlayersService]
})
export class PlayerModule {}
