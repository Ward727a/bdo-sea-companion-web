import saveData, { stringifySaveData } from "@src/typings/save";
import { getXmlFileContent, saveXmlFileContent } from "../fileManager";


export default function handleSaveCarrackItem(key: string, value: number) {
    getXmlFileContent('data/save_data').then((data) => {
        const carrackData = data['data'] as saveData;
        
        if(carrackData.inventory[0][key] == undefined) carrackData.inventory[0][key] = ["0"];

        (carrackData as saveData).inventory[0][key][0] = value.toString();
        saveXmlFileContent('data/save_data', stringifySaveData(carrackData));
    });

}