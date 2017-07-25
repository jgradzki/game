import React from 'react';
import { connect } from 'react-redux';
import { log } from '../libs/debug';
import { setLocationMap, setPlayerPosition } from '../actions/location';
import { setPlayerInventory } from '../actions/player';
import playerSelector from '../selectors/playerSelector';
import Location from './Location.jsx';
import makeRequest from '../libs/request';

import DungeonMap from '../components/DungeonMap.jsx';
import Inventory from '../components/Inventory.jsx';

class Dungeon extends Location {
	render() {
		let items = Dungeon._getRoomLoot();

		if (!items) {
			items = [];
		}
		return (
			<div>
				<DungeonMap />
				<Inventory name="Znalezione" onClick={ slot => this._onLootClick(slot) } top={350} left={50} width={300} height={100} slots={ items.length } items={ items }/>
				<Inventory name="Twój Ekwipunek" onClick={ slot => this._onItemClick(slot) }  top={350} left={450} width={300} height={100} slots={ this.props.player.inventorySize } items={ this.props.player.inventory } />
			</div>
		);
	}

	static onEnter(data) {
		if (!data.rooms || typeof(data.rooms) !== 'object' || !data.position) {
			throw { 
				code: 3011,
				msg: ['wrong rooms data: ', data] 
			};
		} else {
			this.props.setLocationMap(data.rooms);
			this.props.setPlayerPosition(data.position);
		}
	}

	static onExit() {

	}

	static _getPlayerPosition() {
		return this.props.location.playerPosition;
	}

	static _getRooms() {
		return this.props.location.map;
	}

	static _getRoomLoot() {
		let playerPosition = Dungeon._getPlayerPosition();

		return Dungeon._getRooms()[playerPosition.y][playerPosition.x].items;
	}

	_onLootClick(slot) {
		let items = Dungeon._getRoomLoot();

		if (items) {
			if (items[slot]) {
				makeRequest('dungeonAction',
					{
						type: 'loot',
						slot
					}
				)
					.then(response => response.data)
					.then(data => {
						if (data.error) {
							log('error', data.error);
						}

						if (data.success) {
							if (data.newInventory) {
								this.props.setPlayerInventory(data.newInventory);
							}
						}
					})
					.catch(error => {
						console.log(error);
					});
			}
		}
	}

	_onItemClick(slot) {
		let items = this.props.player.inventory;

		if (items) {
			if (items[slot]) {
				makeRequest('dungeonAction',
					{
						type: 'putBackLoot',
						slot
					}
				)
					.then(response => response.data)
					.then(data => {
						console.log(data);
					})
					.catch(error => {
						console.log(error);
					});
			}
		}
	}
}

let mapStateToProps  = (state) => {
	return {
		location: state.location,
		player: playerSelector(state)
	};
};

let mapDispatchToProps = (dispatch) => {
	return {
		setLocationMap(rooms) {
			dispatch(setLocationMap(rooms));
		},
		setPlayerPosition(position) {
			dispatch(setPlayerPosition(position));
		},
		setPlayerInventory(inventory) {
			dispatch(setPlayerInventory(inventory));
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Dungeon);
