import saveData, { stringifySaveData } from "@src/typings/save";
import { getXmlFileContent, saveXmlFileContent } from "../fileManager";


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function handleSaveThreshold(key: string, value: number) {
    // Log the save item event in development mode
    if (process.env.NODE_ENV == 'development') {
        console.log("Save threshold: " + key);
    }

    // Get the save data
    const data = getXmlFileContent('data/save_data.xml').then((data) => {

        const save:saveData = data['data'];

        // Save the new value in the save data
        save.threshold[0][key][0] = value.toString()

        // Save the new save data by stringifying it
        saveXmlFileContent('data/save_data.xml', stringifySaveData(save));
    });
}