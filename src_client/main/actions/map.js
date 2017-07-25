export const changePosition = (x, y, ix, iy) => {

	return {
		type: 'changePosition',
		x,
		y,
		initial: { x: ix,
			y: iy }
	};
};

export const startDrag = (x, y) => {
	return {
		type: 'startDrag',
		x,
		y
	};
};

export const stopDrag = () => {
	return {
		type: 'stopDrag'
	};
};

export const addMapElement = (id, icon, position, size) => {
	return {
		type: 'addMapElement',
		id,
		position,
		size,
		icon
	};
};

export const changeDestination = (position, speed = 0) => {
	return {
		type: 'changeDestination',
		position,
		movementSpeed: speed
	};
};

export const changePlayerPosition = (position) => {
	return {
		type: 'changePlayerPosition',
		newPosition: position
	};
};
