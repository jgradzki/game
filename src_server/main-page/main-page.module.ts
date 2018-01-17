import { Module } from '@nestjs/common';
import { MainPageController } from './main-page.controller';

@Module({
  imports: [],
  controllers: [MainPageController],
  components: [],
})
export class MainPageModule {}
