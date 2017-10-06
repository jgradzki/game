import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class PlayerBaseMainView extends Component {
	render() {
		return (
			<div className="locationPlayerBaseContainer">
				<a className="locationDungeonExitButton" onClick={()=>this.props.requestExit()} >[Wyjdź]</a>
				<div style={{marginTop: '10px'}}>
					<div>Wyposazenie</div>
					<div>
						<div>
							Łóżko(Poziom {this.props.equipment.bed.level})
							Akcje: <a onClick={()=>{}} className="pointer">Śpij</a>
						</div>
						<div>
							Warsztat(Poziom {this.props.equipment.workshop.level})
							Akcje:
							{this.props.equipment.workshop.level > 0 ?
								<a onClick={()=>{}} className="pointer"> Wytwórz</a> : ''
							}
							{this.props.equipment.workshop.upgradeable ?
								<a onClick={()=>this.props.upgrade('WORKSHOP')} className="pointer"> Ulepsz</a> : ''
							}
						</div>
					</div>
				</div>
			</div>
		);
	}

	static propTypes = {
		equipment: PropTypes.object.isRequired,
		requestExit: PropTypes.func.isRequired,
		upgrade: PropTypes.func.isRequired,
	}
}

