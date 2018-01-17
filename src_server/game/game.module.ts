import { Module } from '@nestjs/common';
import { GameController } from './game.controller';

@Module({
  imports: [],
  controllers: [GameController],
  components: [],
})
export class GameModule {}
