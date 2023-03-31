/**
 * @file BarterLeftItem.tsx
 * @description Barter page left item component, displays the selected item in the list.
 * @description If no item is selected, it displays nothing.
 * 
 * @author Ward
 * @license GPL-3.0
 * @version 0.0.1
 * @since 0.0.1
 */

import React, { useEffect } from "react";

import dataDict from "@src/typings/data";

import "./BarterLeftItem.scss";
import subEventHelper from "@common/subEvent";

type Props = {
    data: dataDict;
}

/**
 * Barter page left item component, displays the selected item in the list.
 * 
 * If no item is selected, it displays nothing.
 * @param props The props of the component, type: {@link Props}
 * @returns The component, type: {@link React.FC}
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const BarterLeftItem: React.FC<Props> = (_props: Props) => {

    const [icon, setIcon] = React.useState<string>(require('@assets/images/items/empty.png'));
    const [name, setName] = React.useState<string>("");
    const [tier, setTier] = React.useState<number>(1);
    
    
    useEffect(()=>{

        subEventHelper.getInstance().registerCallback("barterItemSelect",(icon, tier, name) => {
            
            const nameP = document.querySelector('.app-barter-left-content-zone-item-name p') as HTMLParagraphElement;
            nameP.style.fontSize = '16px';
            
            const oldContent = nameP.innerText;
            nameP.innerText = name;

            let fontSize = 16;

            while(nameP.offsetHeight > 22 && fontSize > 11) {
                fontSize--;
                nameP.style.fontSize = (fontSize) + 'px';
            }

            nameP.innerText = oldContent;

            document.getElementsByClassName('app-barter-left-content-zone-item')[0].setAttribute('style', 'opacity: 1;');
            try{
                setIcon(require('@assets/images/items/'+icon));
            } catch (e) {
                setIcon(require('@assets/images/items/empty.png'));
            }

            setName(name);
            setTier(tier);
            

        }, 'BarterLeftItem')
        return(
            ()=>{
                subEventHelper.getInstance().unregisterAllCallbacks("barterItemSelect");
            }
        )
    }, [])

    return(
        <div className={`app-barter-left-content-zone-item zone-item-tier-${tier}`} style={{opacity: '0'}}>


            <div className="app-barter-left-content-zone-item-tier">
                <p>Tier {tier}</p>
            </div>
            <div className="app-barter-left-content-zone-item-icon">
                <img src={icon}  draggable={false}/>
            </div>

            <div className="app-barter-left-content-zone-item-name">
                <p>{name}</p>
            </div>
        </div>

    )

}

export default BarterLeftItem;