import { Module  } from '@nestjs/common';
import { TypeOrmModule } from '../../db';

import { InventoryService } from './inventory.service';
import { Inventory } from './inventory.entity';
import { InventoryFactory } from './inventory.factory';

@Module({
	imports: [TypeOrmModule.forFeature([Inventory])],
	controllers: [],
	components: [InventoryFactory, InventoryService],
	exports: [InventoryService]
})
export class InventoryModule {}
