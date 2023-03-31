

export default class tempHelper{

    private tempData: {[key: string]: any};

    private static instance: tempHelper;

    
    static getInstance(): tempHelper {
        if (!tempHelper.instance) {
            tempHelper.instance = new tempHelper();
        }
        return tempHelper.instance;
    }

    constructor(){
        this.tempData = [];
    }

    set(key: string, value: any){

        this.tempData[key] = value;

    }

    get(key: string){

        return this.tempData[key];

    }

    delete(key: string){

        delete this.tempData[key];

    }

    clear(){

        this.tempData = [];

    }

    has(key: string){

        if(Object.hasOwn(this.tempData, key)) return true;
        return false; 

    }



}