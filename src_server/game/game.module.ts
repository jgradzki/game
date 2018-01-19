import { Module  } from '@nestjs/common';

import { PlayerModule } from './player/player.module';

import { GameController } from './game.controller';
import { ApiController } from './api/api.controller';

@Module({
  imports: [PlayerModule],
  controllers: [GameController, ApiController],
  components: []
})
export class GameModule {}
