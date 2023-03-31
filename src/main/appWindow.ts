import { app, BrowserWindow, IpcMainEvent, shell } from 'electron';
import path from 'path';
import { events } from './modules/events';
import fs from 'fs';
import { eventSystem } from './modules/eventSystem';
import { templateCheck } from './modules/templateChecker';
import mainEventHelper from '@common/mainEvent';

import { spawn } from 'child_process';

import log from 'electron-log';

// Electron Forge automatically creates these entry points
declare const APP_WINDOW_WEBPACK_ENTRY: string;
declare const APP_WINDOW_PRELOAD_WEBPACK_ENTRY: string;
declare const UPDATE_WINDOW_WEBPACK_ENTRY: string;
declare const UPDATE_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

let appWindow: BrowserWindow;

/**
 * Check if the data files exist
 * If not, create them
 * If they do, delete the ones in the resources folder
 * @returns {void}
 */
function checkDataFiles(): void {

  // If in development, don't do anything with the data files
  // This is because the data files are in the assets folder not the resources folder
  if(process.env.NODE_ENV === 'development'){
    log.info('Development mode detected, skipping data file check');
    return;
  }

  log.info('Checking data files');

  // Check if the data files exist
  // If not, create them

  const userDataPath = app.getPath('userData');

  const resources = process.resourcesPath;

  const xmlFolder = path.join(userDataPath, 'xml');
  const dataFolder = path.join(xmlFolder, 'data');
  const langFolder = path.join(xmlFolder, 'lang');
  const templateFolder = path.join(userDataPath, 'templates');

  if(!fs.existsSync(xmlFolder)){
    log.info('Creating xml folder');
    fs.mkdirSync(xmlFolder);
    fs.mkdirSync(dataFolder);
    fs.mkdirSync(langFolder);
    fs.mkdirSync(templateFolder);
    log.info('Created xml folder');
  }

  // Check if the save data exists in the user data folder
  // eslint-disable-next-line no-constant-condition
  if(fs.existsSync(path.join(dataFolder, 'save_data.xml'))){
    log.info('Save data exists');
    // If it does, delete the one in the resources folder
    if(fs.existsSync(path.join(resources, 'save_data.xml'))){
      log.info('Deleting save data from resources folder');
      fs.rmSync(path.join(resources, 'save_data.xml'));
    }
  } else {
    log.info('Save data does not exist');
    if(!fs.existsSync(path.join(dataFolder, 'save_data.xml'))){
      log.info('Copying save data to user data folder');
      // If it doesn't, copy the one in the resources folder to the user data folder then delete it from the resources folder
      fs.copyFileSync(path.join(resources, 'save_data.xml'), path.join(dataFolder, 'save_data.xml'));
      
      if(fs.existsSync(path.join(resources, 'save_data.xml'))){
        log.info('Deleting save data from resources folder');
        fs.rmSync(path.join(resources, 'save_data.xml'));
      }
    }
  }

  // Check if the settings data exists in the user data folder
  if(fs.existsSync(path.join(xmlFolder, 'settings.xml'))){
    log.info('Settings data exists');
    // If it does, delete the one in the resources folder
    if(fs.existsSync(path.join(resources, 'settings.xml'))){
      log.info('Deleting settings data from resources folder');
      fs.rmSync(path.join(resources, 'settings.xml'));
    }
  } else {
    log.info('Settings data does not exist');
    // If it doesn't, copy the one in the resources folder to the user data folder then delete it from the resources folder
    if(fs.existsSync(path.join(resources, 'settings.xml'))){
      log.info('Copying settings data to user data folder');
      fs.copyFileSync(path.join(resources, 'settings.xml'), path.join(xmlFolder, 'settings.xml'));
      log.info('Deleting settings data from resources folder');
      fs.rmSync(path.join(resources, 'settings.xml'));
    }
  }

  // Check if the item data exists in the resources folder
  if(fs.existsSync(path.join(resources, 'item_data.xml'))){
    log.info('Item data exists in resources folder');

    log.info('Copying item data to user data folder');
    // If it does, copy it to the user data folder then delete it from the resources folder
    fs.copyFileSync(path.join(resources, 'item_data.xml'), path.join(dataFolder, 'item_data.xml'));

    log.info('Deleting item data from resources folder');
    fs.rmSync(path.join(resources, 'item_data.xml'));
  }

  // Check if the lang_fr data exists in the resources folder
  if(fs.existsSync(path.join(resources, 'lang_fr.xml'))){
    log.info('French language data exists in resources folder');
    // If it does, copy it to the user data folder then delete it from the resources folder
    log.info('Copying French language data to user data folder');
    fs.copyFileSync(path.join(resources, 'lang_fr.xml'), path.join(langFolder, 'lang_fr.xml'));
    log.info('Deleting French language data from resources folder');
    fs.rmSync(path.join(resources, 'lang_fr.xml'));
  }

  // Check if the lang_en data exists in the resources folder
  if(fs.existsSync(path.join(resources, 'lang_en.xml'))){
    log.info('English language data exists in resources folder');
    // If it does, copy it to the user data folder then delete it from the resources folder
    log.info('Copying English language data to user data folder');
    fs.copyFileSync(path.join(resources, 'lang_en.xml'), path.join(langFolder, 'lang_en.xml'));
    log.info('Deleting English language data from resources folder');
    fs.rmSync(path.join(resources, 'lang_en.xml'));
  }

  // Check if the carrack data exists in the resources folder
  if(fs.existsSync(path.join(resources, 'carrack_data.xml'))){
    log.info('Carrack data exists in resources folder');
    // If it does, copy it to the user data folder then delete it from the resources folder
    log.info('Copying Carrack data to user data folder');
    fs.copyFileSync(path.join(resources, 'carrack_data.xml'), path.join(dataFolder, 'carrack_data.xml'));
    log.info('Deleting Carrack data from resources folder');
    fs.rmSync(path.join(resources, 'carrack_data.xml'));
  }

  if(fs.existsSync(path.join(resources, 'carrack_data.json'))){
    log.info('Carrack data Template exists in resources folder');
    // It's the first object that need the "template" folder, so we need to check if it's exist, and if not, create it
    log.info('Checking if template folder exists');
    if(!fs.existsSync(templateFolder)){
      log.info('Template folder does not exist')
      log.info('Creating template folder');
      fs.mkdirSync(templateFolder);
    }

    log.info('Copying Carrack data Template to user Template folder');
    // If it does, copy it to the user data folder then delete it from the resources folder
    fs.copyFileSync(path.join(resources, 'carrack_data.json'), path.join(templateFolder, 'carrack_data.json'));
    log.info('Deleting Carrack data Template from resources folder');
    fs.rmSync(path.join(resources, 'carrack_data.json'));
  }

  if(fs.existsSync(path.join(resources, 'settings.json'))){
    log.info('Settings data Template exists in resources folder');
    // If it does, copy it to the user data folder then delete it from the resources folder
    log.info('Copying Settings data Template to user Template folder');
    fs.copyFileSync(path.join(resources, 'settings.json'), path.join(templateFolder, 'settings.json'));
    log.info('Deleting Settings data Template from resources folder');
    fs.rmSync(path.join(resources, 'settings.json'));
  }

  if(fs.existsSync(path.join(resources, 'item_data.json'))){
    log.info('Item data Template exists in resources folder');
    // If it does, copy it to the user data folder then delete it from the resources folder
    log.info('Copying Item data Template to user Template folder');
    fs.copyFileSync(path.join(resources, 'item_data.json'), path.join(templateFolder, 'item_data.json'));
    log.info('Deleting Item data Template from resources folder');
    fs.rmSync(path.join(resources, 'item_data.json'));
  }

  if(fs.existsSync(path.join(resources, 'changelog.json'))){
    log.info('Changelog data exists in resources folder');
    // If it does, copy it to the user data folder then delete it from the resources folder
    log.info('Copying Changelog data to user data folder');
    fs.copyFileSync(path.join(resources, 'changelog.json'), path.join(xmlFolder, 'changelog.json'));
    log.info('Deleting Changelog data from resources folder');
    fs.rmSync(path.join(resources, 'changelog.json'));
  }

  if(fs.existsSync(path.join(resources, 'update.xml'))){
    log.info('Update data exists in resources folder');
    // If it does, copy it to the user data folder then delete it from the resources folder
    log.info('Copying Update data to user data folder');
    fs.copyFileSync(path.join(resources, 'update.xml'), path.join(xmlFolder, 'update.xml'));
    log.info('Deleting Update data from resources folder');
    fs.rmSync(path.join(resources, 'update.xml'));
  }
}

