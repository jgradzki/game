import { createSelector } from 'reselect';
import { store } from '../libs/store';

const getErrorStateFromStore = (state, props) => state.error;

const getErrorState = createSelector(
 	[getErrorStateFromStore],
	(err) => {
		return err;
	}
);

export default getErrorState;
