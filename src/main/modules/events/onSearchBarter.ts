
export default function onSearchBarter(e: Electron.IpcMainEvent, search: string): void {
    e.sender.send('search-barter', search);
}