import _ from 'lodash';
import actionTypes from '../actions/actionTypes';

export const setDeadMode = status => {
	if (!_.isBoolean(status)) {
		status = false;
	}

	return {
		type: actionTypes.SYSTEM_DEAD_MODE,
		status
	};
};
