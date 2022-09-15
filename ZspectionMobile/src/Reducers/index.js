import CounterReducer from './Counter';
import LoggedReducer from './IsLogged';
import { combineReducers } from 'redux';

const allReducer = combineReducers({
	counter: CounterReducer,
	isLogged: LoggedReducer
})
export default allReducer;