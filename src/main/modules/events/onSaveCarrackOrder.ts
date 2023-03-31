import { IpcMainEvent } from 'electron';
import { findXmlFile, getXmlFileContent, saveXmlFileContent } from '../fileManager';

export default function onSaveCarrackOrder(e: IpcMainEvent, order: any){

    // Get xml setting file
    getXmlFileContent('data/save_data').then((data) => {


        if(!data  || data == null || !data['data']) {
            console.log(" Error: data['data'] is undefined");
            console.log(data);
            return;
        }

        const saveData = data;

        const carrackOrder = order['items'];

        // Set the new carrack order
        saveData['data']['carrackOrder'] = order;
        saveData['data']['carrackOrder']['items'] = carrackOrder.toString();

        console.trace(JSONToXML(saveData))

        // Save the new save data by stringifying it
        saveXmlFileContent('data/save_data', JSONToXML(saveData));
    });

}



function JSONToXML(obj: any) {
    let xml = '';
    for (const prop in obj) {
        // eslint-disable-next-line no-prototype-builtins
        if (obj.hasOwnProperty(prop)) {
            if (isNaN(Number(prop))) {
                xml += "<" + prop + ">";
            }
            if (typeof obj[prop] == "object") {
                xml += JSONToXML(new Object(obj[prop]));
            } else {
                xml += obj[prop];
            }
            if (isNaN(Number(prop))) {
                xml += "</" + prop + ">";
            }
        }
    }
    return xml;
}