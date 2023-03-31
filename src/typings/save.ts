
import * as xml2js from 'xml2js';

interface saveData {
    items: [
        {
            [key:string]:  [
                {
                    qty: [
                        string
                    ]
                    iliya: [
                        string
                    ]
                    epheria: [
                        string
                    ]
                    ancado: [
                        string
                    ]
                }
            ]
        }
    ],
    misc: [
        {
            lastBarter: [
                string
            ]
        }
    ],
    threshold: [
        {
            [key:string]: [
                string
            ]
        }
    ],
    inventory: [
        {
            [key:string]: [
                string
            ]
        }
    ],
    carrackOrder: [
        {
            items: [
                string
            ]
            boat: [
                string
            ]
        }
    ]
}

export function stringifySaveData(data: saveData):string {
    
    try{
        const builder = new xml2js.Builder({
            rootName: 'data',
            renderOpts: {
                pretty: true,
                indent: '    ',
                newline: '\n'
            }
        });

        const xml = builder.buildObject(data);

        return xml;
    } catch (e) {
        console.error(e);
        return '';
    }

}

export default saveData;