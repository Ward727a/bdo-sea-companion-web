import mainEventHelper from '@common/mainEvent';
import { app, BrowserWindow } from 'electron';
import { createAppWindow, createUpdateWindow } from './appWindow';
import { autoUpdater, AutoUpdaterOptions } from 'electron-github-autoupdater'
import Logger from 'electron-log';

import path from 'path';

/** Handle creating/removing shortcuts on Windows when installing/uninstalling. */
if (require('electron-squirrel-startup')) {
  app.quit();
}


let updateWindow: BrowserWindow;

const config: AutoUpdaterOptions = {
  owner: 'Makpptfox',
  repo: 'BDO-Sea-Companion',
  accessToken: process.env.GT_TOKEN,
}

const log = Logger.create({logId: 'main'});
const AutoUpdater = autoUpdater(config);

/**
 * This method will be called when Electron has finished
 * initialization and is ready to create browser windows.
 * Some APIs can only be used after this event occurs.
 */
app.on('ready', ()=>{
  updateWindow = createUpdateWindow(AutoUpdater);
  log.initialize({preload: true});

  const APP_DATA = app.getPath('userData');

  log.transports.file.resolvePathFn = () => path.join(APP_DATA, 'logs/main.log');
  
  log.transports.file.archiveLogFn(log.transports.file.getFile());
  log.transports.file.level = "debug"

  AutoUpdater.on('error', (error) => {
    log.error(error);
  });
});

mainEventHelper.getInstance().registerCallback('sUpdater', () => {

  console.log('sUpdate');

  createAppWindow(updateWindow);
}, true);

/**
 * Emitted when the application is activated. Various actions can
 * trigger this event, such as launching the application for the first time,
 * attempting to re-launch the application when it's already running,
 * or clicking on the application's dock or taskbar icon.
 */
app.on('activate', () => {

  /**
   * On OS X it's common to re-create a window in the app when the
   * dock icon is clicked and there are no other windows open.
   */
  if (BrowserWindow.getAllWindows().length === 0) {
    updateWindow = createUpdateWindow(AutoUpdater);
  }
});

/**
 * Emitted when all windows have been closed.
 */
app.on('window-all-closed', () => {
  /**
   * On OS X it is common for applications and their menu bar
   * to stay active until the user quits explicitly with Cmd + Q
   */
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

/**
 * In this file you can include the rest of your app's specific main process code.
 * You can also put them in separate files and import them here.
 */
