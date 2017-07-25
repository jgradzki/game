const errorReducer = (state = {is: false}, action) => {
	switch (action.type) {
	case 'setError':
		return {
			is: true,
			msg: action.msg,
			details: action.details,
			critical: action.critical
		};
	case 'clearError':
		return {
			is: false
		};
		break;
	default:
		return state;
	}
};


export default errorReducer;