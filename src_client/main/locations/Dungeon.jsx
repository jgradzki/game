import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { log } from '../libs/debug';
import { setLocationMap, setPlayerPosition } from '../actions/location';
import * as dungeonActions from '../actions/locations/dungeonAction';
import { setPlayerInventory } from '../actions/player';
import { getPlayerInventory } from '../selectors/playerSelector';
import makeRequest from '../libs/request';

import DungeonMap from '../components/DungeonMap.jsx';
import Inventory from '../components/Inventory.jsx';

class Dungeon extends Component {
	constructor(props) {
		super(props);
	}

	componentWillMount() {
		this._onEnter(this.props.location.initialData);
	}

	render() {
		let items = this._getRoomLoot();

		if (!items) {
			items = [];
		}
		return (
			<div>
				<DungeonMap />
				<Inventory
					name="Znalezione"
					onClick={slot => this._onLootClick(slot)}
					top={350}
					left={50}
					width={300}
					height={100}
					slots={items.length}
					items={items}
				/>
				<Inventory
					name="Twój Ekwipunek"
					onClick={slot => this._onItemClick(slot)}
					top={350}
					left={450}
					width={300}
					height={100}
					slots={this.props.player.inventorySize}
					items={this.props.player.inventory}
				/>
			</div>
		);
	}

	_onEnter(data) {
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

	_onExit() {

	}

	_getPlayerPosition() {
		return this.props.location.playerPosition;
	}

	_getRooms() {
		return this.props.location.map;
	}

	_getRoomLoot() {
		const playerPosition = this._getPlayerPosition();

		return this._getRooms() && this._getRooms()[playerPosition.y][playerPosition.x].items;
	}

	_onLootClick(slot) {
		let items = this._getRoomLoot();

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
							log('error', data);
						}

						if (data.success) {
							if (data.newInventory) {
								this.props.setPlayerInventory(data.newInventory);
							}
							if (data.lootInventory) {
								const playerPosition = this._getPlayerPosition();

								this.props.setLootList({
									y: playerPosition.y,
									x: playerPosition.x
								}, data.lootInventory);
							}
						}
					})
					.catch(error => {
						log('error', error);
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

	static propTypes = {
		player: PropTypes.object,
		location: PropTypes.object,
		setLocationMap: PropTypes.func,
		setLootList: PropTypes.func,
		setPlayerPosition: PropTypes.func,
		setPlayerInventory: PropTypes.func,
	};
}

const mapStateToProps  = state => ({
	location: state.location,
	player: {
		...getPlayerInventory(state)
	}
});

const mapDispatchToProps = dispatch => ({
	setLocationMap(rooms) {
		dispatch(setLocationMap(rooms));
	},
	setLootList(room, inventory) {
		dispatch(dungeonActions.setLootList(room, inventory));
	},
	setPlayerPosition(position) {
		dispatch(setPlayerPosition(position));
	},
	setPlayerInventory(inventory) {
		dispatch(setPlayerInventory(inventory));
	}
});

export default connect(mapStateToProps, mapDispatchToProps)(Dungeon);
