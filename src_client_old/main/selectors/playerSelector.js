import { createSelector } from 'reselect';

const getPlayerStateFromStore = state => state.player;

export const getPlayerStateForTopBar = createSelector(
	[getPlayerStateFromStore],
	player => ({
		name: player.name,
		hp: player.hp,
		energy: player.energy,
		hunger: player.hunger
	})
);

export const getPlayerInventory = createSelector(
	[getPlayerStateFromStore],
	player => ({
		inventory: player.inventory,
		inventorySize: player.inventorySize
	})
);

