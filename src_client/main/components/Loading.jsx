import React, { Component } from 'react';
import { connect } from 'react-redux';
import { log } from '../libs/debug';

import getLoadingStatus from '../selectors/loadingSelector';

class Loading extends Component {
	render() {
		if (this.props.loading.status) {
			log('render', 'Loading render');
			return (
				<div className="loading">
					<img src="img/loading.svg" />
				</div>
			);
		} else {
			return null;
		}
	}
}

let mapStateToProps  = (state, props) => {
	return {
		loading: getLoadingStatus(state, props)
	};
};

let mapDispatchToProps = dispatch => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Loading);
