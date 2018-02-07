import React, { Component } from 'react';
import { connect } from 'react-redux';
import Window from './Window.jsx';
import errorSelector from '../selectors/errorSelector';
import { clearError } from '../actions/error';
/*
<div className="errorBox">
				<div className="title">Error <button onClick={this.props.clearError}>Zamknij</button></div>
				<div className="msg">{this.props.error.msg || 'unknown'}</div>
			</div>*/
class ErrorBox extends Component {
	getMsg() {
		return <div>{this.props.error.msg || 'unknown'} </div>;
	}

	getDetails() {
		return <div>{this.props.error.details} </div>;
	}

	render() {
		if (this.props.error.is) {
			return <Window wcn="errorBox" tcn="errorBoxTitle" ccn="errorBoxMsg" title={<div className="title">Error <button onClick={() => {
				this.props.clearError();
			}}>Zamknij</button></div>}>
				{[
					this.getMsg(),
					this.getDetails()
				]}
			</Window>;
		} else {
			return null;
		}
	}
}


let mapStateToProps = (state, props) => {
	return {
		error: errorSelector(state)
	};
};

let mapDispatchToProps = (dispatch) => {
	return {
		clearError: () => {
			dispatch(clearError()); 
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ErrorBox);
