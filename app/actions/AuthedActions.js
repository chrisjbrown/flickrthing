import nodeUrl from 'url';
import * as types from '../constants/ActionTypes';

const { remote: { BrowserWindow } } = require('electron');

export function initAuth() {
  return (dispatch, getState) => {
    if (getState().User.token) {
      return dispatch(receiveAccessToken(getState().User.token));
    }
    return dispatch(loginUser());
  };
}

function receiveAccessToken(token) {
  return {
    type: types.RECEIVE_ACCESS_TOKEN,
    payload: {
      token
    }
  };
}

function authCallback(url, authWindow) {
  return dispatch => {
    const urlParts = nodeUrl.parse(url, true);
    const query = urlParts.query;
    const token = query.oauth_token;
    const error = query.error;
    if (error !== undefined) {
      authWindow.removeAllListeners('closed');
      setImmediate(() => {
        authWindow.close();
      });
      return dispatch(receiveAccessToken('fail'));
    } else if (token) {
      authWindow.removeAllListeners('closed');
      setImmediate(() => {
        authWindow.close();
      });
      return dispatch(receiveAccessToken(token));
    }
  };
}

export function loginUser() {
  return (dispatch: () => void) => {
    const authUrl = 'http://localhost:8090/api';
    const winOptions = {
      width: 600,
      height: 800,
      show: false,
      nodeIntegration: false,
      webPreferences: {
        webSecurity: false
      }
    };
    const authWindow = new BrowserWindow(winOptions);
    authWindow.webContents.on('will-navigate',
      (event, url) => {
        if (url.indexOf('authed') !== -1) {
          dispatch(authCallback(url, authWindow));
        }
      });
    authWindow.webContents.on('did-get-redirect-request',
      (event, oldUrl, newUrl) => {
        if (newUrl.indexOf('authed') !== -1) {
          dispatch(authCallback(newUrl, authWindow));
        }
      });
    authWindow.on('closed', () => {
      throw new Error('window was closed by user');
    });
    authWindow.loadURL(authUrl);
    return authWindow.show();
  };
}
