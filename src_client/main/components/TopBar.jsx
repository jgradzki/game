import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { log } from '../libs/debug';

import { getPlayerStateForTopBar } from '../selectors/playerSelector';
import { openPlayerInventory } from '../actions/player';

class TopBar extends Component {
	render() {
		log('render', 'TopBar render');
		return (
			<div className="topBar">
				<div className="login">
					Witaj {this.props.name} |
					Życie: {_.ceil(this.props.hp)} |
					Energia: {_.ceil(this.props.energy)} |
					Głód: {_.round(this.props.hunger, 1)} |
					<a onClick={() => this.props.openPlayerInventory()} className="pointer"> Ekwipunek</a>
				</div>
				<a className="logout" href="/game/logout">Wyloguj</a>
			</div>
		);
	}

	static propTypes = {
		name: PropTypes.string.isRequired,
		hp: PropTypes.number.isRequired,
		energy: PropTypes.number.isRequired,
		hunger: PropTypes.number.isRequired,
		openPlayerInventory: PropTypes.func.isRequired,
	}
}

const mapStateToProps  = (state, props) => {
	return {
		...getPlayerStateForTopBar(state, props)
	};
};

const mapDispatchToProps = dispatch => {
	return {
		openPlayerInventory() {
			dispatch(openPlayerInventory());
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(TopBar);
