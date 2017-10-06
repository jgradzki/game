import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { log } from '../../../libs/debug';

class DungeonRoom extends Component {

	render() {
		log('render', 'DungeonRoom render');
		return (
			<div
				className={'room '+this.props.overStyle}
				onClick={this.props.onClick}
				style={{
					left: `${this.props.pos.left}px`,
					top: `${this.props.pos.top}px`
				}}>
				{(this.props.left === 'true' ? <div className="doorsLeft"/> : '') }
				{(this.props.right === 'true' ? <div className="doorsRight"/> : '') }
				{(this.props.up === 'true' ? <div className="doorsUp"/> : '') }
				{(this.props.down === 'true' ? <div className="doorsDown"/> : '') }
			</div>
		);
	}
}

DungeonRoom.propTypes = {
	pos: PropTypes.shape({
		left: PropTypes.number.isRequired,
		top: PropTypes.number.isRequired
	}),
	overStyle: PropTypes.string,
	onClick: PropTypes.func,
	left: PropTypes.string,
	right: PropTypes.string,
	up: PropTypes.string,
	down: PropTypes.string,
};


export default DungeonRoom;
