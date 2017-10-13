import _ from 'lodash';
import actionTypes from '../actions/actionTypes';

const systemReducer = (state = {}, action) => {
	const { SYSTEM_DEAD_MODE, SET_PLAYER_HP } = actionTypes;

	switch (action.type) {
		case SET_PLAYER_HP:
			if (!_.isNumber(action.hp) || action.hp > 0) {
				return state;
			} else {
				return {
					...state,
					deadMode: true
				};
			}
		case SYSTEM_DEAD_MODE:
			return {
				...state,
				deadMode: action.state || false
			};
		default:
			return state;
	}
};


export default systemReducer;
