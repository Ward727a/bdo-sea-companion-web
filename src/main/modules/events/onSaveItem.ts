import saveData, { stringifySaveData } from "@src/typings/save";
import { getXmlFileContent, saveXmlFileContent } from "../fileManager";
import IpcMainEvent = Electron.IpcMainEvent;


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function handleSaveItem(key: string, value: number, type: "iliya"|"epheria"|"ancado", _event: IpcMainEvent) {
    // Log the save item event in development mode
    if (process.env.NODE_ENV == 'development') {
        // console.log("Save item: " + key);
    }

    // Get the save data
    getXmlFileContent('data/save_data.xml').then((data) => {
    
        if(!data  || data == null || !data['data']) {
            console.log(" Error: data['data'] is undefined");
            console.log(data);
            return;
        }
    
        const save:saveData = data['data'];
        
        if(!save.items[0][key]) {
            save.items[0][key] = [{qty: ["0"], iliya: ["0"], epheria: ["0"], ancado: ["0"]}];
        }
    
        // Save the new value in the save data
        save.items[0][key][0][type][0] = value.toString();
    
    
        // Save the new save data by stringifying it
        saveXmlFileContent('data/save_data.xml', stringifySaveData(save));
    });
}