/**
 * @file CarrackTracker.tsx
 * @description This file contains the main component for the carrack tracker.
 * @description This page is used to track the carrack.
 * 
 * @author Ward
 * @version 0.0.3
 * @license GPL-3.0
 * @since 0.0.2
 */

import subEventHelper from "@common/subEvent";
import dataDict from "@src/typings/data";
import React, { useEffect } from "react";
import CarrackInventory from "./CarrackInventory";
import CarrackMenu from "./CarrackMenu";
import CarrackNeed from "./CarrackNeed";

import "./CarrackTracker.scss"
import CarrackTrackerContent from "./CarrackTrackerContent";


type Props = {
    data: dataDict;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    boatType: any;
}

/**
 * The main component for the carrack tracker.
 * This page is used to track the carrack.
 * @param props The props of the component: {@link Props}
 * @returns the react component to render, type: {@link React.FC}
 * @version 0.0.3
 * @since 0.0.2
 */
const CarrackTracker = (props: Props) => {

    // Create a state to store the tracker state (if the user is on the inventory or the tracker)
    const [state, setState] = React.useState("inventory");

    // Create a state to store the content of the page
    const [content, setContent] = React.useState<JSX.Element>(<div><p>loading...</p></div> as JSX.Element);

    // Get the boat type
    const boatType = props.boatType;

    // Get the inventory
    const inventory = props.data.save.inventory[0];

    // Register the useEffect to execute the callback when the component is mounted
    useEffect(() => {

        // Check the state and set the content accordingly to his value, default is an loading message
        switch(state) {
            case "inventory":
                // Set the content to the inventory
                setContent(
                    <div className="carrack">
                        <div className="carrack-left">
                            <CarrackMenu data={props.data} state="inventory" setState={setState} boatType={props.boatType} /> {/* Get the menu from the CarrackMenu component */}
                        </div>
                        <div className="carrack-center">
                            <CarrackInventory data={props.data} boatType={props.boatType} /> {/* Get the inventory from the CarrackInventory component */}
                        </div>
                        <div className="carrack-right">
                            <CarrackNeed data={props.data} boatType={boatType} /> {/* Get the need from the CarrackNeed component */}
                        </div>
                    </div>
                )
                break;
            case "tracker":
                // Set the content to the tracker
                setContent(
                    <div className="carrack">
                        <div className="carrack-left">
                            <CarrackMenu data={props.data} state="tracker" setState={setState} boatType={props.boatType} /> {/* Get the menu from the CarrackMenu component */}
                        </div>
                        <div className="carrack-center">
                            <CarrackTrackerContent data={props.data} boatType={boatType} /> {/* Get the tracker content from the CarrackTrackerContent component */}
                        </div>
                        <div className="carrack-right">
                            <CarrackNeed data={props.data} boatType={boatType} /> {/* Get the need from the CarrackNeed component */}
                        </div>
                    </div>
                )
                break;
            default:
                // Set the content to an loading message
                setContent(
                    <div>
                        <p>loading...</p>
                    </div>
                )
                break;
        }
        
        // Call the update-carrack-need event to update the need
        subEventHelper.getInstance().callEvent('update-carrack-need', inventory)
    }, [state])

    // Return the component
    return (
        <div className="app-carrack-tracker">
            {content}
        </div>
    );
};

export default CarrackTracker;