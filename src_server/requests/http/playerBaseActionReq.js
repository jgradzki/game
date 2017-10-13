import { log } from '../../logger';

module.exports = (req, res, server, player) => {
	if (!player.isAlive()) {
		res.send({
			error: true,
			errorMessage: 'Jesteś martwy(na śmierć).'
		});
		return;
	}

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
	if (player.locationType !== 'PLAYER_BASE') {
		res.send({
			error: true,
			code: 4103,
			msg: 'Not in location.'
		});
		return;
	}

	const action = req.body.data;

	switch (action.type) {
		case 'upgrade':
			try {
				const level = player.base.getEquipmentLevel(action.equipment);

				if (!player.base.isUpgradeable(action.equipment, level)) {
					res.send({
						error: true,
						message: 'You cant upgrade it.'
					});
				} else {
					if (!player.inventory.has(player.base.getUpgradeCosts(action.equipment, level))) {
						res.send({
							error: true,
							message: 'Not enough items.'
						});
					} else {
						const inventory = player.inventory.removeItems(player.base.getUpgradeCosts(action.equipment, level));

						player.base.upgrade(action.equipment);
						player.base.getDataForPlayer(player.id)
							.then(data => {
								res.send({
									success: true,
									equipment: data.equipment,
									inventory
								});
							});
					}
				}
			} catch (error) {
				log('error', error);
				res.send({
					error: true,
					code: 4104,
					message: 'Internal server error.'
				});
			}
			break;
		default:
			res.send({
				error: true,
				errorCode: 4100,
				errorMessage: 'Unknown action type.'
			});
	}
};
