import actionTypes from '../actions/actionTypes';

const mapStateReducer = (state = 0, action) => {
	switch (action.type) {
		case actionTypes.MAP_CHANGE_POSITION:
			return {
				...state,
				position: {
					x: action.x,
					y: action.y
				},
				initial: {
					x: action.initial.x,
					y: action.initial.y
				},
				changed: true
			};
		case actionTypes.MAP_START_DRAG:
			return {
				...state,
				initial: {
					x: action.x,
					y: action.y
				},
				dragging: true
			};
		case actionTypes.MAP_STOP_DRAG:
			return {
				...state,
				dragging: false,
				changed: false
			};
		case actionTypes.MAP_ADD_ELEMENT:
			return {
				...state,
				mapElements: [...state.mapElements, {
					id: action.id,
					icon: action.icon,
					position: action.position,
					size: action.size
				}]
			};
		case actionTypes.MAP_CHANGE_DESTINATION:
			return {
				...state,
				destination: action.position,
				movementSpeed: action.movementSpeed
			};
		case actionTypes.MAP_CHANGE_PLAYER_POSITION:
			return {
				...state,
				playerPosition: action.newPosition
			};
		default:
			return state;
	}
};

export default mapStateReducer;
