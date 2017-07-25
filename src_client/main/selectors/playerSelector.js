import { createSelector } from 'reselect';

const getPlayerStateFromStore = (state, props) => state.player;

export const getPlayerStateForTopBar = createSelector(
	[getPlayerStateFromStore],
	(player) => ({
		name: player.name,
		hp: player.hp,
		energy: player.energy
	})
);

