import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { log } from '../libs/debug';

import { getDeadModeWindowStatus } from '../selectors/systemSelectors';

import ErrorBox from './ErrorBox.jsx';
import DeadView from './DeadView.jsx';
import TopBar from './TopBar.jsx';
import Map from './Map.jsx';
import Location from './Location.jsx';
import InventoryView from './InventoryView.jsx';
import LocationEnterButton from './LocationEnterButton.jsx';
import Loading from './Loading.jsx';


class GameContainer extends Component {
	render() {
		log('render', 'GameContainer render');
		if (this.props.showDeadWindow) {
			return (
				<div className="gameContainer">
					<DeadView />
				</div>
			);
		} else {
			return (
				<div className="gameContainer">
					<TopBar />
					<Map />
					<Location />
					<LocationEnterButton />
					<Loading />
					<ErrorBox />
					<InventoryView />
				</div>
			);
		}
	}

	static propTypes = {
		showDeadWindow: PropTypes.bool
	}
}

let mapStateToProps  = (state, props) => ({
	showDeadWindow: getDeadModeWindowStatus(state, props)
});

let mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(GameContainer);
