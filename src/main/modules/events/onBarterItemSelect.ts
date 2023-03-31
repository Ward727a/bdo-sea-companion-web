
export default function onBarterItemSelect(e: Electron.IpcMainEvent, data: {icon: string, tier: number, name: string}): void {
    e.sender.send('barterItemSelect', data);
}