import { Module  } from '@nestjs/common';
import { TypeOrmModule } from '../../db';

import { InventoryService } from './inventory.service';
import { Inventory } from './inventory.entity';
import { InventoryFactory } from './inventory.factory';
import { InventoryUtils } from './inventory.utils';

@Module({
	imports: [TypeOrmModule.forFeature([Inventory])],
	controllers: [],
	components: [InventoryFactory, InventoryService, InventoryUtils],
	exports: [InventoryService]
})
export class InventoryModule {}
