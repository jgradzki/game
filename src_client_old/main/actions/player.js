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

export const setMeleeWeapon = item => ({
	type: actionTypes.SET_PLAYER_MELEE_WEAPON,
	item
});

export const removeItemFromInventory = slot => ({
	type: actionTypes.REMOVE_ITEM_FROM_PLAYER_INVENTORY,
	slot
});

export const openPlayerInventory = () => ({
	type: actionTypes.OPEN_PLAYER_INVENTORY
});

export const closePlayerInventory = () => ({
	type: actionTypes.CLOSE_PLAYER_INVENTORY
});

export const setPlayerHP = hp => ({
	type: actionTypes.SET_PLAYER_HP,
	hp
});

export const setPlayerEnergy = energy => ({
	type: actionTypes.SET_PLAYER_ENERGY,
	energy
});

export const setPlayerHunger = hunger => ({
	type: actionTypes.SET_PLAYER_HUNGER,
	hunger
});