/**
 * Create Application Window
 * @returns {BrowserWindow} Application Window Instance
 */
export function createAppWindow(updateWindow: BrowserWindow): BrowserWindow {

  log.info('Creating Application Window');
  
  eventSystem.getInstance().addEvent('app-maximize');

  // Create new window instance
  appWindow = new BrowserWindow({
    width: 1100,
    height: 900,
    minWidth: 1100,
    minHeight: 900,
    backgroundColor: '#202020',
    show: false,
    autoHideMenuBar: true,
    frame: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      nodeIntegrationInWorker: false,
      nodeIntegrationInSubFrames: false,
      preload: APP_WINDOW_PRELOAD_WEBPACK_ENTRY,
      sandbox: false,
    },
  });

  // Load the index.html of the app window.
  appWindow.loadURL(APP_WINDOW_WEBPACK_ENTRY);

  // Show window when its ready to
  appWindow.on('ready-to-show', () => {
    appWindow.show()

    eventSystem.getInstance().linkToEvent((e)=>{

      log.info('Maximize event received');

      const ev = e as IpcMainEvent;

      if(appWindow.isMaximized()){
        log.info('Window is maximized, unmaximizing');
        appWindow.unmaximize();
        ev.sender.send('app-maximize-reply', false);
      } else {
        log.info('Window is not maximized, maximizing');
        appWindow.maximize();
        ev.sender.send('app-maximize-reply', true);
      }
    }, 'app-maximize', 'appWindow');

    mainEventHelper.getInstance().registerCallback('app-hide', () => {
      log.info('Hiding window');
      appWindow.minimize();
    });

    if(!updateWindow.isDestroyed()) updateWindow.close();
  });

  // Close all windows when main window is closed
  appWindow.on('close', () => {

    log.info('Closing Application Window');

    appWindow = null;
    app.quit();
  });

  process.on('warning', e => log.warn(e.stack));


  return appWindow;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createUpdateWindow(autoUpdater: any): BrowserWindow {

  log.info('Creating Update Window');

  // Create new window instance
  let updateWindow = new BrowserWindow({
    width: 350,
    height: 400,
    minWidth: 350,
    minHeight: 400,
    backgroundColor: '#000',
    show: false,
    autoHideMenuBar: true,
    frame: false,
    resizable: false,
    maximizable: false,
    fullscreenable: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      nodeIntegrationInWorker: false,
      nodeIntegrationInSubFrames: false,
      preload: UPDATE_WINDOW_PRELOAD_WEBPACK_ENTRY,
      sandbox: false,
    },
  });

  // Load the index.html of the app window.
  updateWindow.loadURL(UPDATE_WINDOW_WEBPACK_ENTRY);

  // Show window when its ready to
  updateWindow.on('ready-to-show', () => {
    log.info('Showing Update Window');
    updateWindow.show()

    log.info('Checking for updates in the date template');
    // Check the template with the app version
    templateCheck(app.getVersion());
  
    log.info('Checking for data files');
    // Check if the data files exist
    checkDataFiles();
  
    log.info('Registering IPC');
    // Register Inter Process Communication for main process
    registerMainIPC();

    if(!fs.existsSync(app.getPath('userData')  + '\\local') || !fs.existsSync(app.getPath('userData') + '\\local\\restart-after-update.bat')){

      fs.mkdirSync(app.getPath('userData')  + '\\local');

      const exePath = app.getPath('exe');

      exePath.replace('BDO Sea Companion.exe', '');

      const regex = /(app-[0-9].[0-9].[0-9]-[a-zA-Z]*\\)/gm;

      const truePath = path.join(exePath, '..', `${app.getName()}.exe`).replace(regex, '');

      log.info('Creating restart-after-update.bat');
      fs.writeFileSync(app.getPath('userData')  + '\\local\\restart-after-update.bat', `@echo off \r echo Restarting after update... \r timeout 5 \r start "" "${truePath}" \r exit`);
    }

    if(process.env.NODE_ENV !== 'development'){
      log.info('Checking for updates');
      autoUpdater.checkForUpdates();
    } else {
      log.info('Development mode, skipping update check');
      updateWindow.webContents.send('update-not-available');
    }
  });

  autoUpdater.on('update-downloaded', () => {
    log.info('Update downloaded');
    try{
      updateWindow.webContents.send('update-downloaded');
    } catch(e){
      log.warn('Update window is destroyed');
      log.warn(e);
    }
  });

  autoUpdater.on('update-available', () => {
    log.info('Update available');
    try{
      updateWindow.webContents.send('update-available');
    } catch(e){
      log.warn('Update window is destroyed');
      log.warn(e);
    }
  });

  autoUpdater.on('update-not-available', () => {
    log.info('Update not available');
    try{
      updateWindow.webContents.send('update-not-available');
    } catch(e){
      log.warn('Update window is destroyed');
      log.warn(e);
    }
  });

  autoUpdater.on('error', () => {
    log.warn('Error while checking for updates');

    autoUpdater.clearCache();

    try{
      updateWindow.webContents.send('error');
    } catch(e){
      log.warn('Update window is destroyed');
      log.warn(e);
    }
  });

  // Close all windows when main window is closed
  updateWindow.on('close', () => {
    log.info('Closing Update Window');
    updateWindow = null;
  });

  mainEventHelper.getInstance().registerCallback('update-restart', () => {
    log.info('Restarting application');
    shell.openPath(app.getPath('userData')  + '\\local\\restart-after-update.bat');

    autoUpdater.quitAndInstall();
  });

  autoUpdater.on('quit-and-install', () => {
    log.info('Quitting and installing update');
  });

  process.on('warning', e => log.warn(e.stack));

  return updateWindow;
}

/**
 * Register Inter Process Communication
 */
function registerMainIPC() {
  /**
   * Here you can assign IPC related codes for the application window
   * to Communicate asynchronously from the main process to renderer processes.
   */

  events(appWindow);
}


