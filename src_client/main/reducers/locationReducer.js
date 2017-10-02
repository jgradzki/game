import reducers from './locations/reducers';

const locationReducer = (state = {}, action) => {
	switch (action.type) {
		case 'setLocationType':
			return {
				...state,
				locationType: action.locationType
			};
		case 'setLocationInitialData':
			return {
				...state,
				initialData: action.data
			};
		/* DUNGEON_MAP */
		case 'LocationSetMap':
			return {
				...state,
				map: action.map
			};
		case 'LocationSetPlayerPosition':
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
