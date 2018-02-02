import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { log } from '../libs/debug';

import { getDeadModeWindowStatus } from '../selectors/systemSelectors';
import { getPlayerStateForTopBar } from '../selectors/playerSelector'

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
				<div className="gameContainer" onContextMenu={this.contextMenu}>
					<DeadView />
				</div>
			);
		} else {
			return (
				<div className="gameContainer" onContextMenu={this.contextMenu}>
					<TopBar />
					<Map />
					<Location />
					<LocationEnterButton />
					<Loading />
					<ErrorBox />
					<InventoryView />
					{this.props.playerStats.hp <= 0 ? <DeadView /> : null }
				</div>
			);
		}
	}

	contextMenu(event) {
		event.preventDefault();
	}

	static propTypes = {
		showDeadWindow: PropTypes.bool
	}
}

let mapStateToProps  = (state, props) => ({
	showDeadWindow: getDeadModeWindowStatus(state, props),
	playerStats: getPlayerStateForTopBar(state, props)
});

let mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(GameContainer);
