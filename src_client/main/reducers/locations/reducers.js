import playerBaseReducer from './playerBaseReducer';
import dungeonReducer from './dungeonReducer';

const reducers = (state, action) => {
	state = playerBaseReducer(state, action);
	state = dungeonReducer(state, action);

	return state;
};

export default reducers;
