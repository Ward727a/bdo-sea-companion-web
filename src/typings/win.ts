/* eslint-disable @typescript-eslint/no-explicit-any */

import langDict from '@src/typings/lang';
import itemDict from '@src/typings/item';
import saveData from '@src/typings/save';

/**
 * The channel object that is sent to the main process
 */
export type channel = {
    "langChange": (event: any, lang: string) => void;
    "getDataFile": (event: any, lang: string) => void;
    "pageChange": (event: any, page: string) => void;
    "save-item": (event: any, key: string, value: number, type: string) => void;
    "save-misc": (event: any, key: string, value: string) => void;
    "hide-col-barter": (event: any, hide: boolean, type: string) => void;
    "r_hide-col-barter": (event: any, hide: boolean, type: string) => void;
    "barterItemSelect": (event: any, icon: string, tier: number, name: string) => void;
    "search-barter": (event: any, search: string) => void;
    "total-value": (event: any, value: number) => void;
    "threshold-change": (event: any, name: string, value: number) => void;
    "threshold-warning": (event: any, name: string) => void;
    "check-threshold": (event: any, name: string) => void;
    "ask-check-threshold": (event: any, name: string) => void;
    "save-data-dict": (event: any, data: string) => void;
    'app-quit': (event: any) => void;
    'app-maximize': (event: any, maximize: boolean) => void;
    'app-maximize-reply': (event: any, maximize: boolean) => void;
    'set-lang': (event: any, lang: string) => void;
}

/**
 * The event object that is sent to the renderer process
 */
export type channelEvent = {
    "langChange": {
        lang: string;
        dict: langDict;
    },
    "getDataFile": {
        lang: string;
        langDict:{
            root: langDict;
        }
        itemDict:{
            items: itemDict;
        },
        saveData:{
            data: saveData;
        },
    },
    "pageChange": string;
    "save-item": {
        key: string;
        value: number;
        type: string;
    },
    "save-misc": {
        key: string;
        value: string;
    }
    "hide-col-barter": {
        hide: boolean;
        type: string;
    },
    "r_hide-col-barter": {
        hide: boolean;
        type: string;
    },
    "barterItemSelect": {
        icon: string;
        tier: number;
        name: string;
    }
    "search-barter": {
        search: string;
    },
    "total-value": {
        value: number;
    },
    "threshold-change": {
        name: string,
        value: number,
    },
    "threshold-warning":{
        name: string,
    },
    "check-threshold": {
        name: string,
    },
    'ask-check-threshold': {
        name: string,
    },
    'save-data-dict': {
        data: string;
    }
    'app-quit': void;
    'app-maximize': {
        maximize: boolean;
    },
    'app-maximize-reply': {
        maximize: boolean;
    },
    'set-lang': {
        lang: string;
    },
}

/**
 * The window object with the `api` property added
 */
type win_ = Window & {
    /**
     * The `api` property added to the window object to communicate with
     * the main process using the `ipcRenderer` and `ipcMain` modules of Electron
     * @property {Object} api the api object
     * @property {Function} api.send send data to main process
     * @property {Function} api.receive receive data from main process
     * @property {Function} api.receiveOnce receive data from main process once
     * @property {Function} api.invoke invoke a function in the main process and return the result to the renderer process
     * @property {Function} api.remove remove a listener from a channel
     * @property {Function} api.removeAll remove all listeners from a channel
     * @example
     * // Send data to main process
     * window.api.send('channel', data);
     * // Receive data from main process
     * window.api.receive('channel', (event, ...args) => {
     *  // do something
     * });
     * // Receive data from main process once
     * window.api.receiveOnce('channel', (event, ...args) => {
     * // do something
     * });
     * // Invoke a function in the main process and return the result to the renderer process
     * window.api.invoke('channel', data).then(result => {
     * // do something
     * });
     * // Remove a listener from a channel
     * window.api.remove('channel', listener);
     * // Remove all listeners from a channel
     * window.api.removeAll('channel');
     * 
     * @see https://www.electronjs.org/docs/api/ipc-renderer
     * @see https://www.electronjs.org/docs/api/ipc-main
     * @see https://www.electronjs.org/docs/api/context-bridge
     * 
     */
    api?: {
        /**
         * Send data to main process
         * @param channel the channel to send data to
         * @param data the data to send
         * @returns void
         * @see https://www.electronjs.org/docs/api/ipc-renderer#ipcrenderersendchannel-args
         */
        send<K extends keyof channel>(channel: K|string, data?: channelEvent[K]|any): void;

        /**
         * Send data to main process and wait for a response
         * @param channel the channel to send data to
         * @param data the data to send
         * @returns void
         * @see https://www.electronjs.org/docs/api/ipc-renderer#ipcrenderersendsyncchannel-args
         */
        sendSync: (channel: string, data?: any) => void;
        /**
         * Receive data from main process
         * @param channel the channel to receive data from
         * @param func the function to execute when data is received
         * @returns void
         * @see https://www.electronjs.org/docs/api/ipc-renderer#ipcrendereronchannel-listener
         */
        receive<K extends keyof channel>(channel: K|string, func: (event: any, args: channelEvent[K]|any) => void): void;
        /**
         * Receive data from main process once
         * @param channel the channel to receive data from
         * @param func the function to execute when data is received
         * @returns void
         * @see https://www.electronjs.org/docs/api/ipc-renderer#ipcrendereroncesyncchannel-listener
         */

        receiveOnce<K extends keyof channel>(channel: K|string, func: (event: any, args: channelEvent[K]|any) => void): void;
        /**
         * Invoke a function in the main process and return the result to the renderer process
         * @param channel the channel to invoke the function in the main process
         * @param data the data to send to the main process
         * @returns `Promise<any>` the result of the function in the main process
         * @see https://www.electronjs.org/docs/api/ipc-renderer#ipcrendererinvokechannel-args
         */
        invoke<K extends keyof channel>(channel: K|string, data?: any): Promise<channelEvent[K]|any>;
        /**
         * Remove a listener from a channel
         * @param channel the channel to remove the listener from
         * @param func the function to remove
         * @returns void
         * @see https://www.electronjs.org/docs/api/ipc-renderer#ipcrendererremovechannel-listener
         */
        remove: (channel: string, func: (event: any, ...args: any[]) => void) => void;
        /**
         * Remove all listeners from a channel
         * @param channel the channel to remove all listeners from
         * @returns void
         * @see https://www.electronjs.org/docs/api/ipc-renderer#ipcrendererremovealllistenerschannel
         */
        removeAll: (channel: string) => void;

        eventsRegistered: any;
    }
}
export default win_;