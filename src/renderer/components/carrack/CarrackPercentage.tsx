
import React, { useEffect } from 'react';

import './CarrackPercentage.scss';

interface Props {
    percentage: number;
}

const CarrackPercentage: React.FC<Props> = ({ percentage }) => {
    useEffect(() => {
        const percentageElement = document.getElementById('carrack-percentage');

        if (percentageElement) {
            percentageElement.style.setProperty('--percentage', `${percentage}%`);
        }

        if(percentage < 15){
            percentageElement.querySelector('p').style.marginLeft = '128.5px';
            percentageElement.querySelector('p').style.color = '#fff';
        } else {
            percentageElement.querySelector('p').style.marginLeft = 'auto';
            percentageElement.querySelector('p').style.marginRight = 'auto';
            percentageElement.querySelector('p').style.color = '#000';
        }

        if(percentage === 100){
            percentageElement.style.borderRadius = '4px';
        }

    }, [percentage]);

    return (
        <div className="carrack-percentage">
            <div className="carrack-percentage__container">
                <div className="carrack-percentage__bar" id="carrack-percentage">
                    <p>{percentage}%</p>
                </div>
            </div>
        </div>
    );
};

export default CarrackPercentage;