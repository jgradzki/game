import React, { Component } from 'react';
import { connect } from 'react-redux';
import { log } from '../libs/debug';

import { getPlayerStateForTopBar } from '../selectors/playerSelector';

class TopBar extends Component {
	render() {
		log('render', 'TopBar render');
		return (
			<div className="topBar">
				<div className="login">Witaj {this.props.name} |
            Życie: {this.props.hp} |
            Energia: {this.props.energy}
				</div>
				<a className="logout" href="/game/logout">Wyloguj</a>
			</div>
		);
	}
}

let mapStateToProps  = (state, props) => {
	return {
		...getPlayerStateForTopBar(state, props)
	};
};

let mapDispatchToProps = (dispatch) => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(TopBar);
