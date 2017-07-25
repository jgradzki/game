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
			code: 4101, 
			msg: 'Not in location.' 
		});
		return;
	}

	console.log(req.body.data);

	let action = req.body.data;

	switch (action.type) {
		case 'loot':
			server.gameManager.locationManager.getLocation(player.location, player.locationType)
				.then(dungeon => {
					let item = dungeon.getRoomItems(dungeon.getPlayerLocation(player.id))[action.slot];

					if (item && item.name) {
						let countTaken = player.inventory.addItem(item);

						if (countTaken && countTaken > 0) {
							/*if (countTaken < item.count) {
								store.dispatch(dungeonAction.changeItemCount(locationId, playerPosition, action.slot, item.count - countTaken));
							} else {
								store.dispatch(dungeonAction.removeItem(locationId, playerPosition, action.slot));
							}

							sendChanges({
								type: 'post',
								res,
								tasks: [
									{ 
										commandType: 'dispatch',
										...setLootList(playerPosition, Dungeon.getRoomItems(locationId, playerPosition)) },
									{ 
										commandType: 'dispatch',
										...setPlayerInventory(player.getInventory()) 
									}
								]
							});*/

							res.send({
								success: true,
								newInvetory: player.inventory.getInventory()
							});

						} else {
							res.send({ 
								error: true, 
								code: 4104, 
								msg: 'Internal server error.' 
							});
						}


					} else {
						res.send({ 
							error: true, 
							code: 4104, 
							msg: 'Internal server error.' 
						});
					}
				})
				.catch(error => {
					log('error', error);
					res.send({ 
						error: true, 
						code: 4104, 
						msg: 'Internal server error.' 
					});
				});
			break;
		default:
			res.send({
				error: true,
				errorCode: 4105,
				errorMessage: 'Unknown action type.'
			});
	}
};
