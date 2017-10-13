import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import axios from 'axios';
import { connect } from 'react-redux';
import DungeonRoom from './DungeonRoom.jsx';
import { setPlayerPosition, setLocationMap } from '../../../actions/location';
import { setFightLog } from '../../../actions/locations/dungeonActions';
import { setPlayerHP } from '../../../actions/player';
import { log } from '../../../libs/debug';


class DungeonMap extends Component {
	constructor(props) {
		super(props);
		this.roomSize = 50; //TODO
	}

	render() {
		log('render', 'DungeonMap render');

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
					{ this._renderRooms() }
				</div>
			</div>
		);
	}

	_renderRooms() {
		let rooms = this.props.location.map;
		let array = [];

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
					array.push(
						<DungeonRoom
							key={y+''+x}
							overStyle={os}
							onClick={() => this._roomClickHandler(x, y)}
							pos={{
								left: position.left,
								top: position.top
							}}
							left={(rooms[y][x].doors.left ? 'true' : 'false')}
							right={(rooms[y][x].doors.right ? 'true' : 'false')}
							up={(rooms[y][x].doors.up ? 'true' : 'false')}
							down={(rooms[y][x].doors.down ? 'true' : 'false')}
						/>
					);
				}
			}
		}

		return array;
	}

	_canMove(x, y) {
		if (this.props.location.fight) {
			return false;
		}

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
						position: {
							x,
							y
						}
					}
				)
					.then(response => response.data)
					.then(data => {
						if (data.error) {
							throw data.error;
						}

						if (data.success) {
							this.props.changePlayerPosition({
								x: data.data.position.x,
								y: data.data.position.y
							});
							this.props.setLocationMap(data.data.rooms);
							if (data.data.fight) {
								this.props.setFightLog(data.data.fight);
								if (_.isNumber(data.data.fight.playerHP)) {
									this.props.setPlayerHP(data.data.fight.playerHP);
								}
							} else {
								this.props.setFightLog(undefined);
							}
						}
					})
					.catch(error => {
						log('error', error);
					});
			}
		}
	}

	static propTypes = {
		location: PropTypes.object,
		changePlayerPosition: PropTypes.func.isRequired,
		setLocationMap: PropTypes.func.isRequired,
		setFightLog: PropTypes.func.isRequired,
		setPlayerHP: PropTypes.func.isRequired
	}
}


let mapStateToProps  = state => ({
	location: state.location
});

let mapDispatchToProps = dispatch => ({
	changePlayerPosition(position) {
		dispatch(setPlayerPosition(position));
	},
	setLocationMap(rooms) {
		dispatch(setLocationMap(rooms));
	},
	setFightLog(text) {
		dispatch(setFightLog(text));
	},
	setPlayerHP(hp) {
		dispatch(setPlayerHP(hp));
	}
});

export default connect(mapStateToProps, mapDispatchToProps)(DungeonMap);
