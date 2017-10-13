const actionPrefix = 'LOC_DUNGEON_';

export const actionTypes = {
	'SET_LOOT_LIST': `${actionPrefix}SET_LOOT_LIST`,
	'REMOVE_ITEM': `${actionPrefix}REMOVE_ITEM`,
	'ADD_ITEM': `${actionPrefix}ADD_ITEM`,
	'CHANGE_ITEM_COUNT': `${actionPrefix}CHANGE_ITEM_COUNT`,
	'SET_FIGHT_LOG': `${actionPrefix}SET_FIGHT_LOG`,
};

export const setLootList = (room, inventory) => ({
	type: actionTypes.SET_LOOT_LIST,
	room,
	inventory
});

export const removeItem = (room, slot) => ({
	type: actionTypes.REMOVE_ITEM,
	room,
	slot
});

export const addItem = (room, item) => ({
	type: actionTypes.ADD_ITEM,
	room,
	item
});

export const changeItemCount = (room, slot, count) => ({
	type: actionTypes.CHANGE_ITEM_COUNT,
	room,
	slot,
	count
});

export const setFightLog = fight => ({
	type: actionTypes.SET_FIGHT_LOG,
	fight
});

