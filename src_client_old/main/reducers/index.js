import { combineReducers } from 'redux';
import mapStateReducer from '../reducers/mapStateReducer.js';
import playerReducer from '../reducers/playerReducer.js';
import configReducer from '../reducers/configReducer.js';
import locationReducer from '../reducers/locationReducer.js';
import errorReducer from '../reducers/errorReducer.js';
import systemReducer from '../reducers/systemReducer.js';

function lastAction(state = null, action) {
	return action;
}

const reducers = combineReducers({
	mapState: mapStateReducer,
	player: playerReducer,
	config: configReducer,
	location: locationReducer,
	error: errorReducer,
	system: systemReducer,
});

export default reducers;
