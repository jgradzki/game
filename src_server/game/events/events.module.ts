import { Module } from '@nestjs/common';

import { EventsGateway } from './events.gateway';
import { PlayerModule } from '../player/player.module';

@Module({
	imports: [PlayerModule],
	components: [EventsGateway]
})
export class EventsModule {}
