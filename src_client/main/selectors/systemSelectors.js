import { createSelector } from 'reselect';

export const getDeadModeStatus = createSelector(
	state => state.system,
	system => system.deadMode
);

export const getDeadModeWindowStatus = createSelector(
	state => state.system,
	system => system.showDeadWindow
);
