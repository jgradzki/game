import React, { Component } from 'react';
import { connect } from 'react-redux';
import { log } from '../libs/debug';

import ErrorBox from './ErrorBox.jsx';
import TopBar from './TopBar.jsx';
import Map from './Map.jsx';
import Location from './Location.jsx';
import LocationEnterButton from './LocationEnterButton.jsx';
import Loading from './Loading.jsx';


class GameContainer extends Component {
	render() {
		log('render', 'GameContainer render');
		return (
			<div className="gameContainer">
				<TopBar />
				<Map />
				<Location />
				<LocationEnterButton />
				<Loading />
				<ErrorBox />
			</div>
		);
	}
}

let mapStateToProps  = (state, props) => {
	return {};
};

let mapDispatchToProps = dispatch => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(GameContainer);
