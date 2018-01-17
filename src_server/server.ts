import 'ts-node/register';
import { NestFactory } from '@nestjs/core';
import * as Express from 'express';
import * as path from 'path';

import { ApplicationModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(ApplicationModule);
	app.use(Express.static(path.resolve(__dirname, 'public')));
	await app.listen(3000);
}
bootstrap();
