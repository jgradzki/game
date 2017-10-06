import _ from 'lodash';
import { actionTypes } from '../../actions/locations/playerBaseActions';

const playerBaseReducer = (state, action) => {
	switch (action.type) {
		case actionTypes.SET_VIEW_MAIN:
			return {
				...state,
				viewMode: 'main'
			};
		case actionTypes.SET_VIEW_UPGRADE:
			return {
				...state,
				viewMode: 'upgrade',
				equipment: _.toLower(action.equipment)
			};
		case actionTypes.SET_VIEW_WORKSHOP:
			return {
				...state,
				viewMode: 'workshop'
			};
		default:
			return state;
	}
};

export default playerBaseReducer;
