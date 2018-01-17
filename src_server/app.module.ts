import { Module } from '@nestjs/common';
import { AppController } from './app.controller';

import { MainPageModule } from './main-page/main-page.module';
import { GameModule } from './game/game.module';

@Module({
  imports: [GameModule, MainPageModule],
  controllers: [AppController],
  components: [],
})
export class ApplicationModule {}
