import { ERROR_SET, ERROR_CLEAR } from '../actions/actionTypes';

const errorReducer = (state = {is: false}, action) => {
	switch (action.type) {
		case ERROR_SET:
			return {
				is: true,
				msg: action.msg,
				details: action.details,
				critical: action.critical
			};
		case ERROR_CLEAR:
			return {
				is: false
			};
		default:
			return state;
	}
};


export default errorReducer;
