/**
 * @file BarterBottom.tsx
 * @description Barter page bottom component.
 * @author Ward
 * @license GPL-3.0
 * @version 0.0.1
 * @since 0.0.1
 */

import React from "react";

import dataDict from "@src/typings/data";

import "./BarterBottom.scss";
import BarterBottomLeft from "./BarterBottomLeft";
import BarterBottomRight from "./BarterBottomRight";

type Props = {
    data: dataDict;
}

/**
 * The bottom component for the barter page.
 * @param props The props for the component, type: {@link Props}
 * @returns The react component, type: {@link React.FC<Props>}
 * @since 0.0.1
 * @version 0.0.1
 */
const BarterBottom: React.FC<Props> = (props: Props) => {

    // Return the component
    return(
        <div className="app-barter-bottom">
            <div className="app-barter-bottom-content">
                <div className="app-barter-bottom-left-content">

                    <BarterBottomLeft data={props.data} />

                </div>
                <div></div>
                <BarterBottomRight data={props.data} />
            </div>
        </div>
    )
}

export default BarterBottom;