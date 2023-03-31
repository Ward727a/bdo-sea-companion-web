/* eslint-disable @typescript-eslint/no-explicit-any */
import { ipcMain } from 'electron';

type callback = {
	fun: (...args: any[]) => void;
	once: boolean;
}

type event = {
	name: string,
	callbacks: callback[]
	started: boolean
}

export default class mainEventHelper {
	private static instance: mainEventHelper;

	private events: event[];

	constructor() {
		this.events = [];
	}

	/**
	 * Returns the instance of eventHelper
	 * @returns {mainEventHelper} Instance of eventHelper
	 * @example
	 * // IN app.ts
	 * eventHelper.getInstance();
	 * // => eventHelper { app: App { ... } }
	 */
	static getInstance(): mainEventHelper {
		if (!mainEventHelper.instance) {
			mainEventHelper.instance = new mainEventHelper();
		}
		return mainEventHelper.instance;
	}

	private getEvent(name: string) {
		return this.events.find((event) => event.name === name);
	}

	private startEvent(name: string) {

		if (this.isStarted(name)) {
			return;
		}

		// Set the event as started
		this.events.find((event) => event.name === name).started = true;

		ipcMain.on(name, (event, ...args) => {

			// Get the event
			const eventObj = this.getEvent(name);

			// Get the callbacks
			const callbacks = eventObj.callbacks;

			// Execute all callbacks
			callbacks.forEach((callback) => {
				callback.fun(event, ...args);
				if (callback.once) {
					this.unregisterCallback(name, callback.fun);
				}
			});
		});
	}

	private isRegistered(name: string) {
		return this.events.find((event) => event.name === name) !== undefined;
	}

	private isStarted(name: string) {
		return this.events.find((event) => event.name === name).started;
	}

	private hasAnyCallback(name: string) {
		return this.events.find((event) => event.name === name).callbacks.length > 0;
	}

	private hasCallback(name: string, fun: (...args: any[]) => void) {
		return this.events.find((event) => event.name === name).callbacks.find((callback) => callback.fun === fun) !== undefined;
	}
	
	private stopEvent(name: string) {

		// Set the event as stopped
		this.events.find((event) => event.name === name).started = false;

		ipcMain.removeAllListeners(name);
	}

	
	/**
	 * Start all events
	 * @example
	 * // IN app.ts
	 * eventHelper.getInstance().start();
	 * // => Start all events
	 */
	public start() {
		this.events.forEach((event) => {
			if (this.hasAnyCallback(event.name)) {
				this.startEvent(event.name);
			}
		});
	}

	/**
	 * Stop all events
	 * @example
	 * // IN app.ts
	 * eventHelper.getInstance().stop();
	 * // => Stop all events
	 * @example
	 * // IN app.ts
	 * eventHelper.getInstance().registerEvent('test');
	 * // => Register the event 'test'
	 * eventHelper.getInstance().registerCallback('test', (event, ...args) => {
	 * 	console.log(args);
	 * });
	 * // => Register a callback to the event 'test'
	 * // => The callback will be executed every time the event 'test' is emitted
	 * // => The callback will be executed with the arguments of the event
	 * // => The callback will be executed with the event object as first argument
	 * eventHelper.getInstance().stop();
	 * // => Stop all events
	 * // => The callback will not be executed anymore
	 * eventHelper.getInstance().start();
	 * // => Start all events
	 * // => The callback will be executed again
	 */
	public stop() {
		this.events.forEach((event) => {
			this.stopEvent(event.name);
		});
	}

	/**
	 * Register an event
	 * @param {string} name Name of the event
	 * @example
	 * // IN app.ts
	 * eventHelper.getInstance().registerEvent('test');
	 * // => Register the event 'test'
	 * @example
	 * // IN app.ts
	 * eventHelper.getInstance().registerEvent('test');
	 * // => Register the event 'test'
	 * eventHelper.getInstance().registerCallback('test', (event, ...args) => {
	 * 	console.log(args);
	 * });
	 * // => Register a callback to the event 'test'
	 * // => The callback will be executed every time the event 'test' is emitted
	 * // => The callback will be executed with the arguments of the event
	 * // => The callback will be executed with the event object as first argument
	 * @example
	 * // IN app.ts
	 * eventHelper.getInstance().registerCallback('test', (event, ...args) => {
	 * 	console.log(args);
	 * });
	 * // => Register a callback to the event 'test'
	 * // => This will create the event 'test' and register the callback
	 * eventHelper.getInstance().registerEvent('test');
	 * // => This will do nothing because the event 'test' is already registered with the callback above
	 */
	public registerEvent(name: string) {
		if (this.isRegistered(name)) {
			return;
		}
		this.events.push({
			name: name,
			callbacks: [],
			started: false
		});
	}

