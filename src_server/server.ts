import 'ts-node/register';
import { NestFactory } from '@nestjs/core';
import * as Express from 'express';
import * as Session from 'express-session';
import * as path from 'path';

import { log, initLogger } from './logger';

import { ApplicationModule } from './app.module';
import { GameModule } from './game/game.module';
import { EventsModule } from './game/events/events.module';
import { EventsGateway } from './game/events/events.gateway';

initLogger();

log('info', 'Initializing...');

async function bootstrap() {
	const app = await NestFactory.create(ApplicationModule);

	app.use(Express.static(path.resolve(__dirname, 'public')));

	const session = Session({
		secret: 'fasdhntg4652nt',
		resave: true,
		saveUninitialized: true
	});

	app.use(session);

	app.select(GameModule)
		.select(EventsModule)
		.get(EventsGateway).session = session;

	await app.listen(3000);
}

log('info', 'Init complete. Starting.');
bootstrap()
	.then(() => log('info', 'Started.'))
	.catch(error => log('error', error));
