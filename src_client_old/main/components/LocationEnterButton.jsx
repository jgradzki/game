import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setPlayerInLocation } from '../actions/player.js';
import LocationManager from '../libs/locationManager.js';

class LocationEnterButton extends Component {
	constructor(props) {
		super(props);
		this.locationID = 0;
		this.type = '';
	}

	_LocationEnterButtonOnClick() {
    	if (this._checkPlayer()) {
			LocationManager.requestLocationEnter(this.locationID, this.type);
    	} else {
    		console.log('Error while entering location, please contact developers');
    	}
	}

	_calculateCorners(x, y, size) {
    	let cLeftTop = {
    		x: x-(size.width/2),
    		y: y-(size.height/2)
    	};
    	let cRightBottom = {
    		x: x+(size.width/2),
    		y: y+(size.height/2)
    	};

    	return {
    		cLeftTop,
			cRightBottom
		};
	}

	_checkPlayer() {
		if (!this.props.map.mapElements) {
			return false;
		}

    	let is = false;
    	let playerPosition = this.props.map.playerPosition;

    	this.props.map.mapElements.map(t => {
    		let objectCorners = this._calculateCorners(t.position.x, t.position.y, t.size);

    		if ( ( playerPosition.x < objectCorners.cRightBottom.x ) && ( playerPosition.x > objectCorners.cLeftTop.x ) ) {
    			if ( ( playerPosition.y < objectCorners.cRightBottom.y ) && ( playerPosition.y > objectCorners.cLeftTop.y ) ) {
    				is = true;
    				this.locationID = t.id;
    				this.type = t.types[0];
    			}
    		}
    	});
    	return is;
	}

	render() {
		return (
			<div className="locationEnterButton" >
				<button
					onClick={() => this._LocationEnterButtonOnClick() }
					disabled={!this._checkPlayer()}
				>Wejdź</button>
			</div>
		);
	}
}

let mapStateToProps  = (state) => {
	return {
		map: state.mapState
	};
};

let mapDispatchToProps = (dispatch) => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(LocationEnterButton);
