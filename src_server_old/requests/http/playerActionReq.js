import { log } from '../../logger';

module.exports = (req, res, server, player) => {
	if (!player.isAlive()) {
		res.send({
			error: true,
			errorMessage: 'Jesteś martwy(na śmierć).'
		});
		return;
	}

	const action = req.body.data;

	switch (action.type) {
		case 'eat':
			eat(req, res, server, player);
			break;
		case 'set_as_weapon':
			setAsWeapon(req, res, server, player);
			break;
		default:
			res.send({
				error: true,
				errorCode: 4100,
				errorMessage: 'Unknown action type.'
			});
	}
};

const eat = (req, res, server, player) => {
	const action = req.body.data;
	let inventory = player.inventory.getInventory();

	if (!action.slot && action.slot !== 0) {
		res.send({
			error: true,
			errorCode: 4102.1,
			errorMessage: 'Wrong request data.'
		});
		return;
	}

	if (!inventory[action.slot] || !inventory[action.slot].eat) {
		res.send({
			error: true,
			errorCode: 4102.2,
			errorMessage: 'Wrong request data.'
		});
		return;
	}

	player.eat(inventory[action.slot].eat);
	player.inventory.removeSlot(action.slot, 1);

	res.send({
		success: true,
		inventory: player.inventory.filtreItems(),
		hp: player.hp,
		hunger: player.hunger,
		energy: player.energy
	});
};

const setAsWeapon = (req, res, server, player) => {
	const action = req.body.data;
	let inventory = player.inventory.getInventory();

	if (!action.slot && action.slot !== 0) {
		res.send({
			error: true,
			errorCode: 4102.1,
			errorMessage: 'Wrong request data.'
		});
		return;
	}

	if (!inventory[action.slot] || !inventory[action.slot].combat) {
		res.send({
			error: true,
			errorCode: 4102.2,
			errorMessage: 'Wrong request data.'
		});
		return;
	}

	if (inventory[action.slot].combat.type === 'melee') {
		player.inventory.setMeleeWepon(action.slot);
	} else if (inventory[action.slot].combat.type === 'range') {
		player.inventory.setRangeWepon(action.slot);
	} else {
		res.send({
			error: true,
			errorCode: 4102.3,
			errorMessage: 'Wrong request data.'
		});
		return;
	}

	res.send({
		success: true,
		inventory: player.inventory.filtreItems()
	});
};