	public listEvents() {
		if (process.env.NODE_ENV === 'development') {
			console.table(this.events);
		}
	}

	/**
	 * Register a callback to an event
	 * @param {string} name Name of the event
	 * @param {(...args: any[]) => void} fun Callback function
	 * @param {boolean} once If the callback should be executed only once
	 * @example
	 * // IN app.ts
	 * eventHelper.getInstance().registerCallback('test', (event, ...args) => {
	 * 	console.log(args);
	 * });
	 * // => Register a callback to the event 'test'
	 * // => The callback will be executed every time the event 'test' is emitted
	 * // => The callback will be executed with the arguments of the event
	 * // => The callback will be executed with the event object as first argument
	 * @example
	 * // IN app.ts
	 * eventHelper.getInstance().registerCallback('test', (event, ...args) => {
	 * 	console.log(args);
	 * }, true);
	 * // => Register a callback to the event 'test'
	 * // => The callback will be executed only once
	 * // => The callback will be executed with the arguments of the event
	 * // => The callback will be executed with the event object as first argument
	 */
	public registerCallback(name: string, fun: (...args: any[]) => void, once = false) {

		if (!this.isRegistered(name)) {
			this.registerEvent(name);
		}

		if (this.hasCallback(name, fun)) {
			return;
		}

		this.events.find((event) => event.name === name).callbacks.push({
			fun: fun,
			once: once
		});

		// If the event is not started, start it
		if (!this.isStarted(name)) {
			this.startEvent(name);
		}

		console.log('registerCallback', name, once)
	}

	/**
	 * Unregister a callback from an event
	 * @param {string} name Name of the event
	 * @param {(...args: any[]) => void} fun Callback function
	 * @example
	 * // IN app.ts
	 * eventHelper.getInstance().unregisterCallback('test', (event, ...args) => {
	 * 	console.log(args);
	 * });
	 * // => Unregister the callback from the event 'test'
	 * // => The callback will not be executed anymore
	 * @example
	 * // IN app.ts
	 * const callback = (event, ...args) => {
	 * 	console.log(args);
	 * };
	 * eventHelper.getInstance().registerCallback('test', callback);
	 * // => Register a callback to the event 'test'
	 * // => The callback will be executed every time the event 'test' is emitted
	 * // => The callback will be executed with the arguments of the event
	 * // => The callback will be executed with the event object as first argument
	 * eventHelper.getInstance().unregisterCallback('test', callback);
	 * // => Unregister the callback from the event 'test'
	 * // => The callback will not be executed anymore
	 */
	public unregisterCallback(name: string, fun: (...args: any[]) => void) {

		if (!this.isRegistered(name)) {
			return;
		}

		if (!this.hasCallback(name, fun)) {
			return;
		}

		this.events.find((event) => event.name === name).callbacks.splice(this.events.find((event) => event.name === name).callbacks.indexOf(this.events.find((event) => event.name === name).callbacks.find((callback) => callback.fun === fun)), 1);

		// If the event has no more callbacks, stop it
		if (!this.hasAnyCallback(name)) {
			this.stopEvent(name);
		}
	}

	/**
	 * Unregister all callbacks from an event
	 * @param {string} name Name of the event
	 * @example
	 * // IN app.ts
	 * eventHelper.getInstance().unregisterAllCallbacks('test');
	 * // => Unregister all callbacks from the event 'test'
	 * // => The callbacks will not be executed anymore
	 * @example
	 * // IN app.ts
	 * const callback = (event, ...args) => {
	 * 	console.log(args);
	 * };
	 * eventHelper.getInstance().registerCallback('test', callback);
	 * // => Register a callback to the event 'test'
	 * // => The callback will be executed every time the event 'test' is emitted
	 * // => The callback will be executed with the arguments of the event
	 * // => The callback will be executed with the event object as first argument
	 * eventHelper.getInstance().unregisterAllCallbacks('test');
	 * // => Unregister all callbacks from the event 'test'
	 * // => The callbacks will not be executed anymore
	 */
	public unregisterAllCallbacks(name: string) {
		
		if (!this.isRegistered(name)) {
			return;
		}

		this.events.find((event) => event.name === name).callbacks = [];

		this.stopEvent(name);
	}
}