import { Module } from '@nestjs/common';
import { TypeOrmModule } from '../../db';

import { Player } from './Player.entity';

import { PlayersService } from './players.service';

@Module({
  imports: [TypeOrmModule.forFeature([Player]),],
  components: [PlayersService],
  exports: [TypeOrmModule.forFeature([Player]), PlayersService]
})
export class PlayerModule {}
