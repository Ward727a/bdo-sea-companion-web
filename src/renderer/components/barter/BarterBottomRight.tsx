/**
 * @file BarterBottomRight.tsx
 * @description Barter page bottom right component.
 * 
 * @author Ward
 * @license GPL-3.0
 * @version 0.0.1
 * @since 0.0.1
 */
import React, { useEffect } from "react";

import dataDict from "@src/typings/data";

import "./BarterBottomRight.scss";
import subEventHelper from "@common/subEvent";

type Props = {
    data: dataDict;
}

/**
 * Barter Bottom Right Component.
 * @param props The props of the component, type: {@link Props}
 * @returns The component, type: {@link React}
 */
const BarterBottomRight: React.FC<Props> = (props: Props) => {

    const [total, setTotal] = React.useState(0);

    const silver = require('../../../../assets/icons/silver.svg')
    


    useEffect(()=>{ 

        const titleThresoldWarning = document.getElementsByClassName('app-barter-bottom-left-content-zone-title')[0] as HTMLElement;

        const content = document.getElementsByClassName('app-barter-bottom-right-content')[0] as HTMLElement;

        content.style.marginTop = titleThresoldWarning.offsetHeight + 14 + "px";

        let _total = 0;
    
        // Calculate total value
        Object.keys(props.data.save.items[0]).forEach((key) => {
    
            // If the item has no data, skip it and log an error
            if(props.data.item[key] === undefined){
                console.log("Error: " + key + " has no data");
                console.log("Please report this to the developer...");

                props.data.save.items[0][key] = undefined;

                return;
            }

            // If the item has no tier, skip it and log an error
            if(props.data.item[key][0].tier === undefined){
                console.log("Error: " + key + " has no tier");
                console.log("Please report this to the developer...");

                props.data.save.items[0][key] = undefined;


                return;
            }

            const tier = parseInt(props.data.item[key][0].tier[0]);
            const qty = parseInt(props.data.save.items[0][key][0].iliya[0]) + parseInt(props.data.save.items[0][key][0].epheria[0]) + parseInt(props.data.save.items[0][key][0].ancado[0]);
    
            switch(tier){
                case 3:
                    _total = _total + (qty * 1000000);
                    break;
                case 4:
                    _total = _total + (qty * 2000000);
                    break;
                case 5:
                    _total = _total + (qty * 5000000);
                    break;
            }
            
        })
        setTotal(_total);

        subEventHelper.getInstance().registerCallback("total-value", () => {
    
            setTotal(0);
            new Promise((resolve) => {
            
                setTotal(0);
                _total = 0
                Object.keys(props.data.save.items[0]).forEach((key) => {

                    // If the item has no data, skip it and log an error
                    if(props.data.item[key] === undefined){
                        console.log("Error: " + key + " has no data");
                        console.log("Please report this to the developer...");
                        return;
                    }

                    const tier = parseInt(props.data.item[key][0].tier[0]);
                    const qty = parseInt(props.data.save.items[0][key][0].iliya[0]) + parseInt(props.data.save.items[0][key][0].epheria[0]) + parseInt(props.data.save.items[0][key][0].ancado[0]);
    
    
                    switch(tier){
                        case 3:
                            _total = _total + (qty * 1000000);
                            break;
                        case 4:
                            _total = _total + (qty * 2000000);
                            break;
                        case 5:
                            _total = _total + (qty * 5000000);
                            break;
                    }
                    
                })
                
                setTotal(_total);
    
                resolve(true);
            
            })
        }, 'BarterBottomRight')
        return(()=>{
            subEventHelper.getInstance().unregisterAllCallbacks("total-value");
        })
    }, [])

    return(
        <div className="app-barter-bottom-right-content">
            <p>{props.data.lang.barter[0].bottom[0].right[0].totalStoragesValue[0]}</p>

            <p className="last">{total.toLocaleString().replaceAll(' ', ',')}</p>
            <img src={silver}  draggable={false}/>
        </div>
    )
}

export default BarterBottomRight;