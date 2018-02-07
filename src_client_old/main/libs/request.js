import axios from 'axios';

module.exports =  (type, data) => {
	return axios.post('/game/request', {
		type,
		data
	});
};


/*
const processCommandFromServer = (command) => {
	switch(command.commandType){
		case 'dispatch':
			store.dispatch(command);
		break;
	}
}


const handleDataFromServer = (data) => {
	if(Array.isArray(data)){
		data.forEach(v => {
			processCommandFromServer(v);
		})
	}else{
		processCommandFromServer(data);
	}
}

function checkStatus(response) {
	if (response.status >= 200 && response.status < 300) {
		return response
	} else {
		var error = new Error(response.statusText)
		error.response = response
		throw error
	}
}

const request = (type, data) => {
	return fetch('game/request',
		{
		   	credentials: 'same-origin',
		    method: type,
		    headers: new Headers({
				'Content-Type': 'application/json',
				Accept: 'application/json',
		    }),
		    body: JSON.stringify(data),

		}
	).then(data => checkStatus(data));
}

module.exports = request;
*/
