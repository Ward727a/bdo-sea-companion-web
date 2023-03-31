/* eslint-disable @typescript-eslint/ban-types */
/**
 * @file templateChecker.ts
 * @description This module is used to check the template version of the data files. (Not the SAVE file!!!)
 * @version 0.0.3
 * @since 0.0.3
 * 
 * @author Ward
 * 
 * @license MIT
 * 
 * @requires fs
 */

import { app } from 'electron';
import Logger from 'electron-log';
import * as fs from 'fs';
import path from 'path';
import semver from 'semver';
import { getXmlFileContent, saveXmlFileContent, xmlFileExist } from './fileManager';

function getTemplatePath(): string{
    let userDataPath: string;
    if(process.env.NODE_ENV === 'development'){
        userDataPath = path.join(__dirname,'..', '..','assets');
    } else {
        userDataPath = app.getPath('userData');
    }
    return path.join(userDataPath, 'templates');
}

// Description: This module is used to check the template version of the current project.
export function templateCheck(version: string, error?: boolean){

    // Get each files in the templates folder
    // If the soft is in development mode, the templates folder is in the assets folder
    // If the soft is in production mode, the templates folder is in the user data folder
    const templatePath = getTemplatePath();

    // Get all the files in the templates folder in an async way

    console.log("Template path: ", templatePath)

    fs.readdir(templatePath, (err, _files) => {

        console.trace("Files: ", _files);

        if(_files === undefined){
            if(error){
                Logger.error('[templateChecker] files is undefined. It\'s the second time, the check is stopped.');
                return [];
            }
            setTimeout(() => {
                Logger.error('[templateChecker] files is undefined. Trying again in 1 second.');
                templateCheck(version, true);
            }, 1000);
            return [];
        }

        const files: string[] = _files.filter(file => file.endsWith('.json'));

        const promises: Promise<void>[] = [];

        // Navigate through each file
        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            const readPromise = new Promise<void>((resolve) => {
                readTemplate(version, file, resolve);
            });

            promises.push(readPromise);
        }

        Promise.all(promises).then(() => {
            console.log('All templates are up to date');
        });
    });

}

/**
 * This function is used to read a template file and convert it to a JSON object in an async way and check if the template is compatible with the current version of the software
 * @param version La version du projet
 * @param file Le nom du fichier template
 */
function readTemplate(version: string, file: string, callback?: Function){

    // Link the path to the template file
    const templatePath = getTemplatePath();
    const templateFile = path.join(templatePath, file);

    // Read the file in an async way and convert the content to a JSON object
    fs.readFile(templateFile, 'utf8', (err, data) => {
        if (err) throw err;
        const template = JSON.parse(data);
        const name = file.split('.')[0];

        checkTemplate(version, template, name, callback)

    });

}

/**
 * This function is used to check if the template is compatible with the current version of the software and if not, send an error
 * @param version La version du projet
 * @param content Le contenu du fichier template
 * @param name Le nom du fichier template
 */
function checkTemplate(version: string, content: any, name: string, callback?: Function){
    // Get each version referenced in the template
    const versions = Object.keys(content.versions);

    // Navigate through each version, and check if the current version is compatible with the template
    for (let i = 0; i < versions.length; i++) {
        const templateVersion = versions[i];
        const usedVersion = Object.keys(content.versions[templateVersion])[0]
        const xmlFile = content.for;
        if(semver.gte(version, usedVersion)){
            // If the version is compatible, check if the template is up to date
            checkTemplateVersion(version, content.versions[templateVersion], xmlFile, callback);
        } else {
            // If the version is not compatible, send an error
            app.quit();
            throw new Error('The current version of the template ['+ name +'] is not compatible with the current version of the software. Please update the software or the template. If the problem persists, please contact us on GitHub.');
        }
    }
}

/**
 * This function is used to check if the data file is compatible with the current version of the software and if not, create the missing data with the default values indicated in the template
 * @param version La version du projet
 * @param content Le contenu du fichier template
 * @param xmlFile Le nom du fichier xml à vérifier
 */
