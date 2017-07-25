const mapStateReducer = (state = 0, action) => {
	switch (action.type) {
	case 'changePosition':
		return {
			...state,
			position: { x: action.x,
				y: action.y },
			initial: { x: action.initial.x,
				y: action.initial.y },
			changed: true
		};
	case 'startDrag':
		return {
			...state,
			initial: { x: action.x,
				y: action.y },
			dragging: true
		};
	case 'stopDrag':
		return {
			...state,
			dragging: false,
			changed: false
		};
	case 'addMapElement':
		return {
			...state,
			mapElements: [...state.mapElements, {
				id: action.id,
				icon: action.icon,
				position: action.position,
				size: action.size
			}]
		};
	case 'changeDestination':
		return {
			...state,
			destination: action.position,
			movementSpeed: action.movementSpeed
		};
	case 'changePlayerPosition':
		return {
			...state,
			playerPosition: action.newPosition
		};
	default:
		return state;
	}
};


export default mapStateReducer;
