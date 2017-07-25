import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { connect } from 'react-redux';
import DungeonRoom from './DungeonRoom.jsx';
import { changePlayerPosition } from '../actions/location';
import { log } from '../libs/debug';


class DungeonMap extends Component {
	constructor() {
		super();
		this.renderedRooms = [];
		this.roomSize = 50; //TODO
	}

	_canMove(x, y) {
		let can = false;
		let rooms = this.props.location.map;

		if (this.props.location.playerPosition.x-1 === x && this.props.location.playerPosition.y === y) {
			//na lewo od current
			if (rooms[y][x].doors.right) {
				can = true;
			}
		} else if (this.props.location.playerPosition.x+1 === x && this.props.location.playerPosition.y === y) {
			//na prawo od current
			if (rooms[y][x].doors.left) {
				can = true;
			}
		} else if (this.props.location.playerPosition.x === x && this.props.location.playerPosition.y-1 === y) {
			//nad current
			if (rooms[y][x].doors.down) {
				can = true;
			}
		} else if (this.props.location.playerPosition.x === x && this.props.location.playerPosition.y+1 === y) {
			//pod current
			if (rooms[y][x].doors.up) {
				can = true;
			}
		}

		return can;
	}

	_roomClickHandler(x, y) {
		log('dungeonMap', 'roomClick: ', x, y);
		if (typeof(x)===typeof(1) && typeof(y)===typeof(1)) {
			if (this._canMove(x, y)) {
				axios.post('game/request',
					{
						type: 'dungeonChangePosition',
						position: {x,
							y}
					}
				)
					.then(response => response.data)
					.then(data => {
						if (data.error) {
							throw data.error;
						}

						if (data.success) {
							this.props.changePlayerPosition({ 
								x: data.position.x,
								y: data.position.y 
							});
						}
					})
					.catch(error => {
						log('errors', error);
					});
			}
		}
	}

	componentWillUpdate() {
		this.renderedRooms = [];
	}

	_renderRooms() {
		let rooms = this.props.location.map;

		for (let y = 0; y < rooms.length; y++) {
			for (let x = 0; x < rooms[y].length; x++) {
				if (rooms[y][x].is) {
					let position = {
						left: ( this.roomSize*(x) ),
						top: ( this.roomSize*(y) )
					};

					let os = '';

					if (this.props.location.playerPosition.x === x && this.props.location.playerPosition.y === y) {
						os += ' now';
					}

					if (this._canMove(x, y)) {
						os += ' click';
					}

					//if(!rooms[y][x].is){
					//os += ' empty'
					//}
					this.renderedRooms.push(
						<DungeonRoom key={y+''+x} overStyle={os} onClick={() => this._roomClickHandler(x, y)} pos={{left: position.left,
							top: position.top }} left={(rooms[y][x].doors.left ? 'true' : 'false')} right={(rooms[y][x].doors.right ? 'true' : 'false')} up={(rooms[y][x].doors.up ? 'true' : 'false')} down={(rooms[y][x].doors.down ? 'true' : 'false')}/>
					);
				}
			}
		}
	}

	render() {
		log('render', 'DungeonMap render');
		//this.renderRoom({left: 450, top: 200},this.props.dungeon.map.old)
		this._renderRooms();
		let left = 125 - ( (this.props.location.playerPosition.x ) * ( this.roomSize  ) );
		let top = 30 + ( ( this.props.location.playerPosition.y + 1 ) * this.roomSize );

		return (
			<div className="dungeonMap">
				<div style={{
					position: 'absolute',
					botton: '0px',
					bottom: `${top}px`,
					left: `${left}px`
				}}>
					{ this.renderedRooms }
				</div>
			</div>
		);
	}
}

DungeonMap.propTypes = {
	location: PropTypes.object
};

let mapStateToProps  = (state) => {
	return {
		location: state.location
	};
};

let mapDispatchToProps = (dispatch) => {
	return {
		changePlayerPosition(position) {
			dispatch(changePlayerPosition(position));
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(DungeonMap);