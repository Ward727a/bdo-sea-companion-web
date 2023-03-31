
export default function onThresholdWarning(e: Electron.IpcMainEvent, data: {name: "iliya"|"epheria"|"ancado", value: number}): void {
    e.sender.send('threshold-warning', data);
}