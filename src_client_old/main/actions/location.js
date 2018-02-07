import actionTypes from './actionTypes';

export const setLocationType = type => ({
	type: actionTypes.LOCATION_SET_TYPE,
	locationType: type
});

export const setLocationInitialData = data => ({
	type: actionTypes.LOCATION_SET_INITIAL_DATA,
	data
});

/* DUNGEON_MAP */
export const setLocationMap = map => ({
	type: actionTypes.LOCATION_SET_MAP,
	map
});

export const setPlayerPosition = position => ({
	type: actionTypes.LOCATION_SET_PLAYER_POSITION,
	position
});

/* END DUNGEON_MAP */