function checkTemplateVersion(version: string, content: any, xmlFile: string, callback?: Function){

    // Get each keys referenced in the template
    const keys = Object.keys(content);

    // Navigate through each key, and check if the data file is compatible with the template and if the object has the correct properties and children
    for (let i = 0; i < keys.length; i++) {


        if(!xmlFileExist(xmlFile)){
            saveXmlFileContent(xmlFile, "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");

            checkTemplateVersion(version, content, xmlFile, callback);

            return;
        }

        // Get the data file
        getXmlFileContent(xmlFile).then((data) => {

            // Get the current key (version)
            const key = keys[i];

            // Get the current template
            const template = content[key];

            // Check if the data file has the correct properties
            checkProperties(version, key, data, template, xmlFile, undefined, callback);

        });

    }

}

/**
 * This function is used to check if the data file has the correct properties and if the properties are up to date
 * @param version The version of the software
 * @param key The key of the object to check
 * @param data The content of the data file to check
 * @param template The content of the template used to check the data file
 */
function checkProperties(version: string, key: string, data: any, template: any, xmlFile: string, rootTag?: string, callback?: Function){
    
    // Get each properties referenced in the template
    const properties = Object.keys(template);

    let setInFile = false;

    // If the template is empty, return
    if(properties.length === 0){
        return;
    }

    // Register the root tag
    if(rootTag === undefined){
        setInFile = true;
    }

    // Check if the data file is an array
    if(Array.isArray(properties)){
        // Navigate through each property, and check if the data file is compatible with the template and if the object has the correct properties and children
        for (let i = 0; i < properties.length; i++) {

            // Check if the property is a number and if it is, continue to the next property
            if(!isNaN(Number(properties[i]))){
                continue;
            }

            // Check if we already set the root tag and if not, set it
            if(rootTag === undefined){
                rootTag = properties[i];
            }

            // Check if it's an definition property
            if(properties[i].includes("_")){
                continue;
            }

            // Check if the property is an "everything" type (any string is fine, just check if it's have all the necessary properties)
            if(properties[i] == "%any%"){
                // Check if the data property is an object and if the data property has the correct properties
                if(Object.keys(properties[i]).length !== 0 && Object.keys(data).length !== 0){
                    // Set the stop variable to false to stop the loop if the data property has the correct properties
                    let stop = false;
                    Object.keys(data).forEach((key) => {
                        // Check if the stop variable is true and if it is, stop the loop
                        if(stop){ return; }

                        // Check if the data property is a valid type (not undefined, or empty in the xml file)
                        if(data[key] !== undefined && (typeof data[key] === 'string' && data[key].trim() === "")){

                            data = []
                            data[template[properties[i]]['_default']] = [];
                            data[template[properties[i]]['_default']][0] = [];
                            data[template[properties[i]]['_default']][0] = checkProperties(version, key, data[template[properties[i]]['_default']][0], template[properties[i]], xmlFile, rootTag, callback);
                            stop = true;
                            return;
                        }

                        // Check if the data property has the correct properties
                        data[key][0] = checkProperties(version, key, data[key][0], template[properties[i]], xmlFile, rootTag, callback);
                    });
                }
            } else {
                // Check if the data file has the correct properties
                if(data !== null && Object.keys(data) !== null && Object.keys(data).includes(properties[i])){
                    // Check if the data property is an object and if the data property has the correct properties
                    if(Object.keys(properties[i]).length !== 0){
                        // Check if the data property is a valid type (not undefined, or empty in the xml file)
                        if(Array.isArray(data[properties[i]])){
                            data[properties[i]][0] = checkProperties(version, key, data[properties[i]][0], template[properties[i]], xmlFile, rootTag, callback);
                        } else {
                            data[properties[i]] = checkProperties(version, key, data[properties[i]], template[properties[i]], xmlFile, rootTag, callback);
                        }
                    }
                } else {

                    // If the property is not found, try to create it with the default value
                    if(data == undefined){
                        data = {};
                    }
                    if(data == null || data[properties[i]] === undefined){
                        data[properties[i]] = [];
                    }

                    data[properties[i]][0] = template[properties[i]];
                }
            }
        }
    }

    if(setInFile){
        saveEditedFile(data, xmlFile, callback);
    } else {
        return data;
    }
}

function saveEditedFile(data: string, file: string, callback?: Function){

    console.log("Données à sauvegarder: ", data)

    console.log("Vérification effectuer du fichier: ", file);

    saveXmlFileContent(file, JSONToXML(data));

    callback();

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