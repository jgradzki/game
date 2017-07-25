import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { log } from '../libs/debug';

class Window extends Component {
	render() {
		log('render', 'Window render');
  	return (
	<div className={ `window ${this.props.wcn}` } style={this.props.style} >
				{ this.props.title ? <div className={ `windowTitle ${this.props.tcn}` }>{ this.props.title }</div> : '' }
				<div className={ `windowContent ${this.props.ccn}` }>{ this.props.children }</div>
			</div>
  	);
	}
}

Window.propTypes = {
	style: PropTypes.object,
	wcn: PropTypes.string,
	tcn: PropTypes.string,
	ccn: PropTypes.string,
	title: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.array,
		PropTypes.element
	]),
	children: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.element,
		PropTypes.array
	])
};

Window.defaultProps = {
	wcn: '',
	tcn: '',
	ccn: ''
};

export default Window;
