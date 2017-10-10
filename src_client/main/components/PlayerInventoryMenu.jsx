import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ContextMenu, Item, Separator, IconFont } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.min.css';

class WeaponOptions extends Component {
	render() {
		const { combat } = this.props;

		return (
			<div>
				<Item onClick={() => this.props.onClick('set_as_weapon')}>
					Wyekwipuj
				</Item>
				<Item disabled>
					{combat && combat.attack && `Atak: ${combat.attack}`}
				</Item>
				<Item disabled>
					{combat && combat.speed && ` Prędkość: ${combat.speed}`}
				</Item>
				<Separator />
			</div>
		);
	}

	static propTypes = {
		onClick: PropTypes.func,
		combat: PropTypes.object.isRequired
	}
}

class FoodOptions extends Component {
	render() {
		const { restore } = this.props;

		return (
			<div>
				<Item onClick={() => this.props.onClick('eat')}>
					Zjedz
				</Item>
				<Item disabled>
					{restore && restore.hunger && `Głód: -${restore.hunger}`}
				</Item>
				<Separator />
			</div>
		);
	}

	static propTypes = {
		onClick: PropTypes.func,
		restore: PropTypes.object.isRequired
	}
}

class PlayerInventoryMenu extends Component {
	render() {
		const { onClick } = this.props;

		return (
			<ContextMenu id={this.props.id}>
				{this.props.item.combat && <WeaponOptions onClick={onClick} combat={this.props.item.combat} />}
				{this.props.item.eat && <FoodOptions onClick={onClick} restore={this.props.item.eat} />}
			</ContextMenu>
		);
	}

	static propTypes = {
		id: PropTypes.string.isRequired,
		onClick: PropTypes.func.isRequired,
		item: PropTypes.object.isRequired
	}
}

export default PlayerInventoryMenu;
