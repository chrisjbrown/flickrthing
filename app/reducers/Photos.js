import * as types from '../constants/ActionTypes';

const initialPhotosState = {
  isFetching: false,
  album: {},
  error: null
};

export default function photos(state = initialPhotosState, action) {
  switch (action.type) {
    case types.PHOTOS_RECEIVE:
      return Object.assign({}, state, {
        isFetching: false,
        album: action.payload.album,
        error: null
      });
    case types.PHOTOS_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        error: null
      });
    case types.PHOTOS_ERROR:
      return Object.assign({}, state, {
        isFetching: false,
        error: action.payload.error
      });
    default:
      return state;
  }
}
