import { app } from "electron";

export default function onAppQuit(): void {
    
    app.quit();

}