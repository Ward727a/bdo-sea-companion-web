/* eslint-disable @typescript-eslint/no-explicit-any */

import win from "@src/typings/win";

type callback = {
	fun: (...args: any[]) => void;
	once: boolean;
}

type queueCallback = {
  name: string;
  args: any[];
}

type event = {
	name: string,
	callbacks: callback[]
	started: boolean
}

export default class subEventHelper {
  private static instance: subEventHelper;
  
  private window: win;

  private events: event[];

  private queue: queueCallback[];

  constructor(window: win) {
      this.window = window;
      this.events = [];
      this.queue = [];
  }
  
  /**
   * Returns the instance of eventHelper
   * @param app Electron App
   * @returns {subEventHelper} Instance of eventHelper
   * @throws {Error} If app is undefined
   * @example
   * // IN app.ts
   * const _window: win = window
   * eventHelper.getInstance(_window);
   * // => eventHelper { app: App { ... } }
   * @example
   * // IN app.ts
   * eventHelper.getInstance();
   * // => Error: App is undefined
   * @example
   * // Here is an example of how to use this method in the app without the need to pass the app instance.
   * 
   * // IN app.ts
   * const _window: win = window
   * eventHelper.getInstance(_window);
   * // => eventHelper { app: App { ... } }
   * // IN appWindow.ts
   * eventHelper.getInstance();
   * // => eventHelper { app: App { ... } }
   * 
   * // This is because app.ts is the first file to be executed in the main process
   * // then appWindow.ts so the instance is already created.
   */
  static getInstance(window?: win): subEventHelper {
    if (!subEventHelper.instance && window !== undefined) {
        subEventHelper.instance = new subEventHelper(window);
    } else if (!subEventHelper.instance && window === undefined) {
        throw new Error('Window is undefined');
    }
    return subEventHelper.instance;
  }

  public listEvents(): void {
    if(process.env.NODE_ENV === 'development') {
      console.table(this.events);
    }
  }

  private getEvent(name: string): event {
    return this.events.find(event => event.name === name);
  }
  
  private startEvent(name: string) {

    if(this.isStarted(name)) return;

    if(this.getEvent(name) === undefined) {
      this.registerEvent(name);
      return;
    }

    this.getEvent(name).started = true;

    this.window.api.receive(name, (event: any, ...args: any[]) => {
        // Check if the variable event is an event of nodeJS
        if(event !== undefined && event !== null && event.constructor.name !== 'Event') {
          args.unshift(event);
        }
        
        const eventObj = this.getEvent(name);
  
        const callbacks = eventObj.callbacks;

        if(callbacks === undefined) {
          throw new Error('No callback registered for event ' + name);
        }
  
        callbacks.forEach(callback => {
          callback.fun(...args);
          if (callback.once) {
            this.unregisterCallback(name, callback.fun);
          }
        });
    });
    
    // If the queue is not empty, we check the name of the event and if it is the same as the name of the event we are starting, we send the arguments to the event then remove it from the queue
    if(this.queue.length > 0) {


      this.queue.forEach((queueCallback, index) => {
        if(queueCallback.name === name) {

          if(this.hasAnyCallback(name)) {
            this.callEvent(name, ...queueCallback.args);
            this.queue.splice(index, 1);
          }
        }
      });
    }

  }

  private stopEvent(name: string) {
    this.window.api.removeAll(name);
  }

  private isRegistered(name: string): boolean {
    return this.getEvent(name) !== undefined;
  }

  private isStarted(name: string): boolean {

    if(this.getEvent(name) === undefined) return false;
    return this.getEvent(name).started;
  }

  private hasAnyCallback(name: string): boolean {
    return this.getEvent(name).callbacks.length > 0;
  }

  private hasCallback(name: string, fun: (...args: any[]) => void): boolean {
    return this.getEvent(name).callbacks.find(callback => callback.fun.name === fun.name) !== undefined;
  }

  // Public methods

  /**
   * Register an event
   * @param name Name of the event
   * @example
   * // IN app.ts
   * eventHelper.getInstance(_window);
   * eventHelper.registerEvent('test');
   * // => The event 'test' is registered
   * @example
   * // IN appWindow.ts
   * eventHelper.getInstance();
   * eventHelper.registerEvent('test');
   * // => The event 'test' is registered ONLY if the eventHelper.getInstance(_window) is called in app.ts
   */
  public registerEvent(name: string) {
    if (!this.isRegistered(name)) {
      this.events.push({
        name,
        callbacks: [],
        started: false
      });
    }
  }

  /**
   * Unregister an event
   * @param name Name of the event
   * @example
   * // IN app.ts
   * eventHelper.getInstance(_window);
   * eventHelper.registerEvent('test');
   * // => The event 'test' is registered
   * eventHelper.unregisterEvent('test');
   * // => The event 'test' is unregistered
   * @example
   * // IN appWindow.ts
   * eventHelper.getInstance();
   * eventHelper.registerEvent('test');
   * // => The event 'test' is registered ONLY if the eventHelper.getInstance(_window) is called in app.ts
   * eventHelper.unregisterEvent('test');
   * // => The event 'test' is unregistered ONLY if the eventHelper.getInstance(_window) is called in app.ts
   * // => If the eventHelper.getInstance(_window) is not called in app.ts, the event 'test' is not registered
   * // => So the event 'test' is not unregistered
   */
  public unregisterEvent(name: string) {
    if (this.isRegistered(name)) {
      this.events = this.events.filter(event => event.name !== name);

      this.window.api.removeAll(name);

      if (this.isStarted(name)) {
        this.stopEvent(name);
      }
    }
  }

