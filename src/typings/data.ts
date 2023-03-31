import langDict from '@src/typings/lang';
import itemDict from '@src/typings/item';
import saveData from '@src/typings/save';
import carrackDict from '@src/typings/carrack';
import { settings } from '@src/typings/settings';
import { changeLog } from '@src/typings/changelog';
import update from '@src/typings/update';

type dataDict = {
    lang: langDict;
    item: itemDict;
    save: saveData;
    carrack: carrackDict;
    settings: settings;
    changelog: changeLog;
    update: update
    setProps: (lang: langDict, item: itemDict, save: saveData, carrack: carrackDict, settings: settings) => void;
}

export default dataDict;