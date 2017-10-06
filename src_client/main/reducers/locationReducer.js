import actionTypes from '../actions/actionTypes';
import reducers from './locations/reducers';

const locationReducer = (state = {}, action) => {
	switch (action.type) {
		case actionTypes.LOCATION_SET_TYPE:
			return {
				...state,
				locationType: action.locationType
			};
		case actionTypes.LOCATION_SET_INITIAL_DATA:
			return {
				locationType: state.locationType,
				initialData: action.data
			};
		/* DUNGEON_MAP */
		case actionTypes.LOCATION_SET_MAP:
			return {
				...state,
				map: action.map
			};
		case actionTypes.LOCATION_SET_PLAYER_POSITION:
			return {
				...state,
				playerPosition: action.position
			};
		/* END DUNGEON_MAP */
		default:
			return reducers(state, action);
	}
};


export default locationReducer;
