import 'ts-node/register';
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import * as Express from 'express';
import * as Session from 'express-session';
import * as path from 'path';

import { log, initLogger } from './logger';

import { ApplicationModule } from './app.module';

initLogger();

log('info', 'Initializing...');

async function bootstrap() {
	const app = await NestFactory.create(ApplicationModule);

	app.use(Express.static(path.resolve(__dirname, 'public')));
	app.use(Session({
		secret: 'fasdhntg4652nt',
		resave: true,
		saveUninitialized: true
	}));

	await app.listen(3000);
}

log('info', 'Init complete. Starting.');
bootstrap()
	.then(() => log('info', 'Started.'))
	.catch(error => log('error', error));
