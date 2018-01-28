import { Module  } from '@nestjs/common';
import { TypeOrmModule } from '../../db';

import { ItemsService } from './items.service';
import { Item } from './item.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Item])],
	controllers: [],
	components: [ItemsService],
	exports: [TypeOrmModule.forFeature([Item]), ItemsService]
})
export class ItemsModule {}
