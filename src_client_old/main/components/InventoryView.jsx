import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { log } from '../libs/debug';

import { onMenuAction } from '../libs/playerInventory';
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
					name="Broń biała"
					top={10}
					left={10}
					width={80}
					height={70}
					slots={1}
					items={this.getMeleeWeapon()}
					menu='playerInventory'
					onMenuClick={(action, slot) => onMenuAction(action, slot)}
					style={{border: '0px'}}
				/>
				<Inventory
					name="Ekwipunek"
					top={100}
					left={3}
					width={491}
					height={190}
					slots={this.props.inventorySize}
					items={this.props.inventory}
					menu='playerInventory'
					onMenuClick={(action, slot) => onMenuAction(action, slot)}
				/>
				<button
					onClick={() => this.props.closePlayerInventory()}
					style={{position: 'absolute', right: '0px'}}
				>Zamknij</button>

			</div>
		);
	}

	getMeleeWeapon() {
		if (!this.props.meleeWeapon || !this.props.meleeWeapon.combat) {
			return [];
		}

		return [{
			...this.props.meleeWeapon,
			combat: {
				...this.props.meleeWeapon.combat,
				equiped: true
			}
		}];
	}

	static propTypes = {
		inventoryIsOpen: PropTypes.bool.isRequired,
		inventorySize: PropTypes.number.isRequired,
		inventory: PropTypes.array.isRequired,
		closePlayerInventory: PropTypes.func.isRequired,
		meleeWeapon: PropTypes.object
	}
}

let mapStateToProps  = state => ({
	inventoryIsOpen: state.player.inventoryIsOpen || false,
	inventorySize: state.player.inventorySize,
	inventory: state.player.inventory,
	meleeWeapon: state.player.meleeWeapon
});

let mapDispatchToProps = dispatch => ({
	closePlayerInventory() {
		dispatch(closePlayerInventory());
	}
});

export default connect(mapStateToProps, mapDispatchToProps)(InventoryView);
