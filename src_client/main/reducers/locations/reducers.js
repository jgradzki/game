import dungeonReducer from './dungeonReducer';

const reducers = (state, action) => {
	state = dungeonReducer(state, action);

	return state;
};

export default reducers;