import { log } from '../../logger';

module.exports = (req, res, server, player) => {
	if (!player.isInLocation()) {
		res.send({
			error: true,
			code: 4101,
			msg: 'Not in location.'
		});
		return;
	}

	if (!req.body || !req.body.data || !req.body.data.type) {
		res.send({
			error: true,
			errorCode: 4102,
			errorMessage: 'Wrong data.'
		});
		return;
	}

	if (player.locationType !== 'DUNGEON') {
		res.send({
			error: true,
			code: 4103,
			msg: 'Not in location.'
		});
		return;
	}

	let action = req.body.data;

	switch (action.type) {
		case 'loot':
			server.gameManager.locationManager.getLocation(player.location, player.locationType)
				.then(dungeon => {
					let roomItems = dungeon.getRoomItems(dungeon.getPlayerLocation(player.id));
					let item = roomItems[action.slot];
					let lootInventory = server.db.getModel('Inventory').build({
						size: roomItems.length,
						content: roomItems
					});

					if (item && item.name) {
						let countTaken = player.inventory.addItem(item);

						if (countTaken && countTaken > 0) {
							lootInventory.removeItem(action.slot, countTaken);

							dungeon.setRoomItems(
								dungeon.getPlayerLocation(player.id),
								lootInventory.getInventory()
							);

							res.send({
								success: true,
								newInventory: player.inventory.getInventory(),
								lootInventory: lootInventory.getInventory()
							});

						} else {
							res.send({
								error: true,
								code: 4104.3,
								msg: 'Inventory is full.'
							});
						}


					} else {
						res.send({
							error: true,
							code: 4104.2,
							msg: 'Internal server error.'
						});
					}
				})
				.catch(error => {
					log('error', error);
					res.send({
						error: true,
						code: 4104.1,
						msg: 'Internal server error.'
					});
				});
			break;
		default:
			res.send({
				error: true,
				errorCode: 4100,
				errorMessage: 'Unknown action type.'
			});
	}
};
