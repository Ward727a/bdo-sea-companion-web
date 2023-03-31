
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function onSaveDataDict(e: Electron.IpcMainEvent, data: {dict: any}): void {
    e.sender.send('save-data-dict', data);
}