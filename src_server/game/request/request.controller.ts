import { Post, Response, Controller, UseGuards, Session } from '@nestjs/common';
import * as path from 'path';

import { LoggedInGuard } from '../guards/loggedin.guard';

import { ConfigService } from '../config/config.service';
import { PlayersService } from '../player/players.service';
import { LocationsService } from '../locations/locations.service';
import { InventoryService } from '../inventory';
import { ItemsService } from '../items';
import { stringToLocationType } from '../locations/entities';

@Controller('game/request')
@UseGuards(LoggedInGuard)
export class RequestController {
	constructor(
		private readonly playersService: PlayersService,
		private readonly configService: ConfigService,
		private readonly locationsService: LocationsService,
		private readonly inventoryService: InventoryService,
		private readonly itemsService: ItemsService,
	) {}

	@Post('init')
	async init(@Response() res, @Session() session) {
		const player = await this.playersService.getPlayerById(session.playerID);

		const initData = {
			store: {
				system: {
					showDeadWindow: !player.isAlive()
				},
				map: {
					playerPosition: player.mapPosition,
					destination: player.mapTarget,
					movementSpeed: this.configService.get('player.playerSpeedOnMap', '50')
				},
				player: {
					name: player.login,
					inventorySize: player.inventory.size,
					inventory: player.inventory.filtreItems(),
					hp: player.hp,
					hunger: player.hunger,
					energy: player.energy,
					meleeWeapon: player.meleeWeapon && player.meleeWeapon.getItemData()
				}
			},
			inLocation: null,
			location: null
		};

		if (player.inLocation()) {
			const location = await this.locationsService.getLocation(
				stringToLocationType(player.locationType),
				player.locationId
			);

			if (!location) {
				player.locationId = null;
				player.locationType = null;
			} else {
				const locationService = this.locationsService.getLocationService(stringToLocationType(location.getType()));
				initData.inLocation = true;
				initData.location = {
					type: location.getType(),
					data: await locationService.getDataForPlayer(location.id, player)
				};
			}
		}

		res.send(initData);
	}

	@Post('reset')
	async reset(@Response() res, @Session() session) {
		const player = await this.playersService.getPlayerById(session.playerID);
		const { x, y } = player.base.mapElement.mapPosition;

		if (player.isAlive()) {
			res.send({
				error: 'cant-reset-when-alive'
			});
		}

		this.inventoryService.utils.removeItems(player.inventory, player.inventory.items);

		if (player.inLocation()) {

			const location = await this.locationsService.getLocation(
				stringToLocationType(player.locationType),
				player.locationId
			);

			if (location) {
				await location.onPlayerExit(player);
			}

			player.exitLocation();
		}

		if (player.meleeWeapon) {
			this.itemsService.removeItem(player.meleeWeapon);
			player.meleeWeapon = null;
		}

		player.mapPosition = { x, y };
		player.hp = 100;
		player.hunger = 0;
		player.energy = 100;

		res.send({success: true});
	}

}
