import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { log } from '../libs/debug';

import { closePlayerInventory } from '../actions/player';
import Inventory from './Inventory.jsx';

class InventoryView extends Component {
	render() {
		log('render', 'InventoryView render');
		if (!this.props.inventoryIsOpen) {
			return null;
		}

		return (
			<div className="inventoryWindow">
				<Inventory
					name="Ekwipunek"
					top={0}
					left={0}
					width={495}
					height={295}
					slots={this.props.inventorySize}
					items={this.props.inventory}
				/>
				<button
					onClick={() => this.props.closePlayerInventory()}
					style={{position: 'absolute', right: '0px'}}
				>Zamknij</button>
			</div>
		);
	}

	static propTypes = {
		inventoryIsOpen: PropTypes.bool.isRequired,
		inventorySize: PropTypes.number.isRequired,
		inventory: PropTypes.array.isRequired,
		closePlayerInventory: PropTypes.func.isRequired,
	}
}

let mapStateToProps  = state => {
	return 	{
		inventoryIsOpen: state.player.inventoryIsOpen || false,
		inventorySize: state.player.inventorySize || 0,
		inventory: state.player.inventory || [],
	};
};

let mapDispatchToProps = dispatch => {
	return {
		closePlayerInventory() {
			dispatch(closePlayerInventory());
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(InventoryView);
