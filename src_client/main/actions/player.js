import actionTypes from './actionTypes';

export const setPlayerInLocation = inLocation => {
	if (inLocation !== false && inLocation !== true) {
		inLocation = false;
	}

	return {
		type: actionTypes.SET_PLAYER_IN_LOCATION,
		inLocation
	};
};

export const setPlayerInventory = inventory => ({
	type: actionTypes.SET_PLAYER_INVENTORY,
	inventory
});

export const addItemToInventory = item => ({
	type: actionTypes.ADD_ITEM_TO_PLAYER_INVENTORY,
	item
});

export const removeItemFromInventory = slot => ({
	type: actionTypes.REMOVE_ITEM_FROM_PLAYER_INVENTORY,
	slot
});
