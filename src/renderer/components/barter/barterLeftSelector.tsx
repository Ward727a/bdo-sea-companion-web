/**
 * @file BarterLeftSelector.tsx
 * @description Barter page left selector component, used to select if we want to hide a city in the table.
 * 
 * @author Ward
 * @license GPL-3.0
 * @version 0.0.1
 * @since 0.0.1
 */

import React, { useState } from 'react';

import './BarterLeftSelector.scss';

type Props = {
    default: boolean;
    for: "Iliya" | "Epheria" | "Ancado"
    onChange: (value: boolean) => void;
    warn: boolean
}

/**
 * Barter page left selector component, used to select if we want to hide a city in the table.
 * @param props The props of the component, type: {@link Props}
 * @returns The component, type: {@link React.FC}
 */
const BarterLeftSelector:React.FC<Props> = (props: Props) => {

    const [checked, setChecked] = useState(props.default);
    const icon = require(`../../../../assets/icons/checkbox-cross.svg`);


    return(
        <div className={`app-barter-left-selector ${props.for.toLowerCase()}-selector ${checked && props.warn? 'warned' : ''}`}>
            {/* custom checkbox style */}
            <label>
                <input type='checkbox' checked={checked} onChange={() => {
                    setChecked(!checked)
                    props.onChange(!checked)
                    }} />
                <p>{props.for}</p>
                <div className='checkbox-border'>
                    <img className={`display-checkbox-${checked ? 'y' : 'n'}`} src={icon} draggable={false}/>
                </div>
            </label>
        </div>
    );
};

export default BarterLeftSelector;