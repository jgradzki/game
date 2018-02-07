import { createSelector } from 'reselect';
import { store } from '../libs/store';

const getMapStateFromStore = (state, props) => state.mapState;

const getMapState = createSelector(
 	[getMapStateFromStore],
	(map) => {
		return map;
	}
);

export default getMapState;
