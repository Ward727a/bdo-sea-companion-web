import { IpcMainEvent } from "electron";

/**
 * Handle page change event from renderer process
 * @param page Name of the page
 * @param event The event object
 */
export default function onPagechange(page: string, event: IpcMainEvent){

    // Log the page change in development mode
    if (process.env.NODE_ENV == 'development') {
        console.log("Current page: " + page);
    }

    // Send the page change to the renderer process
    event.sender.send('pageChange', page);
}