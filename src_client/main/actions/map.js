import actionTypes from './actionTypes';

export const changePosition = (x, y, ix, iy) => ({
	type: actionTypes.MAP_CHANGE_POSITION,
	x,
	y,
	initial: {
		x: ix,
		y: iy
	}
});

export const startDrag = (x, y) => ({
	type: actionTypes.MAP_START_DRAG,
	x,
	y
});

export const stopDrag = () => ({
	type: actionTypes.MAP_STOP_DRAG
});

export const addMapElement = (id, icon, position, size) => ({
	type: actionTypes.MAP_ADD_ELEMENT,
	id,
	position,
	size,
	icon
});

export const changeDestination = (position, speed = 0) => ({
	type: actionTypes.MAP_CHANGE_DESTINATION,
	position,
	movementSpeed: speed
});

export const changePlayerPosition = position => ({
	type: actionTypes.MAP_CHANGE_PLAYER_POSITION,
	newPosition: position
});
