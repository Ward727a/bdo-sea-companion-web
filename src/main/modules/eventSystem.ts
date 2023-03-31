import win_, { channel } from "@src/typings/win";
import { ipcMain } from "electron";

type event = {

    name: keyof channel;
    fun: [(...data: any) => void];

}

export class eventSystem{

    private static instance: eventSystem;

    private events: event[];

    public test(){
        // If in developpement, send a list of the events, else do nothing
        if(process.env.NODE_ENV === 'development'){
            console.table(this.events);
        }
    }

    private constructor( events?: event[]) {
        // Singleton pattern to prevent multiple instances of the class

        this.events = events || [];
    }

    public static getInstance(): eventSystem {
        if (!eventSystem.instance) {
            eventSystem.instance = new eventSystem();
        }

        return eventSystem.instance;
    }

    private registerEvent(event: event) {

        event.fun.forEach(fun => {
            if(fun === null) return;
            ipcMain.on(event.name, fun);
            if(process.env.NODE_ENV === 'development'){
                console.log(`[Barter] Event ${event.name} registered!`)
            }
        });


    }

    private unregisterEvent(event: event) {

        ipcMain.removeAllListeners(event.name);
        if(process.env.NODE_ENV === 'development'){
            console.log(`[Barter] Event ${event.name} unregistered!`)
        }

    }

    public addEvent(name: keyof channel, fun?: (...data: any) => void) {

        const event = this.events.find(event => event.name === name);

        if(event){
            if(fun){
                event.fun.push(fun);
            }
        } else {
            this.events.push({name: name, fun: [fun? fun : ()=>{console.log(`Event ${name} fired!`) } ]});
        }

    }


    public linkToEvent(fun: (...data: any) => void, name: keyof channel, uniqueName: string, replace?: boolean) {

        Object.defineProperty(fun, 'name', {value: uniqueName})

        const event = this.events.find(event => (event.name === name));

        let alreadyLinked = false;
        let alreadyLinkedIndex = -1;

        if(event === undefined) {
            if(process.env.NODE_ENV === 'development'){
                console.log(`[Barter] Event ${name} not found!`);
            }
            return;
        }

        event.fun.forEach((element, index) => {
            if(element !== null && element.name === uniqueName){
                alreadyLinked = true
                alreadyLinkedIndex = index;
            }
        });

        if(!alreadyLinked) {

            this.unregisterEvent(event);

            event.fun.push(fun);

            this.registerEvent(event);

        } else {
            if(replace){
                
                this.unregisterEvent(event);

                event.fun[alreadyLinkedIndex] = fun;

                this.registerEvent(event);

                return;


            }
            
            if(process.env.NODE_ENV === 'development'){
                console.log(`[Barter] Event ${name} is already linked to this function!`);
            }

        }

        // console.table(event.fun);

    }

    public startListen() {

        this.events.forEach(event => {

            this.registerEvent(event);

        });

    }

    public stopListen() {

        this.events.forEach(event => {
            this.unregisterEvent(event);
        });

    }

    //...

}