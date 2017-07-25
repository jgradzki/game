import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { log } from '../libs/debug';
import Window from './Window.jsx';
import LocationManager from '../libs/locationManager';
import locations from '../locations/locations.jsx';

class Location extends Component {
	constructor(props) {
		super(props);		
	}

	_routeLocation() {
		let Location = locations[this.props.location.locationType];

		if (location) {
			return <div><Location /></div>;
		} else {
			let DefaultLoc = locations['default'];

			return <div> <DefaultLoc /> </div>;
		}
	}

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
						{ this._routeLocation() }
					</div>
				</Window>
			);
		} else {
			return null;
		}  
	}
}

Location.propTypes = {
	player: PropTypes.object,
	location: PropTypes.object
};

let mapStateToProps  = (state) => {
	return {
		player: state.player, 
		location: state.location
	};
};

let mapDispatchToProps = (dispatch) => {
	return { };
};


export default connect(mapStateToProps, mapDispatchToProps)(Location);