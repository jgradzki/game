import { createSelector } from 'reselect';
import { store } from '../libs/store';

const getLoadingStateFromStore = (state, props) => state.system.loading;

const getLoadingStatus = createSelector(
 	[getLoadingStateFromStore],
	(err) => {
		return err;
	}
);

export default getLoadingStatus;
