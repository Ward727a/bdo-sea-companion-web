/**
 * @file BarterCenter.tsx
 * @description Barter page center component, contains the table of items.
 * 
 * @author Ward
 * @license GPL-3.0
 * @version 0.0.1
 * @since 0.0.1
 */
import React, { ReactNode, useEffect } from "react";

import dataDict from "@src/typings/data";
import './BarterCenter.scss'
import BarterCenterItem from "./BarterCenterItem";
import subEventHelper from "@common/subEvent";


type Props = {
    data: dataDict;
}

/**
 * Barter Center Component, contains the table of items.
 * @param props The props of the component, type: {@link Props}
 * @returns The component, type: {@link React.FC}
 */
const BarterCenter: React.FC<Props> = (props: Props) => {

    const [isSearch, setIsSearch] = React.useState(false);
    const [search, setSearch] = React.useState("");

    const [valTotal, _setValTotal] = React.useState(0);

    const [state, setState] = React.useState('');
    const [table, setTable] = React.useState<ReactNode[]>([]);

    const [hideIliya, setHideIliya] = React.useState(true);
    const [hideEpheria, setHideEpheria] = React.useState(true);
    const [hideAncado, setHideAncado] = React.useState(true);

    // This function is used to hide or show the columns of each city in the table (iliya, epheria, ancado)
    const tagueuleetmarche = (hide: boolean, type: string) => {
        switch(type){
            case "iliya":
                setHideIliya(hide);
                break;
            case "epheria":
                setHideEpheria(hide);
                break;
            case "ancado":
                setHideAncado(hide);
                break;
            default:
                break;
        }
    };

    
    const mouseHover = () => {
        subEventHelper.getInstance().callEvent("rAdvice", props.data.lang.barter[0].table[0].tableAdvice[0]);
    };

    const mouseOut = () => {
        subEventHelper.getInstance().callEvent("rAdvice", "");
    };

    // Use the useEffect to load the table in a async way
    useEffect(() => {
        setState('loading');

        new Promise<ReactNode[]>((resolve) => {
            const data:ReactNode[] = [];
            Object.keys(props.data.item).map((key, index) => {

                // If the user is not searching for an item
                if(!isSearch){
                    data.push(
                        // eslint-disable-next-line react/jsx-key
                        <BarterCenterItem data={props.data} index={index} key={key} setValTotal={setValTotal} hideBool={tagueuleetmarche} hideIliya={hideIliya} hideEpheria={hideEpheria} hideAncado={hideAncado} />
                    )
                } else { // Else, if the user is searching for an item

                    // Get the item name and the item sub name and convert them to lowercase (to make the search case insensitive)
                    const itemName = props.data.lang.items[0][key][0].name[0].toLowerCase();
                    const itemSubName = props.data.lang.items[0][key][0].description[0].toLowerCase();

                    // Split the search string by the "+" character to make the search multiple "items" compatible
                    const _search: string | string[] = search.split("+");

                    // If the search string is an array, then we search for each item in the array
                    if(_search instanceof Array){
                        // Once we found an item that match the search, we add it to the table
                        if(_search.find((s) => itemName.toLowerCase().includes(s.toLowerCase().trim())) || _search.find((s) => itemSubName.toLowerCase().includes(s.toLowerCase().trim()))){                            
                            data.push(
                                // eslint-disable-next-line react/jsx-key
                                <BarterCenterItem data={props.data} index={index} key={key} setValTotal={setValTotal} hideBool={tagueuleetmarche} hideIliya={hideIliya} hideEpheria={hideEpheria} hideAncado={hideAncado} />
                            )
                        }
                    } else { // Else, if the search string is not an array, then we search for the item

                        // Once we found an item that match the search, we add it to the table
                        if(itemName.toLowerCase().includes(search.toLowerCase().trim()) || itemSubName.toLowerCase().includes(search.toLowerCase().trim())){
                            data.push(

                                // eslint-disable-next-line react/jsx-key
                                <BarterCenterItem data={props.data} index={index} key={key} setValTotal={setValTotal} hideBool={tagueuleetmarche} hideIliya={hideIliya} hideEpheria={hideEpheria} hideAncado={hideAncado} />
                            )
                        }
                    }
                }
            })

            // Once we have all the items, we send the data to the table
            resolve(data);
        }).then((data)=>{
            // Then we set the table
            setTable(data);
            // console.trace(data)
            setState('loaded');
        });
    }, [isSearch, search]);


    // Calculate the total value of the barter, and send it to the barterBottomRight component
    const setValTotal = (qty: number, tier: number) => {

        new Promise(()=>{
            switch(tier){
                case 1:
                    // If the tier is 1, the value is 0
                    _setValTotal(valTotal + (qty * 0));
                    subEventHelper.getInstance().callEvent('total-value', valTotal + (qty * 0));
                    break;
                case 2:
                    // If the tier is 2, the value is 0
                    _setValTotal(valTotal + (qty * 0));
                    subEventHelper.getInstance().callEvent('total-value', valTotal + (qty * 0));
                    break;
                case 3:
                    // If the tier is 3, the value is 1 000 000
                    _setValTotal(valTotal + (qty * 1000000));
                    subEventHelper.getInstance().callEvent('total-value', valTotal + (qty * 1000000));
                    break;
                case 4:
                    // If the tier is 4, the value is 2 000 000
                    _setValTotal(valTotal + (qty * 2000000));
                    subEventHelper.getInstance().callEvent('total-value', valTotal + (qty * 2000000));
                    break;
                case 5:
                    // If the tier is 5, the value is 5 000 000
                    _setValTotal(valTotal + (qty * 5000000));
                    subEventHelper.getInstance().callEvent('total-value', valTotal + (qty * 5000000));
                    break;
                default:
                    _setValTotal(valTotal + (qty * 0));
                    subEventHelper.getInstance().callEvent('total-value', valTotal + (qty * 0));
                    break;
            }
        })

    }


    // Register the search event when the component is mounted
    useEffect(()=>{

        subEventHelper.getInstance().registerCallback('search-barter', (search)=>{

            console.log(search)

            // Remove the useless space
            if(search !== undefined ) search = search.trim();
    
            // If the search is empty, we set the isSearch to false
            if(search === "" || search === undefined || search === null){
                setIsSearch(false)
            }else{ // Else we set the isSearch to true and the search value
                setIsSearch(true)
                setSearch(search)
            }
        }, 'BarterCenter')
        return(()=>{
            // Unregister the event when the component is unmounted
            subEventHelper.getInstance().unregisterAllCallbacks("search-barter");
        })
    },[])

    return(
        <table id="app-barter-center" onMouseOver={mouseHover} onMouseOut={mouseOut}>
            <thead>
                <tr>
                    <th>{props.data.lang.barter[0].table[0].tier[0]}</th>
                    <th>{props.data.lang.barter[0].table[0].name[0]}</th>
                    <th>{props.data.lang.barter[0].table[0].qty[0]}</th>
                    <th className="iliya-table-viewer" >Iliya</th>
                    <th className="epheria-table-viewer">Epheria</th>
                    <th className="ancado-table-viewer">Ancado</th>
                </tr>
            </thead>
            <tbody className="table-body">
                {
                    state === 'loading' ? <tr><td colSpan={6}>Loading...</td></tr> : table
                }
            </tbody>
        </table>
    )

};

export default BarterCenter;