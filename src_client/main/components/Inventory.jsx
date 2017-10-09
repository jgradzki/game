import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { log } from '../libs/debug';

class Inventory extends Component {

	render() {
		log('render', 'Inventory render');
		return (
			<div
				className="inventory"
				style={{
					width: this.props.width+'px',
					height: this.props.height+'px',
					top: this.props.top+'px',
					left: this.props.left+'px'
				}}
			>
				<div className="inventoryTitle">
					{this.props.name || 'Inventory'}
				</div>
				<div className="inventoryContent">
					{this._getSlots()}
				</div>
			</div>
		);
	}

	_getSlots() {
		let slots = [];
		let used = 0;

		if (this.props.items && _.isArray(this.props.items) ) {
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
