import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Inventory from '../../Inventory.jsx';

export default class PlayerBaseUpgradeView extends Component {
	render() {
		console.log(this.props);
		return (
			<div>
				<div>Ulepszenie {this.props.equipment.name} na poziom {this.props.equipment.level + 1}</div>
				<div>
					<Inventory
						name="Koszta"
						top={350}
						left={50}
						width={300}
						height={100}
						slots={this.props.equipment.upgradeCosts.length}
						items={this.props.equipment.upgradeCosts}
					/>
				</div>
				<div>
					<Inventory
						name="Ekwipunek"
						top={350}
						left={450}
						width={300}
						height={100}
						slots={this.props.playerInventory.length}
						items={this.props.playerInventory}
					/>
				</div>
				<div>
					<a onClick={() => this.props.confirm()} className="pointer">Ulepsz</a>
					<a onClick={() => this.props.cancel()} className="pointer">Anuluj</a>
				</div>
				<div>{this.props.message || ''}</div>
			</div>
		);
	}

	static propTypes = {
		equipment: PropTypes.shape({
			name: PropTypes.string.isRequired,
			upgradeCosts: PropTypes.array.isRequired,
			level: PropTypes.number.isRequired,
		}),
		message: PropTypes.string,
		playerInventory: PropTypes.array.isRequired,
		confirm: PropTypes.func.isRequired,
		cancel: PropTypes.func.isRequired,
	}
}

