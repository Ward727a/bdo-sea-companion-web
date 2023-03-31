
export default function onTotalValue(e: Electron.IpcMainEvent, value: number): void {
    e.sender.send('total-value', value);
}