/**
 * @file BarterLeft.tsx
 * @description Barter page left component, it's used to display the hide buttons for each city (iliya, epheria, ancado), the search bar, the special items and the item focused.
 * 
 * @author Ward
 * @license GPL-3.0
 * @version 0.0.1
 * @since 0.0.1
 */

import React, { useEffect } from 'react';

import dataDict from '@src/typings/data';

import './BarterLeft.scss';
import BarterLeftSelector from './barterLeftSelector';
import win_ from '@src/typings/win';
import BarterLeftSpecial from './BarterLeftSpecial';
import BarterLeftItem from './BarterLeftItem';
import BarterLeftSearch from './BarterLeftSearch';
import subEventHelper from '@common/subEvent';

const win:win_ = window;

type Props = {
    data: dataDict;
}

/**
 * Barter Left Component, it's used to display the hide buttons for each city (iliya, epheria, ancado), the search bar, the special items and the item focused.
 * @param props The props of the component, type: {@link Props}
 * @returns The component, type: {@link React.FC}
 */
const BarterLeft:React.FC<Props> = (props: Props) => {

    const [iliya, setIliya] = React.useState(null);
    const [epheria, setEpheria] = React.useState(false);
    const [ancado, setAncado] = React.useState(false);    

    const [iliyaSelector, setIliyaSelector] = React.useState(<p>Loading...</p>);
    const [epheriaSelector, setEpheriaSelector] = React.useState(<p>Loading...</p>);
    const [ancadoSelector, setAncadoSelector] = React.useState(<p>Loading...</p>);
    
    let iliyaTable:boolean[] = []
    let epheriaTable:boolean[] = []
    let ancadoTable:boolean[] = []
    
    // Launch the function when the component is mounted, and when the component is unmounted, unregister all the callbacks.
    useEffect(() => {
            // Check if the table contains some value that is under the threshold, if it's the case, set the state to true, else set it to false. We do this for each city.
            setTimeout(() => {

                document.getElementsByClassName('iliya-table-viewer warning-thresold').length > 0 ? setIliya(true) : setIliya(false);
                document.getElementsByClassName('epheria-table-viewer warning-thresold').length > 0 ? setEpheria(true) : setEpheria(false);
                document.getElementsByClassName('ancado-table-viewer warning-thresold').length > 0 ? setAncado(true) : setAncado(false);

            }, 100  );
        return () => {
            subEventHelper.getInstance().unregisterAllCallbacks("rAskStatusSelector-ancado");
            subEventHelper.getInstance().unregisterAllCallbacks("rAskStatusSelector-epheria");
            subEventHelper.getInstance().unregisterAllCallbacks("rAskStatusSelector-iliya");
            subEventHelper.getInstance().unregisterAllCallbacks('rAskStatusSelector');
        };
    }, [])

    

    useEffect(() => {
        
        if (iliya === null) return;

        subEventHelper.getInstance().registerEvent('rAskStatusSelector-iliya');
        subEventHelper.getInstance().registerEvent('rAskStatusSelector-epheria');
        subEventHelper.getInstance().registerEvent('rAskStatusSelector-ancado');

        subEventHelper.getInstance().registerCallback('rAskStatusSelector-iliya', (data) => {
            if(!data) {
                Object.keys(document.getElementsByClassName('iliya-table-viewer')).forEach((value:string, index:number) => {
                    const element = document.getElementsByClassName('iliya-table-viewer')[index] as HTMLElement;
                    element.style.display = 'none';
                    win.api.send('hide-col-barter', {hide: true, type: 'iliya'});
                });
            }
            setIliyaSelector(
                <BarterLeftSelector default={data} for="Iliya" onChange={(change:boolean)=>{
                    new Promise((resolve) => {
                            Object.keys(document.getElementsByClassName('iliya-table-viewer')).forEach((value:string, index:number) => {
                                const element = document.getElementsByClassName('iliya-table-viewer')[index] as HTMLElement;
                                if (!change) {
                                    element.style.display = 'none';
                                } else {
                                    element.style.display = '';
                                }

                                win.api.send('hide-col-barter', {hide: change, type: 'iliya'});
                                subEventHelper.getInstance().send('sStatusSelector', 'iliya', change);
                            });
                        resolve(true);
                    });
                }} warn={iliya}/>
            );
        }, 'BarterLeft', true);

        subEventHelper.getInstance().registerCallback('rAskStatusSelector-epheria', (data) => {
            

            if(!data) {
                Object.keys(document.getElementsByClassName('epheria-table-viewer')).forEach((value:string, index:number) => {
                    const element = document.getElementsByClassName('epheria-table-viewer')[index] as HTMLElement;
                    element.style.display = 'none';
                    win.api.send('hide-col-barter', {hide: true, type: 'epheria'});
                });
            }
            setEpheriaSelector(
                <BarterLeftSelector default={data} for="Epheria" onChange={(change:boolean)=>{
                    new Promise((resolve) => {
                        Object.keys(document.getElementsByClassName('epheria-table-viewer')).forEach((value:string, index:number) => {
                            const element = document.getElementsByClassName('epheria-table-viewer')[index] as HTMLElement;
                            if (!change) {
                                element.style.display = 'none';
                            } else {
                                element.style.display = '';
                            }

                            win.api.send('hide-col-barter', {hide: change, type: 'epheria'});
                            subEventHelper.getInstance().send('sStatusSelector', 'epheria', change);
                        });
                        resolve(true);
                    });
                }} warn={epheria}/>
            );
        }, 'BarterLeft', true);

        subEventHelper.getInstance().registerCallback('rAskStatusSelector-ancado', (data) => {

            console.log('ancado', data)

            if(!data) {
                Object.keys(document.getElementsByClassName('ancado-table-viewer')).forEach((value:string, index:number) => {
                    const element = document.getElementsByClassName('ancado-table-viewer')[index] as HTMLElement;
                    element.style.display = 'none';
                    win.api.send('hide-col-barter', {hide: true, type: 'ancado'});
                });
            }

            setAncadoSelector(
                <BarterLeftSelector default={data} for="Ancado" onChange={(change:boolean)=>{
                    new Promise((resolve) => {
                        Object.keys(document.getElementsByClassName('ancado-table-viewer')).forEach((value:string, index:number) => {
                            const element = document.getElementsByClassName('ancado-table-viewer')[index] as HTMLElement;
                            if (!change) {
                                element.style.display = 'none';
                            } else {
                                element.style.display = '';
                            }

                            win.api.send('hide-col-barter', {hide: change, type: 'ancado'});
                        });
                        subEventHelper.getInstance().send('sStatusSelector', 'ancado', change);
                        resolve(true);
                    });
                }} warn={ancado}/>
            );
        }, 'BarterLeft', true);

            // Check change of in class of the element with MutationObserver and set the state accordingly
                const observer = new MutationObserver(async (mutations) => {
                    iliyaTable = []
                    epheriaTable = []
                    ancadoTable = []
                    mutations.forEach((mutation) => {
                        if (mutation.type === 'attributes') {
                            if (mutation.attributeName === 'class') {
                                const parent = mutation.target.parentElement.parentElement as HTMLTableElement;
        
                                for (let i = 0; i < parent.children.length; i++) {
                                    const targets = parent.children[i] as HTMLTableRowElement;
                                    for (let i = 0; i < targets.children.length; i++) {
                                        const target = targets.children[i] as HTMLTableCellElement;
        
                                        if(target.classList.contains('iliya-table-viewer')) {
                                            if (target.classList.contains('warning-thresold')) {
                                                iliyaTable.push(false)
                                            } else {
                                                iliyaTable.push(true)
                                            }
                                        }
                                        if(target.classList.contains('epheria-table-viewer')) {
                                            if (target.classList.contains('warning-thresold')) {
                                                epheriaTable.push(false)
                                            } else {
                                                epheriaTable.push(true)
                                            }
                                        }
                                        if(target.classList.contains('ancado-table-viewer')) {
                                            if (target.classList.contains('warning-thresold')) {
                                                ancadoTable.push(false)
                                            } else {
                                                ancadoTable.push(true)
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    });
                    
        
                    if (iliyaTable.length > 0) {
                        if(iliyaTable.includes(false)) {
                            setIliya(true);
                        } else {
                            setIliya(false);
                        }
                    }
                    if (epheriaTable.length > 0) {
                        if(epheriaTable.includes(false)) {
                            setEpheria(true);
                        } else {
                            setEpheria(false);
                        }
                    }
                    if (ancadoTable.length > 0) {
                        if(ancadoTable.includes(false)) {
                            setAncado(true);
                        } else {
                            setAncado(false);
                        }
                    }
        
                });
            // Launch the observer script on the body once before observing it
            observer.observe(document.body, {
                attributes: true,
                childList: false,
                subtree: true
            });

        subEventHelper.getInstance().send('sAskStatusSelector', 'iliya');
        subEventHelper.getInstance().send('sAskStatusSelector', 'epheria');
        subEventHelper.getInstance().send('sAskStatusSelector', 'ancado');

    }, [iliya, epheria, ancado]);


                    
    subEventHelper.getInstance().registerEvent('rAskStatusSelector');
    
    const icon = require(`@assets/icons/chest.svg`);
    return(
        <div id='app-barter-left-content'>
            <div id='app-barter-left-content-zone-header'>
                <p>{props.data.lang.barter[0].left[0].storageTitle[0]}</p>
                <img src={icon}  draggable={false}/>
            </div>
            <div id='app-barter-left-content-zone-selector'>
                {
                    iliyaSelector
                }
                {
                    epheriaSelector
                }
                {
                    ancadoSelector
                }

            </div>
            <BarterLeftSpecial data={props.data} />
            <BarterLeftItem data={props.data}/>
            <BarterLeftSearch data={props.data} search={''}/>
        </div>
    );
};

export default BarterLeft;