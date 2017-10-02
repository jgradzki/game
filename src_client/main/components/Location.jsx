import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { log } from '../libs/debug';
import Window from './Window.jsx';
import LocationManager from '../libs/locationManager';
import locations from '../locations';

class Location extends Component {
	render() {
		log('render', 'Location render');
		if (this.props.player.inLocation) {
			return (
				<Window
					wcn="locationWindow"
					tcn="locationWindowTile"
					ccn="locationWindowContent"
					title={[
						'Location(', this.props.location.locationType, ') | [',
						<a onClick={()=>LocationManager.requestLocationExit()} > Wyjdź </a>, ']'
					]}
					style={{
						left: '50%',
						top: '50%',
						width: '800px',
						height: '800px',
						transform: 'translate(-50%, -50%)'
					}}
				>
					<div className="locationContainer">
						{ this._getLocation() }
					</div>
				</Window>
			);
		} else {
			return null;
		}
	}

	_getLocation() {
		const Location = locations[this.props.location.locationType];

		if (location) {
			return <div>
				<Location />
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
