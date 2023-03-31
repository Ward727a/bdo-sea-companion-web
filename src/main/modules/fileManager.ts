/* eslint-disable @typescript-eslint/no-explicit-any */
// Here will be the code for the xml file manager

import { app } from 'electron';

import path from "path";
import fs from "fs";
import { assert } from "console";

import * as xml2js from 'xml2js';

import Logger from 'electron-log';

let userDataPath = ''

if(process.env.NODE_ENV === 'development'){
    userDataPath = path.join(__dirname,'..', '..','assets');
} else {
    userDataPath = app.getPath('userData');
}
const xmlPath = path.join(userDataPath, 'xml');
// Path: src\main\modules\fileManager.ts


function isValidXML(xml: string) {
    try {
        const parser = new xml2js.Parser();
        parser.parseString(xml, (err) => {
            if (err) {
                throw new Error('xml2js failed to convert xml to json');
            }
        });
        return true;
    } catch (error) {
        return false;
    }
}
/**
 * Get all xml files
 * @returns the list of xml files
 * @throws Error if xml folder does not exist
 */
function getXmlFiles() {


    console.trace('xmlPath: ' + xmlPath);
    // Check if xml folder exists
    if (!fs.existsSync(xmlPath)) {
        throw new Error('xml folder does not exist');
    }

    // Get all xml files
    const files = fs.readdirSync(xmlPath);

    if(files === undefined){
        Logger.error('[fileManager] files is undefined');
        return [];
    }

    const xmlFiles = files.filter(file => file.endsWith('.xml'));
    return xmlFiles;
}


/**
 * Find xml file
 * @param fileName the name of the file
 * @returns the content of the file as json
 * @throws Error if file does not exist
 * @throws Error if fileContent is not a valid xml string
 * @throws Error if xml2js fails to convert xml to json
 */
function findXmlFile(fileName: string):any {

    // Check if file ends with .xml
    if (!fileName.endsWith('.xml')) {
        fileName += '.xml';
    }

    console.trace('fileName: ' + fileName);
    console.trace('xmlPath: ' + xmlPath);
    console.trace('path.join(xmlPath, fileName): ' + path.join(xmlPath, fileName));

    // Check if file exists
    if (!fs.existsSync(path.join(xmlPath, fileName))) {
        throw new Error('file ' + fileName + ' does not exist at ' + xmlPath + '/' + fileName);
    }

    // Read file
    const filePath = path.join(xmlPath, fileName);
    const fileContent = fs.readFileSync(filePath, 'utf8');

    // Check if fileContent is a valid xml string
    if (!isValidXML(fileContent)) {
        throw new Error('fileContent is not a valid xml string');
    }

    // Convert xml to json
    let jsonContent: unknown;
    xml2js.parseString(fileContent, (err, result) => {
        if (err) {
            throw err;
        }
        jsonContent = result;
    });

    return jsonContent;
}

/**
 * Get xml file content
 * @param fileName the name of the file
 * @returns the content of the file
 */
async function getXmlFileContent(fileName: string):Promise<any> {

    // Check if file ends with .xml
    if (!fileName.endsWith('.xml')) {
        fileName += '.xml';
    }

    // Check if file exists
    if (!fs.existsSync(path.join(xmlPath, fileName))) {
        throw new Error('file does not exist');
    }

    // Read file
    const filePath = path.join(xmlPath, fileName);
    return await new Promise<unknown>((resolve) => {
            fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                throw new Error(err.message);
            }

            const fileContent = data.replaceAll('\\r', '').replaceAll('\\n', '').replaceAll('\\t', '');

            // Check if fileContent is a valid xml string
            if (!isValidXML(fileContent)) {
                throw new Error('fileContent is not a valid xml string');
            }
        
            // Convert xml to json
            let jsonContent: unknown;
            xml2js.parseString(fileContent, (err, result) => {
                if (err) {
                    throw new Error(err.message);
                }
                jsonContent = result;
            });
        
            resolve(jsonContent);
        });
    });
}

/**
 * Get xml file content
 * @param fileName the name of the file
 * @returns the content of the file
 */
function XmlFileExist(fileName: string):boolean {

    // Check if file ends with .xml
    if (!fileName.endsWith('.xml')) {
        fileName += '.xml';
    }

    // Check if file exists
    if (!fs.existsSync(path.join(xmlPath, fileName))) {
        return false
    }

    return true
}


/**
 * Save xml file content
 * @param fileName the name of the file
 * @param fileContent the content of the file
 * @returns the content of the file
 * @throws Error if fileContent is not a valid xml string
 * @throws Error if fileContent is not a valid json object
 * 
 */
function saveXmlFileContent(fileName: string, fileContent: string) {

    // Check if fileContent is a string 
    assert(typeof fileContent === 'string', 'fileContent must be a string');

    // Check if file ends with .xml
    if (!fileName.endsWith('.xml')) {
        fileName += '.xml';
    }
    
    // Check if fileContent is a valid xml string
    if (!isValidXML(fileContent)) {
        throw new Error('fileContent is not a valid xml string');
    }

    const filePath = path.join(xmlPath, fileName);
    fs.writeFile(filePath, fileContent, (err) => {
        if (err) {
            throw new Error(err.message);
        }
    });
}

/**
 * Delete xml file
 * @param fileName the name of the file
 * @throws Error if file does not exist  
 */
function deleteXmlFile(fileName: string) {

    // Check if file ends with .xml
    if (!fileName.endsWith('.xml')) {
        fileName += '.xml';
    }

    // Check if file exists
    const files = getXmlFiles();
    if (!files.includes(fileName)) {
        throw new Error('file does not exist');
    }

    // Delete file
    const filePath = path.join(xmlPath, fileName);
    fs.unlinkSync(filePath);
}


/**
 * Get xml file names
 * @returns an array of file names
 */
function getXmlFileNames() {

    // Get file names
    const files = getXmlFiles();
    const fileNames = files.map(file => file.replace('.xml', ''));
    return fileNames;
}

/**
 * Get xml file names with content
 * @returns an array of file names with content
 * @throws Error if fileContent is not a valid xml string
 */
function getXmlFileNamesWithContent() {

    // Get file names with content
    const files = getXmlFiles();
    const fileNames = files.map(file => {
        const fileName = file.replace('.xml', '');
        const filePath = path.join(xmlPath, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');

        // Check if fileContent is a valid xml string
        if (!isValidXML(fileContent)) {
            throw new Error('fileContent is not a valid xml string');
        }

        // convert fileContent to json
        const jsonContent = xmlToJson(fileContent);

        return { fileName, fileContent: jsonContent };
    });
    return fileNames;
}

/**
 * Convert xml to json
 * @param xmlDoc the xml document
 * @returns the json object
 * @throws Error if there is an error
 */
function xmlToJson(xmlDoc: string): JSON{
    let jsonContent;
    xml2js.parseString(xmlDoc, function (err: Error, result: JSON) {

        // Check if there is an error
        if (err) {
            throw new Error(err.message);
        }

        jsonContent = result;
    });
    return jsonContent;
}


export {
    findXmlFile,
    getXmlFiles,
    getXmlFileContent,
    saveXmlFileContent,
    deleteXmlFile,
    getXmlFileNames,
    getXmlFileNamesWithContent,
    XmlFileExist as xmlFileExist
}