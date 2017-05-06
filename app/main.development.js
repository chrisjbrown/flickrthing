/* eslint global-require: 1, flowtype-errors/show-errors: 0 */
// @flow
import nodeUrl from 'url';
import { app, BrowserWindow, session } from 'electron';
import MenuBuilder from './menu';

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
  require('electron-debug')();
  const path = require('path');
  const p = path.join(__dirname, '..', 'app', 'node_modules');
  require('module').globalPaths.push(p);
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = [
    'REACT_DEVELOPER_TOOLS',
    'REDUX_DEVTOOLS'
  ];

  return Promise
    .all(extensions.map(name => installer.default(installer[name], forceDownload)))
    .catch(console.log);
};

const renderAuthWindow = () => {
  let authWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728
  });

  authWindow.loadURL('http://localhost:8090/api');
  authWindow.webContents.on('did-finish-load', () => {
    if (!authWindow) {
      throw new Error('"authWindow" is not defined');
    }
    authWindow.show();
    authWindow.focus();
  });

  authWindow.on('closed', () => {
    authWindow = null;
  });
  authWindow.webContents.on('did-get-response-details',
    (event, status, newUrl) => {
      console.log('got response', newUrl);
      if (newUrl.indexOf('authed') === -1) {
        return;
      }
      if (!authWindow) {
        throw new Error('"authWindow" is not defined');
      }
      const urlParts = nodeUrl.parse(newUrl, true);
      const query = urlParts.query;
      let token;
      let error;

      if (typeof query === 'object') {
        token = query.oauth_token;
        error = query.error;
      }

      if (error) {
        return console.error('could not auth :(');
      }

      console.log('have token: ', token);
      const newCookie = {
        url: 'http://localhost',
        name: 'flickrCookie',
        value: token
      };
      global.flickrCookie = token;

      session.defaultSession.cookies.set(newCookie, cookieError => {
        if (cookieError) console.error(cookieError);
      });
      authWindow.removeAllListeners();
      authWindow.close();
      renderAppWindow();
    }
  );
};

const renderAppWindow = () => {
  let mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728
  });

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();
};

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', async () => {
  if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
    await installExtensions();
  }

  session.defaultSession.cookies.get({ url: 'http://localhost' }, (error, cookies) => {
    console.log('have cookies: ', cookies.length);
    console.log('get cookie error: ', error);
    if (cookies.length > 0 && cookies[0].name && cookies[0].value) {
      global.flickrCookie = cookies[0].value;
    }
  });

  if (!global.flickrCookie) {
    renderAuthWindow();
  } else {
    renderAppWindow();
  }
});
