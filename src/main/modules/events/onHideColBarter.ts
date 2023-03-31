
export default function onHideColBarter(e: Electron.IpcMainEvent, data: {hide: boolean, type:"iliya"|"epheria"|"ancado"}): void {
    e.sender.send('r_hide-col-barter', data);
}