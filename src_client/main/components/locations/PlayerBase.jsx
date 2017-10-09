import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { log } from '../../libs/debug';
import makeRequest from '../../libs/request';
import * as actions from '../../actions/locations/playerBaseActions';
import { setPlayerInventory } from '../../actions/player';

import MainView from './PlayerBase/PlayerBaseMainView.jsx';
import UpgradeView from './PlayerBase/PlayerBaseUpgradeView.jsx';

class PlayerBase extends Component {
	constructor(props) {
		super(props);

		this.state = {
			equipment: {},
			message: ''
		};
	}

	componentWillMount() {
		this._onEnter(this.props.location.initialData);
	}

	render() {
		if (this.props.location.viewMode === 'upgrade') {
			return <UpgradeView
				equipment = {{
					...this.state.equipment[this.props.location.equipment],
					name: this.props.location.equipment
				}}
				playerInventory = {this.props.player.inventory}
				confirm = {() => this._upgrade(this.props.location.equipment)}
				cancel = {() => this.props.setViewToMain()}
				message = {this.state.message}
			/>;
		} else {
			return <MainView
				equipment = {this.state.equipment}
				upgrade = {equipment => this.props.setViewToUpgrade(equipment)}
				requestExit = {this.props.requestExit}
			/>;
		}
	}

	_onEnter(data) {
		console.log(data);

		this.setState({
			equipment: data.equipment
		});
	}

	_upgrade(equipment) {
		makeRequest(
			'playerBaseAction',
			{
				type: 'upgrade',
				equipment: _.toUpper(equipment)
			}
		)
			.then(response => response.data)
			.then(data => {
				if (data.error) {
					log('error', data);
				}
				if (data.success) {
					if (data.equipment) {
						this.setState({
							equipment: data.equipment
						});
						this.props.setViewToMain();
					}
					if (data.inventory) {
						this.props.setPlayerInventory(data.inventory);
					}
				}
				if (data.message) {
					this.setState({
						message: data.message
					});
				}
			})
			.catch(error => log('error', error));
	}

	static propTypes = {
		location: PropTypes.object.isRequired,
		player: PropTypes.shape({
			inventory: PropTypes.array.isRequired,
			inventorySize: PropTypes.number.isRequired
		}),
		requestExit: PropTypes.func.isRequired,
		setViewToMain: PropTypes.func.isRequired,
		setViewToUpgrade: PropTypes.func.isRequired,
		setViewToWorkshop: PropTypes.func.isRequired,
		setPlayerInventory: PropTypes.func.isRequired,
	};
}

const mapStateToProps  = state => ({
	location: state.location,
	player: state.player
});

const mapDispatchToProps = dispatch => ({
	setViewToMain() {
		dispatch(actions.setViewToMain());
	},
	setViewToUpgrade(equipment) {
		dispatch(actions.setViewToUpgrade(equipment));
	},
	setViewToWorkshop() {
		dispatch(actions.setViewToWorkshop());
	},
	setPlayerInventory(inventory) {
		dispatch(setPlayerInventory(inventory));
	}
});

export default connect(mapStateToProps, mapDispatchToProps)(PlayerBase);
