import { Module } from '@nestjs/common';
import { TypeOrmModule } from './db';
import { Connection } from 'typeorm';

import { MainPageModule } from './main-page/main-page.module';
import { GameModule } from './game/game.module';

import { AppController } from './app.controller';

@Module({
	imports: [
		TypeOrmModule.forRoot(),
		GameModule,
		MainPageModule
	],
	controllers: [AppController],
	components: [],
})
export class ApplicationModule {
	constructor(private readonly connection: Connection) {}
}
