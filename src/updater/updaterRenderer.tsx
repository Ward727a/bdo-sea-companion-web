import React from 'react';
import { createRoot } from 'react-dom/client';

import win_ from '@src/typings/win';
import subEventHelper from '@common/subEvent';

import Updater from '@updater/Updater';


const log = console.log;
const trace = console.trace;
const debug = console.debug;
const info = console.info;
const warn = console.warn;

// Override console.log to add a prefix
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.console.log = function(...args: any[]){
    new Promise((resolve) => {
    resolve(
        log('%c[BDOC] :%c'+ args, 'color: #32a852;font-weight: bold', 'color: #ffffff'))
    })
}

// Override console.trace to add a prefix and only show in development mode
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.console.trace = function(...args: any[]){
  // Trace only if in development mode
    if(process.env.NODE_ENV === 'development'){
        new Promise((resolve) => {
        resolve(
            trace('%c[BDOC] :%c'+ args, 'color: #8b32a8;font-weight: bold', 'color: #ffffff')
        )
        })
    }
}

// Override console.debug to add a prefix and only show in development mode
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.console.debug = function(...args: any[]){
  // Debug only if in development mode
    if(process.env.NODE_ENV === 'development'){
        new Promise((resolve) => {
        resolve(
            debug('%c[BDOC] :%c'+ args, 'color: #5a32a8;font-weight: bold', 'color: #ffffff')
        )
        })
    }
}

// Override console.info to add a prefix
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.console.info = function(...args: any[]){
    new Promise((resolve) => {
        resolve(
        info('%c[BDOC] :%c'+ args, 'color: #9ba832;font-weight: bold', 'color: #ffffff')
        )
    })
}

// Override console.warn to add a prefix
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.console.warn = function(...args: any[]){
    new Promise((resolve) => {
        resolve(
        warn('%c[BDOC] :%c'+ args, 'color: #a85e32;font-weight: bold', 'color: #ffffff')
        )
    })
}

const win:win_ = window;

const eventHelper = subEventHelper.getInstance(window);


// const dict:langDict = ;
function init(){

    // Render application in DOM
    createRoot(document.getElementById('app')).render(app());

}

console.log('[ERWT] : Renderer execution started');
init();


// Create a window object
function app(): React.ReactNode{

    return (
        <Updater/>
    );
}