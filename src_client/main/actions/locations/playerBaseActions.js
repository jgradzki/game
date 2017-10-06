const actionPrefix = 'LOC_PLAYER_BASE_';

export const actionTypes = {
	'SET_VIEW_MAIN': `${actionPrefix}SET_VIEW_MAIN`,
	'SET_VIEW_UPGRADE': `${actionPrefix}SET_VIEW_UPGRADE`,
	'SET_VIEW_WORKSHOP': `${actionPrefix}SET_VIEW_WORKSHOP`,
};

export const setViewToMain = () => ({
	type: actionTypes.SET_VIEW_MAIN
});

export const setViewToUpgrade = (equipment) => ({
	type: actionTypes.SET_VIEW_UPGRADE,
	equipment
});

export const setViewToWorkshop = () => ({
	type: actionTypes.SET_VIEW_WORKSHOP
});

