import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { log } from '../libs/debug';
import makeRequest from '../libs/request';

import { closePlayerInventory, setPlayerInventory, setPlayerHP, setPlayerEnergy, setPlayerHunger } from '../actions/player';
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
					menu='playerInventory'
					onMenuClick={(action, slot) => this._onMenuAction(action, slot)}
				/>
				<button
					onClick={() => this.props.closePlayerInventory()}
					style={{position: 'absolute', right: '0px'}}
				>Zamknij</button>

			</div>
		);
	}

	_onMenuAction(action, slot) {
		makeRequest('playerAction',
			{
				type: action,
				slot
			}
		)
			.then(response => response.data)
			.then(data => {
				if (data.error) {
					log('error', data);
				}

				if (data.success) {
					if (data.inventory) {
						this.props.setPlayerInventory(data.inventory);
					}
					if (_.isNumber(data.hp)) {
						this.props.setPlayerHP(data.hp);
					}
					if (_.isNumber(data.energy)) {
						this.props.setPlayerEnergy(data.energy);
					}
					if (_.isNumber(data.hunger)) {
						this.props.setPlayerHunger(data.hunger);
					}
				}
			})
			.catch(error => {
				log('error', error);
			});
	}

	static propTypes = {
		inventoryIsOpen: PropTypes.bool.isRequired,
		inventorySize: PropTypes.number.isRequired,
		inventory: PropTypes.array.isRequired,
		closePlayerInventory: PropTypes.func.isRequired,
	}
}

let mapStateToProps  = state => ({
	inventoryIsOpen: state.player.inventoryIsOpen || false,
	inventorySize: state.player.inventorySize,
	inventory: state.player.inventory,
});

let mapDispatchToProps = dispatch => ({
	closePlayerInventory() {
		dispatch(closePlayerInventory());
	},
	setPlayerInventory(inventory) {
		dispatch(setPlayerInventory(inventory));
	},
	setPlayerHP(hp) {
		dispatch(setPlayerHP(hp));
	},
	setPlayerEnergy(energy) {
		dispatch(setPlayerEnergy(energy));
	},
	setPlayerHunger(hunger) {
		dispatch(setPlayerHunger(hunger));
	}
});

export default connect(mapStateToProps, mapDispatchToProps)(InventoryView);
