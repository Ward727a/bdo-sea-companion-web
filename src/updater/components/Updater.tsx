import subEventHelper from '@common/subEvent';
import React, { useState } from 'react';

import './Updater.scss'

// Create the component to render
const Updater: React.FC = () => {

    const [title, setTitle] = useState('Searching update');
    const [message, setMessage] = useState('Please wait...');

    let timeout: NodeJS.Timeout = null;

    subEventHelper.getInstance().registerCallback('update-available', () => {
        setTitle('Update found');
        setMessage('Installing update...');

        timeout = setTimeout(() => {
            // Send a message to the main process
            subEventHelper.getInstance().send('sUpdater');
        }, 10000);
    }, 'updater');

    subEventHelper.getInstance().registerCallback('update-downloaded', () => {
        
        setTitle('Update downloaded');
        setMessage('The app will restart in 2 seconds...');

        if(timeout !== null) clearTimeout(timeout);

        setTimeout(() => {
            // Send a message to the main process
            subEventHelper.getInstance().send('update-restart');
        }, 2000);

    }, 'updater');

    subEventHelper.getInstance().registerCallback('error', ()=>{
        setTitle('Error while updating');

        setMessage('Please try again later or contact us on GitHub')
        setTimeout(() => {
            // Send a message to the main process
            subEventHelper.getInstance().send('sUpdater');
        }, 5000);

    }, 'updater')

    subEventHelper.getInstance().registerCallback('update-not-available', () => {
        setTitle('Launching app')

        setMessage('No update found')
        setTimeout(() => {
            // Send a message to the main process
            subEventHelper.getInstance().send('sUpdater');
        }, 1000);

    }, 'updater');

    const logo = require('@assets/images/Logo.png');

  // Return the component to render
    return (
        <div id='BDOC-Updater'>
            <div id='BDOC-Updater-Header'>
                <img src={logo} alt='BDOSC Logo' width="100%" draggable={false}/>
            </div>
            <div id='BDOC-Updater-Body'>
                <p id='BDOC-Updater-Title'>{title}</p>
                <p id='BDOC-Updater-Message'>{message}</p>
            </div>
        </div>
    );
};

export default Updater;
