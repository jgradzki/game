import { Module } from '@nestjs/common';
import { TypeOrmModule } from './db';
import { Connection } from 'typeorm';
import { log } from './logger';

import { MainPageModule } from './main-page/main-page.module';
import { GameModule } from './game/game.module';
import { GameService } from './game/game.service';

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
	constructor(
		private readonly connection: Connection,
		private readonly gameService: GameService
	) {
		this.catchProcessExit();

		const stdin = process.openStdin();

		stdin.addListener('data', d => this.handleCommand(d.toString().trim()));
	}

	private catchProcessExit() {
		process.on('exit', code => this.handleExit(code));
		process.on('SIGINT', () => this.handleExit(null));
		process.on('uncaughtException', err => this.handleUncaughtException(err));
	}

	async onExit() {
		log('info', 'Server closing.');

		await this.gameService.close();

		process.exit(3);
	}

	private handleExit(code) {
		if (code !== 3) {
			this.onExit();
		}
	}

	private handleUncaughtException(error) {
		log('error', error);
		this.onExit();
	}

	private async handleCommand(command: string) {
		if (command === 'close') {
			await this.gameService.close();
			process.exit(3);
			return;
		}

		console.log(`Unknown command: ${command}.`);
	}
}
