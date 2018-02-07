import React, { Component } from 'react';
import { connect } from 'react-redux';

class MapElement extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return <div id={`me_${this.props.id}`} className="mapElement" style={{width: `${this.props.size.width}px`,
			height: `${this.props.size.height}px`,
			left: `${this.props.position.x-(this.props.size.width/2)}px`,
			top: `${this.props.position.y-(this.props.size.height/2)}px`}}><img src={this.props.config.mapIcons[this.props.icon].img} style={{width: '100%',
				height: '100%'}}/></div>;
	}
}

let mapStateToProps  = (state, props) => {
	return {
		config: { ...state.config }
	};
};

let mapDispatchToProps = (dispatch) => {
	return { };
};

export default connect(mapStateToProps, mapDispatchToProps)(MapElement);
