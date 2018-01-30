import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import axios from 'axios';
import { connect } from 'react-redux';
import { log } from '../../libs/debug';

import { setLocationMap, setPlayerPosition } from '../../actions/location';
import * as dungeonActions from '../../actions/locations/dungeonActions';
import { setPlayerInventory, setPlayerHP } from '../../actions/player';
import { getPlayerInventory } from '../../selectors/playerSelector';
import { onMenuAction } from '../../libs/playerInventory';

import DungeonMap from './Dungeon/DungeonMap.jsx';
import Inventory from '../Inventory.jsx';

class Dungeon extends Component {
	componentWillMount() {
		this._onEnter(this.props.location.initialData);
	}

	render() {
		return (
			<div className="locationDungeonContainer">
				<DungeonMap />
				<a className="locationDungeonExitButton" onClick={()=>this.props.requestExit()} >[Wyjdź]</a>
				{this._getContent()}
			</div>
		);
	}

	_onEnter(data) {
		if (!data.rooms || typeof(data.rooms) !== 'object' || !data.position) {
			log('error', {
				code: 3011,
				msg: ['wrong rooms data: ', data]
			});
		} else {
			this.props.setLocationMap(data.rooms);
			this.props.setPlayerPosition(data.position);
			if (data.fight) {
				this.props.setFightLog(data.fight);
				if (_.isNumber(data.fight.playerHP)) {
					this.props.setPlayerHP(data.fight.playerHP);
				}
			}
		}
	}

	_onExit() {

	}

	_getContent() {
		if (this.props.location.fight) {
			return this._getFightView();
		} else {
			return this._getLootView();
		}
	}

	_getFightView() {
		return (
			<div className="dungenFightBox">
				<div className="logBox">
					{(this.props.location.fight &&  this.props.location.fight.fightLog)|| 'error'}
				</div>
				<button onClick={() => this.props.setFightLog(false)}>OK</button>
			</div>
		);
	}

	_getLootView() {
		let items = this._getRoomLoot();

		if (!items) {
			items = [];
		}
		return (
			<div>
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
					menu='playerInventory'
					onMenuClick={(action, slot) => onMenuAction(action, slot)}
				/>
			</div>
		);
	}

	_getPlayerPosition() {
		return this.props.location.playerPosition;
	}

	_getRooms() {
		return this.props.location.map;
	}

	_getCurrentRoom() {
		const playerPosition = this._getPlayerPosition();

		return this._getRooms() && this._getRooms()[playerPosition.x][playerPosition.y];
	}

	_getEnemies() {
		return this._getCurrentRoom() && this._getCurrentRoom().enemies;
	}

	_getRoomLoot() {
		return this._getCurrentRoom() && this._getCurrentRoom().items;
	}

	_onLootClick(slot) {
		let items = this._getRoomLoot();

		if (items) {
			if (items[slot]) {
				axios.post('game/location/action',
					{
						type: 'takeLoot',
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
		player: PropTypes.object.isRequired,
		location: PropTypes.object.isRequired,
		setLocationMap: PropTypes.func.isRequired,
		setLootList: PropTypes.func.isRequired,
		setPlayerPosition: PropTypes.func.isRequired,
		setPlayerInventory: PropTypes.func.isRequired,
		requestExit: PropTypes.func.isRequired,
		setFightLog: PropTypes.func.isRequired,
		setPlayerHP: PropTypes.func.isRequired,
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
	},
	setFightLog(fight) {
		dispatch(dungeonActions.setFightLog(fight));
	},
	setPlayerHP(hp) {
		dispatch(setPlayerHP(hp));
	}
});

export default connect(mapStateToProps, mapDispatchToProps)(Dungeon);
