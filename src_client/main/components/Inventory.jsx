import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import uuidv4 from 'uuid/v4';
import { ContextMenuProvider } from 'react-contexify';
import { log } from '../libs/debug';

import PlayerInventoryMenu from './PlayerInventoryMenu.jsx';

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
		const menuId = uuidv4();

		if (this.props.items && _.isArray(this.props.items) ) {
			//this.props.items.forEach((item) => {
			for (let i = 0; i < this.props.items.length; i++) {
				const item = this.props.items[i];
				let itemRender;

				if (this.props.menu === 'playerInventory') {
					const className = `inventoryItem${item.combat && item.combat.selected ? ' inventoryItemSelected' : ''}`;

					itemRender = (
						<div
							key={i}
							id={i}
							className={className}
							onClick={()=>this.props.onClick && this.props.onClick(i)}
						>
							<ContextMenuProvider id={`${menuId}-${i}`}>
								<span>{item.count}</span>
								<img
									src=""
									alt={item.type}
									title={`${item.type}`}
								/>
							</ContextMenuProvider>
							<PlayerInventoryMenu
								id={`${menuId}-${i}`}
								item={item}
								onClick={action => this.props.onMenuClick(action, i)}
							/>
						</div>
					);
				} else {
					itemRender = <div
						key={i}
						id={i}
						className="inventoryItem"
						onClick={()=>this.props.onClick && this.props.onClick(i)}
					>
						<span>{item.count}</span>
						<img
							src=""
							alt={item.type}
							title={`${item.type}`}
						/>
					</div>;
				}
				slots.push(itemRender);
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
		menu: PropTypes.string,
		slots: PropTypes.number.isRequired,
		onClick: PropTypes.func,
		onMenuClick: PropTypes.func,
		items: PropTypes.arrayOf(PropTypes.shape({
			type: PropTypes.string.isRequired,
			count: PropTypes.number.isRequired
		}))
	};

	static defaultProps = {
		items: []
	};
}

export default Inventory;
