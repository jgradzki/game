export const change = (i) => {
	if (i == 1) {
		return {
			type: 'INCREMENT'
		};
	} else {
		return {
			type: 'DECREMENT'
		};
	}
};