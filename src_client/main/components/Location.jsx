import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { log } from '../libs/debug';
import LocationManager from '../libs/locationManager';
import locations from './locations';

class Location extends Component {
	render() {
		log('render', 'Location render');
		if (this.props.player.inLocation) {
			return <div className="locationWindow">{this._getLocation()}</div>;
		} else {
			return null;
		}
	}

	_getLocation() {
		const Location = locations[this.props.location.locationType];

		if (location) {
			return <div>
				<Location requestExit={LocationManager.requestLocationExit} />
			</div>;
		} else {
			const DefaultLoc = locations['default'];

			return <div>
				<DefaultLoc />
			</div>;
		}
	}

	static propTypes = {
		player: PropTypes.object,
		location: PropTypes.object
	};
}

const mapStateToProps  = state => {
	return {
		player: state.player,
		location: state.location
	};
};

const mapDispatchToProps = dispatch => {
	return {

	};
};


export default connect(mapStateToProps, mapDispatchToProps)(Location);
