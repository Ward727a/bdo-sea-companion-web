/* eslint-disable @typescript-eslint/no-explicit-any */
import { app, ipcMain, IpcMainEvent, shell } from "electron";

// Import all events
import onPagechange from "./events/onPageChange";
import onSaveDataDict from "./events/onSaveDataDict";
import handleSaveItem from "./events/onSaveItem";
import handleSaveMisc from "./events/onSaveMisc";
import handleSaveThreshold from "./events/onSaveThreshold";
import onSearchBarter from "./events/onSearchBarter";
import onThresholdWarning from "./events/onThresholdWarning";
import onTotalValue from "./events/onTotalValue";
import onBarterItemSelect from "./events/onBarterItemSelect";
import onHideColBarter from "./events/onHideColBarter";

// import file manager
import { findXmlFile, getXmlFileContent, saveXmlFileContent } from "./fileManager";
import onAppQuit from "./events/onAppQuit";
import onSaveLang from "./events/onSaveLang";
import mainEventHelper from '../../common/mainEvent';
import handleSaveCarrackItem from "./events/handleSaveCarrackItem";
import tempHelper from "@common/temp";
import fileHelper from "@common/file";
import { settings } from "@src/typings/settings";
import onSetSetting from "./events/onSetSetting";
import onSaveCarrackOrder from "./events/onSaveCarrackOrder";
import { stringifySaveData } from "@src/typings/save";

import Logger from 'electron-log';
import path from "path";

const APP_DATA = app.getPath('userData');

const eventHelper = mainEventHelper.getInstance();

const log = Logger.create({logId: 'events'});

log.transports.file.level = "debug"
log.transports.file.resolvePathFn = () => path.join(APP_DATA, 'logs/main_events.log');

log.transports.file.archiveLogFn(log.transports.file.getFile());

