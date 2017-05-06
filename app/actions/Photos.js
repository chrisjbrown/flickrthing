
import { remote } from 'electron';
import * as types from '../constants/ActionTypes';

const flickrCookie = remote.getGlobal('flickrCookie');

export function getPhotos() {
  requestPhotos();
  return dispatch =>
    fetch(`http://localhost:8090/api/getPhotos?token=${flickrCookie}`)
      .then(response => response.json())
      .then(json => {
        console.log(json);
        return dispatch(receivePhotos(json.data));
      })
      .catch(err => {
        errorPhotos(err);
        throw err;
      });
}

function requestPhotos() {
  return {
    type: types.PHOTOS_REQUEST
  };
}

function errorPhotos(error) {
  return {
    type: types.PHOTOS_ERROR,
    payload: {
      error
    }
  };
}

function receivePhotos(album) {
  return {
    type: types.PHOTOS_RECEIVE,
    payload: {
      album,
    }
  };
}
