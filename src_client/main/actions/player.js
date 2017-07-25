const setPlayerInLocation = (is) => {
	if (is !== false && is !== true) {
		is = false;
	}
	return {
		type: 'setPlayerInLocation',
		inLocation: is
	};
};

const setPlayerInventory = (inventory) => {
	return {
		type: 'setPlayerInventory',
		inventory
	};
};

const addItemToInventory = (item) => {
	return {
		type: 'addItemToInventory',
		item
	};
};

const removeItemFromInventory = (slot) => {
	return {
		type: 'removeItemFromInventory',
		slot
	};
};

module.exports = {
	setPlayerInLocation,
	setPlayerInventory,
	addItemToInventory,
	removeItemFromInventory
};