// Export all events in one function
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function events(_window: Electron.BrowserWindow){

    log.info('Registering events');

    // Register page change event
    ipcMain.on('pageChange', (event, page) => {
        log.info('pageChange => {page: "', page, '"}');
        onPagechange(page, event);
    });

    ipcMain.handle('getSettings', async () => {

        // Get xml setting file
        const setting = findXmlFile('settings');

        log.info('getSettings => {setting: "', setting, '"}');

        return setting;

    });

    ipcMain.handle('getLangFile', async (e: Electron.IpcMainInvokeEvent, lang_: string | null) => {
        
        if (lang_ == null || lang_ == undefined) {
            const settings = findXmlFile('settings')
            lang_ = settings.lang;
        }

        // Get xml lang file
        const lang = findXmlFile('lang/lang_'+lang_);

        log.info('getLangFile => {lang: "', lang_, '", dict: "', lang, '"}');

        return {lang: lang_, dict: lang};

    });

    ipcMain.handle('getDataFile', async (e: Electron.IpcMainInvokeEvent, lang_: string | null) => {
        
        const _settings = findXmlFile('settings') as settings;

        if (lang_ == null || lang_ == undefined) {
            lang_ = _settings.settings.lang[0];
        }

        // Get xml lang file
        const lang = findXmlFile('lang/lang_'+lang_);
        const item = findXmlFile('data/item_data');
        const save = findXmlFile('data/save_data');
        const carrack = findXmlFile('data/carrack_data');
        const update = findXmlFile('update');

        const changelog = JSON.parse(fileHelper.getInstance(app).readFileFromUserdir('changelog.json'));

        log.info('getDateFile => {lang: "', lang_, '", langDict: "', lang, '", itemDict: "', item, '", saveData: "', save, '", carrackDict: "', carrack, '", settings: "', _settings, '", update: "', update, '", changelog: "', changelog, '"}')
        return {lang: lang_, langDict: lang, itemDict: item, saveData: save, carrackDict: carrack, settings: _settings, update: update, changelog: changelog};

    });

    // SAVE DATA EVENT

    ipcMain.on('save-item', async (e: Electron.IpcMainEvent, key: string, value:number, type:"iliya"|"epheria"|"ancado") => {

        log.info('save-item => {key: "', key, '", value: "', value, '", type: "', type, '"}');

        handleSaveItem(key, value, type, e);
    });

    ipcMain.on('save-misc', async (e: Electron.IpcMainEvent, key: "lastBarter", value:string) => {

        log.info('save-misc => {key: "', key, '", value: "', value, '"}');

        handleSaveMisc(key, value, e);
    });

    mainEventHelper.getInstance().registerCallback('carrack-inventory-save-qty', (e, key: string, value: number) => {
        
        log.info('carrack-inventory-save-qty => {key: "', key, '", value: "', value, '"}');

        handleSaveCarrackItem(key, value);
    });

    eventHelper.registerCallback('sAskStatusSelector', (e: IpcMainEvent, type: "iliya"|"epheria"|"ancado") => {

        log.info('sAskStatusSelector => {type: "', type, '"}');

        const settings = findXmlFile('settings') as settings;

        const hideType = type.charAt(0).toUpperCase() + type.slice(1);
        const status = settings.settings[("hide"+hideType as "hideIliya")][0];


        const temp = tempHelper.getInstance();

        temp.set('statusSelector-'+type, status == "true" ? true : false);

        if(temp.has('statusSelector-'+type)) {
            log.info('sAskStatusSelector => {type: "', type, '", status: "', temp.get('statusSelector-'+type), '"}');
            e.sender.send('rAskStatusSelector-'+type, temp.get('statusSelector-'+type));
        } else {
            log.info('sAskStatusSelector => {type: "', type, '", status: "1"}');
            e.sender.send('rAskStatusSelector-'+type, 1);
        }
        
    });

    eventHelper.registerCallback('sStatusSelector', (e: IpcMainEvent, type: 'iliya'|'epheria'|'ancado', status: number) => {
        const temp = tempHelper.getInstance();

        log.info('sStatusSelector => {type: "', type, '", status: "', status, '"}');

        temp.set('statusSelector-'+type, status);

        const hideType = type.charAt(0).toUpperCase() + type.slice(1);

        onSetSetting(e, 'hide'+hideType, status == 1 ? 'true' : 'false');
    })

    eventHelper.registerCallback('sSaveInLog', (e: IpcMainEvent, _log: string) => {

        log.info('sSaveInLog => {log: "', _log, '"}');
        log.warn('sSaveIneLog => This event is deprecated, use the new logger system, check "electron-log" package.')
        
        return;
    })

    eventHelper.registerCallback('sCheckUpdate', (e: IpcMainEvent) => {
        const file = fileHelper.getInstance(app);

        file.checkFileExists('update.xml').then((exists) => {
            if(exists){
                const data = file.readFileFromUserdir('update.xml');

                log.info('sCheckUpdate => {data: "', data, '"}');

                e.sender.send('rCheckUpdate', data);
            }
            else{
                log.info('sCheckUpdate => {data: "null"}');
                e.sender.send('rCheckUpdate', null);
            }
        });
    })

    eventHelper.registerCallback('sResetApp', () => {

        const settings = findXmlFile('settings');
        const update = findXmlFile('update');
        let save = findXmlFile('data/save_data');
        save = save.data;

        update.update.firstLaunch[0] = true;

        saveXmlFileContent('update.xml', JSONToXML(update));

        settings.settings.lang[0] = 'en';
        settings.settings.ignoreAncado[0] = "false";
        settings.settings.ignoreEpheria[0] = "false";
        settings.settings.ignoreIliya[0] = "false";
        settings.settings.boatType[0] = "none";
        settings.settings.hideTier1[0] = "false";
        settings.settings.hideTier2[0] = "false";
        settings.settings.hideTier3[0] = "false";
        settings.settings.hideTier4[0] = "false";
        settings.settings.hideTier5[0] = "false";
        settings.settings.disclaimer[0] = "false";
        settings.settings.chosenLang[0] = "false";
        settings.settings['carrack-need-hide-completed'][0] = "0";

        saveXmlFileContent('settings.xml', JSONToXML(settings));

        console.log(save);

        // Reset save data
        Object.keys(save.items[0]).forEach((key) => {
            save.items[0][key][0]['qty'] = "0";
            save.items[0][key][0]['iliya'] = "0";
            save.items[0][key][0]['epheria'] = "0";
            save.items[0][key][0]['ancado'] = "0";
        });

        save.misc[0].lastBarter[0] = "0";
        save.threshold[0].iliya[0] = "0";
        save.threshold[0].epheria[0] = "0";
        save.threshold[0].ancado[0] = "0";
        Object.keys(save.inventory[0]).forEach((key) => {
            save.inventory[0][key][0] = "0";
        });
        delete save.carrackOrder

        saveXmlFileContent('data/save_data.xml', stringifySaveData(save));

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function JSONToXML(obj: any) {
            let xml = '';
            for (const prop in obj) {
                // eslint-disable-next-line no-prototype-builtins
                if (obj.hasOwnProperty(prop)) {
                    if (isNaN(Number(prop))) {
                        xml += "<" + prop + ">";
                    }
                    if (typeof obj[prop] == "object") {
                        xml += JSONToXML(new Object(obj[prop]));
                    } else {
                        xml += obj[prop];
                    }
                    if (isNaN(Number(prop))) {
                        xml += "</" + prop + ">";
                    }
                }
            }
            return xml;
        }

        log.info('sResetApp => {Reset: "ok"}');
        log.info('sResetApp => Restarting app in 1 second...')
        setTimeout(() => {
            log.info('sResetApp => Restarting app...')
            app.relaunch();
            app.exit();
        }, 1000);
    })
            
    // Open a website in the default browser of the user
    eventHelper.registerCallback('openLink', (e, link: string) => {
        log.info('openLink => {link: "', link, '"}');
        shell.openExternal(link);
    });        

    // FUNCTION EVENT

    eventHelper.registerCallback('set-setting', (e, data: {key: string, value: string}) => {
        log.info('set-setting => {key: "', data.key, '", value: "', data.value, '"}');
        onSetSetting(e, data.key, data.value);
    });

    eventHelper.registerCallback('set-update', (e, state)=>{
        // This is a function to set the "firstlaunch" property to false
        log.info('set-update => {state: "', state, '"}');
        getXmlFileContent('update.xml').then((content) => {

            log.info('set-update => {content: "', content, '", saved: "pending"}');

            content.update.firstLaunch[0] = state;

            saveXmlFileContent('update.xml', JSONToXML(content));

            log.info('set-update => {content: "', content, '", saved: "ok"}');
        });

        function JSONToXML(obj: any) {
            let xml = '';
            for (const prop in obj) {
                // eslint-disable-next-line no-prototype-builtins
                if (obj.hasOwnProperty(prop)) {
                    if (isNaN(Number(prop))) {
                        xml += "<" + prop + ">";
                    }
                    if (typeof obj[prop] == "object") {
                        xml += JSONToXML(new Object(obj[prop]));
                    } else {
                        xml += obj[prop];
                    }
                    if (isNaN(Number(prop))) {
                        xml += "</" + prop + ">";
                    }
                }
            }
            return xml;
        }
    })

    ipcMain.on('hide-col-barter', async (e: Electron.IpcMainEvent, hide: boolean, type:"iliya"|"epheria"|"ancado") => {
        const data = {hide: hide, type: type}

        log.info('hide-col-barter => {hide: "', hide, '", type: "', type, '"}');

        onHideColBarter(e, data);
    });

    ipcMain.on('barterItemSelect', async (e: Electron.IpcMainEvent, icon: string, tier: number, name: string) => {
        const data = {icon: icon, tier: tier, name: name}

        log.info('barterItemSelect => {icon: "', icon, '", tier: "', tier, '", name: "', name, '"}');

        onBarterItemSelect(e, data);
    });

    ipcMain.on('search-barter', async (e: Electron.IpcMainEvent, search: string) => {

        log.info('search-barter => {search: "', search, '"}');
        onSearchBarter(e, search);
    });

    ipcMain.on('total-value', async (e: Electron.IpcMainEvent, value: number) => {

        log.info('total-value => {value: "', value, '"}');
        onTotalValue(e, value);
    });

    ipcMain.on('threshold-change', async (e: Electron.IpcMainEvent, name: string, value: number) => {

        log.info('threshold-change => {name: "', name, '", value: "', value, '"}');

        handleSaveThreshold(name, value);

        e.sender.send('threshold-change', name, value);
    });

    ipcMain.on('threshold-warning', async (e: Electron.IpcMainEvent, name: "iliya"|"epheria"|"ancado", value: number) => {

        const data = {name: name, value: value}

        log.info('threshold-warning => {name: "', name, '", value: "', value, '"}');

        onThresholdWarning(e, data);
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ipcMain.on('save-data-dict', async (e: Electron.IpcMainEvent, dict: any) => {
        log.info('save-data-dict => {dict: "', dict, '"}');
        onSaveDataDict(e, dict);
    });

    ipcMain.on('app-quit', async () => {
        onAppQuit();
    });

    ipcMain.on('set-lang', async (e: Electron.IpcMainEvent, lang: string) => {

        log.info('set-lang => {lang: "', lang, '"}');

        onSaveLang(lang);

        e.sender.send('set-lang', lang);
    });

    ipcMain.on('save-carrack-order', async (e: Electron.IpcMainEvent, order: string[]) => {
        log.info('save-carrack-order => {order: "', order, '"}');

        onSaveCarrackOrder(e, order);
    });

    // DEPRECATED EVENT

    ipcMain.on('check-threshold', async (e: Electron.IpcMainEvent, data: {name: "iliya"|"epheria"|"ancado", value: number}) => {


        log.warn('USING DREPRECATED EVENT: check-threshold');

        e.sender.send('check-threshold', data);
    });

    ipcMain.on('ask-check-threshold', async (e: Electron.IpcMainEvent, data: {name: "iliya"|"epheria"|"ancado", value: number}) => {

        log.warn('USING DREPRECATED EVENT: ask-check-threshold');

        e.sender.send('ask-check-threshold', data);
    });
}