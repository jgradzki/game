import 'ts-node/register';
import { NestFactory } from '@nestjs/core';
import * as Express from 'express';
import * as Session from 'express-session';
import * as path from 'path';

import { log, initLogger } from './logger';

import { ApplicationModule } from './app.module';
import { GameModule } from './game/game.module';
import { ConfigModule } from './game/config/config.module';
import { ConfigService } from './game/config/config.service';
import { EventsModule } from './game/events/events.module';
import { EventsGateway } from './game/events/events.gateway';

initLogger();

log('info', 'Initializing...');

async function bootstrap() {
	const app = await NestFactory.create(ApplicationModule);

	const configService = app.select(GameModule)
		.select(ConfigModule)
		.get(ConfigService);

	app.use(Express.static(path.resolve(__dirname, configService.get('httpPublicFolder', 'public'))));

	if (!configService.has('session')) {
		log('warn', 'No session settings in config.');
	}

	const session = Session(configService.get('session'));

	app.use(session);
	app.select(GameModule)
		.select(EventsModule)
		.get(EventsGateway).session = session;

	await app.listen(configService.get('host.port', 3000), configService.get('host.adress', 'localhost'));
}

log('info', 'Init complete. Starting.');
bootstrap()
	.then(() => log('info', 'Started.'))
	.catch(error => log('error', error));
