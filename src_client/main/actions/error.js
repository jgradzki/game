export const setError = (msg, details=false, critical = false) => {
	return {
		type: 'setError',
		msg,
		details,
		critical
	};
};

export const clearError = () => {
	return {
		type: 'clearError'
	};
};
