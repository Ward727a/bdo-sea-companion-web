import { IpcMainEvent } from 'electron';
import { findXmlFile, getXmlFileContent, saveXmlFileContent } from '../fileManager';

export default function onSetSetting(e: IpcMainEvent, key: string, value: string){

    // Get xml setting file
    getXmlFileContent('settings').then((data) => {


        if(!data  || data == null || !data['settings']) {
            console.log(" Error: data['settings'] is undefined");
            console.log(data);
            return;
        }

        const settings = data;

        console.log(key);

        settings['settings'][key] = [value];

        console.trace(JSONToXML(settings))

        // Save the new save data by stringifying it
        saveXmlFileContent('settings', JSONToXML(settings));

        e.sender.send('set-setting', key, value);

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