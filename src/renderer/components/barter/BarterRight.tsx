/**
 * @file BarterRight.tsx
 * @description Barter page right component, contains the tier checkboxes.
 * 
 * @author Ward
 * @license GPL-3.0
 * @version 0.0.1
 * @since 0.0.1
 */
import tempHelper from '@common/temp';
import React, {useEffect} from 'react';

import './BarterRight.scss';
import subEventHelper from '../../../common/subEvent';

type Props = {
    onClick: (tier: number, hide:boolean) => void;
};

/**
 * Barter Right Component, contains the tier checkboxes.
 * @param props The props of the component, type: {@link Props}
 * @returns The react component, type: {@link React.FC<Props>}
 */
const BarterRight:React.FC<Props> = (props: Props) => {

    const { onClick } = props;

    const [All, setAll] = React.useState(tempHelper.getInstance().get('barterAll') == false? tempHelper.getInstance().get('barterAll') : true);
    const [Tier1, setTier1] = React.useState(tempHelper.getInstance().get('barterTier1') == false? tempHelper.getInstance().get('barterTier1') : true);
    const [Tier2, setTier2] = React.useState(tempHelper.getInstance().get('barterTier2') == false? tempHelper.getInstance().get('barterTier2') : true);
    const [Tier3, setTier3] = React.useState(tempHelper.getInstance().get('barterTier3') == false? tempHelper.getInstance().get('barterTier3') : true);
    const [Tier4, setTier4] = React.useState(tempHelper.getInstance().get('barterTier4') == false? tempHelper.getInstance().get('barterTier4') : true);
    const [Tier5, setTier5] = React.useState(tempHelper.getInstance().get('barterTier5') == false? tempHelper.getInstance().get('barterTier5') : true);

    const [tier1Warning, setTier1Warning] = React.useState(false);
    const [tier2Warning, setTier2Warning] = React.useState(false);
    const [tier3Warning, setTier3Warning] = React.useState(false);
    const [tier4Warning, setTier4Warning] = React.useState(false);
    const [tier5Warning, setTier5Warning] = React.useState(false);
    
    let tier1Table:boolean[] = []
    let tier2Table:boolean[] = []
    let tier3Table:boolean[] = []
    let tier4Table:boolean[] = []
    let tier5Table:boolean[] = []


    const resetIcon = require('@assets/icons/reset.svg');


    useEffect(() => {


        setTimeout(onLoaded, 250);
    }, []);

    const onLoaded = () => {
        
        onClick(1, Tier1);
        onClick(2, Tier2);
        onClick(3, Tier3);
        onClick(4, Tier4);
        onClick(5, Tier5);

        const parent = document.getElementsByTagName('tbody')[0].children

        tier1Table = []
        tier2Table = []
        tier3Table = []
        tier4Table = []
        tier5Table = []
        for (let i = 0; i < parent.length; i++) {
            const targets = parent[i] as HTMLTableRowElement;
            for (let i = 0; i < targets.children.length; i++) {
    
    
                const target = targets.children[i] as HTMLTableCellElement;
                if (target.classList.contains('warning-thresold')) {


                    if(target.style.display !== 'none') {

                        if(targets.classList.contains('tier-1')) {
                            tier1Table.push(true)
                        } else if (targets.classList.contains('tier-2')) {
                            tier2Table.push(true)
                        } else if (targets.classList.contains('tier-3')) {
                            tier3Table.push(true)
                        } else if (targets.classList.contains('tier-4')) {
                            tier4Table.push(true)
                        } else if (targets.classList.contains('tier-5')) {
                            tier5Table.push(true)
                        }
                    }
                }
            }
        }
        if (tier1Table.length > 0) {
            if(tier1Table.includes(true)) {
                setTier1Warning(true)
            }
        } else {
            setTier1Warning(false)
        }
        if (tier2Table.length > 0) {
            if(tier2Table.includes(true)) {
                setTier2Warning(true)
            }
        } else {
            setTier2Warning(false)
        }
        if (tier3Table.length > 0) {
            if(tier3Table.includes(true)) {
                setTier3Warning(true)
            }
        } else {
            setTier3Warning(false)
        }
        if (tier4Table.length > 0) {
            if(tier4Table.includes(true)) {
                setTier4Warning(true)
            }
        } else {
            setTier4Warning(false)
        }
        if (tier5Table.length > 0) {
            if(tier5Table.includes(true)) {
                setTier5Warning(true)
            }
        } else {
            setTier5Warning(false)
        }
    }

    // Check change of in class of the element with MutationObserver and set the state accordingly
    const observer = new MutationObserver((mutations) => {

        mutations.forEach((mutation) => {

            if (mutation.type === 'attributes') {
                if (mutation.attributeName === 'class' || mutation.attributeName === 'style') {
                    const parent = mutation.target.parentElement.parentElement as HTMLTableElement;

                    if(parent.classList.contains('table-body')){
                        tier1Table = []
                        tier2Table = []
                        tier3Table = []
                        tier4Table = []
                        tier5Table = []
                        for (let i = 0; i < parent.children.length; i++) {
                            const targets = parent.children[i] as HTMLTableRowElement;
                            for (let i = 0; i < targets.children.length; i++) {
                    
                    
                                const target = targets.children[i] as HTMLTableCellElement;
                                if (target.classList.contains('warning-thresold')) {


                                    if(target.style.display !== 'none') {

                                        if(targets.classList.contains('tier-1')) {
                                            tier1Table.push(true)
                                        } else if (targets.classList.contains('tier-2')) {
                                            tier2Table.push(true)
                                        } else if (targets.classList.contains('tier-3')) {
                                            tier3Table.push(true)
                                        } else if (targets.classList.contains('tier-4')) {
                                            tier4Table.push(true)
                                        } else if (targets.classList.contains('tier-5')) {
                                            tier5Table.push(true)
                                        }
                                    }
                                }
                            }
                        }
                        if (tier1Table.length > 0) {
                            if(tier1Table.includes(true)) {
                                setTier1Warning(true)
                            }
                        } else {
                            setTier1Warning(false)
                        }
                        if (tier2Table.length > 0) {
                            if(tier2Table.includes(true)) {
                                setTier2Warning(true)
                            }
                        } else {
                            setTier2Warning(false)
                        }
                        if (tier3Table.length > 0) {
                            if(tier3Table.includes(true)) {
                                setTier3Warning(true)
                            }
                        } else {
                            setTier3Warning(false)
                        }
                        if (tier4Table.length > 0) {
                            if(tier4Table.includes(true)) {
                                setTier4Warning(true)
                            }
                        } else {
                            setTier4Warning(false)
                        }
                        if (tier5Table.length > 0) {
                            if(tier5Table.includes(true)) {
                                setTier5Warning(true)
                            }
                        } else {
                            setTier5Warning(false)
                        }
                    }
                }
            }
        });

    });


    useEffect(() => {
        
        // Launch the observer script on the body once before observing it
        observer.observe(document.body, {
            attributes: true,
            childList: true,
            subtree: true
        });
        
        return(() => { observer.disconnect() });
    }, []);


    return (
        <div className="barter-right">
            <div className="barter-right__buttons">
                <button className={`barter-right__button all ${All? 'active':'not-active'}`} onClick={() => {
                    setAll(!All);

                    tempHelper.getInstance().set('barterAll', !All);
                    if (All) {
                        setTier1(false);
                        setTier2(false);
                        setTier3(false);
                        setTier4(false);
                        setTier5(false);

                        onClick(1, false);
                        onClick(2, false);
                        onClick(3, false);
                        onClick(4, false);
                        onClick(5, false);

                        tempHelper.getInstance().set('barterTier1', false);
                        tempHelper.getInstance().set('barterTier2', false);
                        tempHelper.getInstance().set('barterTier3', false);
                        tempHelper.getInstance().set('barterTier4', false);
                        tempHelper.getInstance().set('barterTier5', false);
                        tempHelper.getInstance().set('barterAll', false);
                    } else {
                        setTier1(true);
                        setTier2(true);
                        setTier3(true);
                        setTier4(true);
                        setTier5(true);

                        onClick(1, true);
                        onClick(2, true);
                        onClick(3, true);
                        onClick(4, true);
                        onClick(5, true);
                        tempHelper.getInstance().set('barterTier1', true);
                        tempHelper.getInstance().set('barterTier2', true);
                        tempHelper.getInstance().set('barterTier3', true);
                        tempHelper.getInstance().set('barterTier4', true);
                        tempHelper.getInstance().set('barterTier5', true);
                        tempHelper.getInstance().set('barterAll', true);
                    }

                    
                }}>All</button>
                <button className={`barter-right__button ${Tier1 ? 'active' : 'not-active'} ${tier1Warning? 'warn' : ''}`} onClick={() => {
                    setTier1(!Tier1);
                    onClick(1, !Tier1);

                    tempHelper.getInstance().set('barterTier1', !Tier1);
                    tempHelper.getInstance().set('barterAll', (!Tier1 && Tier2 && Tier3 && Tier4 && Tier5));
                    setAll((!Tier1 && Tier2 && Tier3 && Tier4 && Tier5));
                }}>Tier 1</button>
                <button className={`barter-right__button ${Tier2 ? 'active' : 'not-active'} ${tier2Warning? 'warn' : ''}`} onClick={() => {
                    setTier2(!Tier2);
                    onClick(2, !Tier2);

                    tempHelper.getInstance().set('barterTier2', !Tier2);
                    tempHelper.getInstance().set('barterAll', (Tier1 && !Tier2 && Tier3 && Tier4 && Tier5));
                    setAll((Tier1 && !Tier2 && Tier3 && Tier4 && Tier5));
                }}>Tier 2</button>
                <button className={`barter-right__button ${Tier3 ? 'active' : 'not-active'} ${tier3Warning? 'warn' : ''}`} onClick={() => {
                    setTier3(!Tier3);
                    onClick(3, !Tier3);

                    tempHelper.getInstance().set('barterTier3', !Tier3);
                    tempHelper.getInstance().set('barterAll', (Tier1 && Tier2 && !Tier3 && Tier4 && Tier5));
                    setAll((Tier1 && Tier2 && !Tier3 && Tier4 && Tier5));
                }}>Tier 3</button>
                <button className={`barter-right__button ${Tier4 ? 'active' : 'not-active'} ${tier4Warning? 'warn' : ''}`} onClick={() => {
                    setTier4(!Tier4);
                    onClick(4, !Tier4);

                    tempHelper.getInstance().set('barterTier4', !Tier4);
                    tempHelper.getInstance().set('barterAll', (Tier1 && Tier2 && Tier3 && !Tier4 && Tier5));
                    setAll((Tier1 && Tier2 && Tier3 && !Tier4 && Tier5));
                }}>Tier 4</button>
                <button className={`barter-right__button ${Tier5 ? 'active' : 'not-active'} ${tier5Warning? 'warn' : ''}`} onClick={() => {
                    setTier5(!Tier5);
                    onClick(5, !Tier5);

                    tempHelper.getInstance().set('barterTier5', !Tier5);
                    tempHelper.getInstance().set('barterAll', (Tier1 && Tier2 && Tier3 && Tier4 && !Tier5));
                    setAll((Tier1 && Tier2 && Tier3 && Tier4 && !Tier5));
                }}>Tier 5</button>
            </div>

            <div className='barter-right__reset'>
                <div className="barter-right-resetButton">
                    <img src={resetIcon} alt="reset" onClick={() => {
                        subEventHelper.getInstance().callEvent('rOpenReset')
                    }}/>
                </div>
            </div>

        </div>
    );
};

export default BarterRight;