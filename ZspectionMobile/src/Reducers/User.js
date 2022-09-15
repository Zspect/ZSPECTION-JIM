const initialState = {
	loading: false,
	data: [],
	error: ''
}

const FETCH_USER_REQUEST = 'FETCH_USER_REQUEST';
const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';
const FETCH_USER_FAILURE = 'FETCH_USER_FAILURE';

const fetchUserRequest = () => {
	return {
		type: FETCH_USER_REQUEST
	}
}

const fetchUserSucess = user => {
	return {
		type: FETCH_USER_SUCCESS,
		payload: user
	}
}

const fetchUserFailure = error => {
	return {
		type: FETCH_USER_REQUEST,
		payload: error
	}
}

const User = (state = initialState, action) => {
	switch(action.type) {
		case FETCH_USER_REQUEST:
			return {
				...state,
				loading: true
			}
		case FETCH_USER_SUCCESS:
			return {
				...state,
				loading: false,
				user: action.payload,
				error: ''
			}
		case FETCH_USER_FAILURE:
			return {
				...state,
				loading: false,
				user: [],
				error: action.payload
			}
		default:
			return initialState;
	}
}

export default User;