import fs from 'fs';
/* eslint-disable @typescript-eslint/no-explicit-any */
// Say something
console.log('[ERWT] : Preload execution started');

// Import electron ipc, contextbridge module
const {
    contextBridge,
    ipcRenderer
} = require("electron");

// Define valid channels to send ipc event
const validChannelsSend: string[] = ['sUpdater', 'update-restart'];

// Define valid channels to receive ipc event
const validChannelsReceive: string[] = ['update-downloaded', 'update-not-available', 'error', 'update-available'];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type srcFrom = {
    from: string,
    event: string,
    func: any
}

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
    "api", {
        send: (channel: string, ...data: any[]) => {

            console.log("Sending to main process: " + channel + " " + data)

        // Only allow valid channels
        if (validChannelsSend.includes(channel)) {
            ipcRenderer.send(channel, ...data);
        } else {
            throw new Error('Invalid channel ' + channel);
        }
        },
        sendSync: (channel: string, data: any) => {
        // Only allow valid channels
        if (validChannelsSend.includes(channel)) {
            return ipcRenderer.sendSync(channel, data);
        } else {
            throw new Error('Invalid channel ' + channel);
        }
        },
        receive: (channel: string, func: any) => {
        // Only allow valid channels
        if (validChannelsReceive.includes(channel)) {
            // Add new listener
            ipcRenderer.on(channel, (event, ...args) => func(...args));
        } else {
            throw new Error('Invalid channel ' + channel);
        }
        },
        receiveOnce: (channel: string, func: any) => {
        // Only allow valid channels
        if (validChannelsReceive.includes(channel)) {
            // Add new listener
            ipcRenderer.once(channel, (event, ...args) => func(...args));
        } else {
            throw new Error('Invalid channel ' + channel);
        }
        },
        invoke: (channel: string, data: any) => {
        // Only allow valid channels
        if (validChannelsSend.includes(channel)) {
            return ipcRenderer.invoke(channel, data);
        } else {
            throw new Error('Invalid channel ' + channel);
        }
        },
        remove: (channel: string, func: any) => {
        // Only allow valid channels
        if (validChannelsReceive.includes(channel)) {
            ipcRenderer.removeListener(channel, func);
        } else {
            throw new Error('Invalid channel ' + channel);
        }
        },
        removeAll: (channel: string) => {
        // Only allow valid channels
        if (validChannelsReceive.includes(channel)) {
            ipcRenderer.removeAllListeners(channel);
        } else {
            throw new Error('Invalid channel ' + channel);
        }
        },
        eventsRegistered: fs.readdirSync(__dirname),
    }
)



// Get versions
window.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');
    const { env } = process;
    const versions: Record<string, unknown> = {};

    // ERWT Package version
    versions['erwt'] = env['npm_package_version'];
    versions['license'] = env['npm_package_license'];

    // Process versions
    for (const type of ['chrome', 'node', 'electron']) {
        versions[type] = process.versions[type].replace('+', '');
    }

    // NPM deps versions
    for (const type of ['react']) {
        const v = env['npm_package_dependencies_' + type];
        if (v) versions[type] = v.replace('^', '');
    }

    // NPM @dev deps versions
    for (const type of ['webpack', 'typescript']) {
        const v = env['npm_package_devDependencies_' + type];
        if (v) versions[type] = v.replace('^', '');
    }

    // Set versions to app data
    app.setAttribute('data-versions', JSON.stringify(versions));



});
