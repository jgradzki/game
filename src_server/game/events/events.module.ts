import { Module } from '@nestjs/common';

import { EventsGateway } from './events.gateway';
import { ConfigModule } from '../config/config.module';
import { PlayerModule } from '../player/player.module';

@Module({
	imports: [ConfigModule, PlayerModule],
	components: [EventsGateway]
})
export class EventsModule {}