  /**
   * Register a callback
   * @param name Name of the event
   * @param fun Function to register
   * @param once If true, the callback will be unregistered after the first call
   * @example
   * // IN app.ts
   * eventHelper.getInstance(_window);
   * eventHelper.registerEvent('test');
   * // => The event 'test' is registered
   * eventHelper.registerCallback('test', () => console.log('test'));
   * // => The callback is registered
   * eventHelper.unregisterCallbeck('test', () => console.log('test'));
   * // => The callback is unregistered
   * eventHelper.registerCallback('test', () => console.log('test'), true);
   * // => The callback is registered and will be unregistered after the first call
   */
  public registerCallback(name: string, fun: (...args: any[]) => void, _for: string, once = false) {
    if(!this.isRegistered(name)) {
      this.registerEvent(name);
    }

    Object.defineProperties(fun, {name: {value: _for}});

    if (!this.hasCallback(name, fun)) {
      this.getEvent(name).callbacks.push({
        fun,
        once
      });
    }

    if (!this.isStarted(name) && this.hasAnyCallback(name)) {
      this.startEvent(name);
    }
  }

  /**
   * Unregister a callback
   * @param name Name of the event
   * @param fun Function to unregister
   * @example
   * // IN app.ts
   * eventHelper.getInstance(_window);
   * eventHelper.registerEvent('test');
   * // => The event 'test' is registered
   * eventHelper.registerCallback('test', () => console.log('test'));
   * // => The callback is registered
   * eventHelper.unregisterCallback('test', () => console.log('test'));
   * // => The callback is unregistered
   */
  public unregisterCallback(name: string, fun: (...args: any[]) => void) {
    if (this.isRegistered(name)) {
      this.getEvent(name).callbacks = this.getEvent(name).callbacks.filter(callback => callback.fun !== fun);

      if (!this.hasAnyCallback(name)) {
        this.unregisterEvent(name);
      }
    }
  }

  /**
   * Unregister all callbacks
   * @param name Name of the event
   * @example
   * // IN app.ts
   * eventHelper.getInstance(_window);
   * eventHelper.registerEvent('test');
   * // => The event 'test' is registered
   * eventHelper.registerCallback('test', () => console.log('test'));
   * // => The callback is registered
   * eventHelper.registerCallback('test', () => console.log('test2'));
   * // => The callback is registered
   * eventHelper.unregisterAllCallbacks('test');
   * // => All callbacks are unregistered
   * eventHelper.registerCallback('test', () => console.log('test'));
   * // => The callback is registered
   * eventHelper.registerCallback('test', () => console.log('test2'));
   * // => The callback is registered
   */
  public unregisterAllCallbacks(name: string) {
    if (this.isRegistered(name)) {
      this.getEvent(name).callbacks = [];
      this.unregisterEvent(name);
    }
  }

  /**
   * Send an event
   * @param name Name of the event
   * @param args Arguments to send
   * @example
   * // IN app.ts
   * eventHelper.getInstance(_window);
   * eventHelper.registerEvent('test');
   * // => The event 'test' is registered
   * eventHelper.registerCallback('test', (arg1, arg2) => console.log(arg1, arg2));
   * // => The callback is registered
   * eventHelper.send('test', 'test', 'test2');
   * // => The callback is called with 'test' and 'test2' as arguments
   * // => The console will print 'test test2'
   */
  public send(name: string, ...args: any[]) {
    this.window.api.send(name, ...args);
  }

  /** 
   * Call an event that is registered in the eventHelper WITHOUT SENDING IT TO THE MAIN PROCESS
   * @param name Name of the event
   * @param args Arguments to send
   * @example
   * // IN app.ts
   * eventHelper.getInstance(_window);
   * eventHelper.registerEvent('test');
   * // => The event 'test' is registered
   * eventHelper.registerCallback('test', (arg1, arg2) => console.log(arg1, arg2));
   * // => The callback is registered
   * eventHelper.callEvent('test', 'test', 'test2');
   * // => The callback is called with 'test' and 'test2' as arguments
   * // => The console will print 'test test2'
   */
  public callEvent(name: string, ...args: any[]) {

    if(!this.isRegistered(name) || !this.hasAnyCallback(name)) {
      console.warn(`The event '${name}' has no callback, registering one is required to call it...`);
      console.warn(`The event callback requested will be set in the queue and will be called when a callback is registered...`);
      this.queue.push({name, args});
    }

    if(!this.isStarted(name)) {
      this.startEvent(name);
    }

    this.getEvent(name).callbacks.forEach(callback => {
      callback.fun(...args);

      if (callback.once) {
        this.unregisterCallback(name, callback.fun);
      }
    });
  }

  public removeAllEvents() {
    this.events = [];
  }
}