import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { log } from '../libs/debug';
import Window from './Window.jsx';

class Inventory extends Component {

	render() {
		log('render', 'Inventory render');
		return (
			<Window
				wcn="inventory"
				tcn="inventoryTitle"
				ccn="inventoryContent"
				title={this.props.name}
				style={{
					width: this.props.width+'px',
					height: this.props.height+'px',
					top: this.props.top+'px',
					left: this.props.left+'px'
				}}
			>
				{this._getSlots()}
			</Window>

		);
	}

	_getSlots() {
		let slots = [];
		let used = 0;

		if (this.props.items && Object.prototype.toString.call( this.props.items ) === '[object Array]' ) {
			//this.props.items.forEach((item) => {
			for (let i = 0; i < this.props.items.length; i++) {
				slots.push(
					<div
						key={i}
						className="inventoryItem"
						onClick={()=>this.props.onClick && this.props.onClick(i)}
					>
						<span>{this.props.items[i].count}</span>
						<img
							src=""
							alt={this.props.items[i].fullName}
							title={`${this.props.items[i].fullName}`}
						/>
					</div>
				);
				used++;
			}
		}

		for (used; used<this.props.slots; used++) {
			slots.push(<div key={used} className="inventoryEmptySlot"/>);
		}

		return slots;
	}

	static propTypes = {
		width: PropTypes.number,
		height: PropTypes.number,
		top: PropTypes.number,
		left: PropTypes.number,
		centerX: PropTypes.bool,
		centerY: PropTypes.bool,
		name: PropTypes.string.isRequired,
		slots: PropTypes.number.isRequired,
		onClick: PropTypes.func,
		items: PropTypes.arrayOf(PropTypes.shape({
			name: PropTypes.string.isRequired,
			fullName: PropTypes.string.isRequired,
			count: PropTypes.number.isRequired
		}))
	};

	static defaultProps = {
		items: []
	};
}

export default Inventory;
