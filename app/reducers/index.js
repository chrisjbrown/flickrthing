// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import User from './User';
import Photos from './Photos';

const rootReducer = combineReducers({
  router,
  User,
  Photos
});

export default rootReducer;
