import { createStore, combineReducers, applyMiddleware } from 'redux';
import CakeReducer from '../Reducers/CakeReducer';

const store = createStore(CakeReducer);

export default store;