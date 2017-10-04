import actionTypes from './actionTypes';

export const setError = (msg, details=false, critical = false) => {
	return {
		type: actionTypes.ERROR_SET,
		msg,
		details,
		critical
	};
};

export const clearError = () => {
	return {
		type: actionTypes.ERROR_CLEAR
	};
};
