import React from 'react';
import { Card } from '@material-ui/core';

const WeatherCard = ({ day, temperatureMax, description, temperatureMin, url }) => {
    return (
        <Card style={{ display: 'flex', minWidth: '18%', padding: '2rem 0 2rem 0', flexDirection: 'column', justifyContent: 'space-between' }}>
            <h4>{day}</h4>
            <div style={{ height: '4rem', padding: '1rem 0 1rem 0' }}>
                <img src={`https://www.accuweather.com/images/weathericons/${url}.svg`} style={{ height: '100%' }} />
            </div>
            <span>{description}</span>
            <div style={{ padding: '1rem 0 1rem', display: 'flex', flexDirection: 'column' }}>
                <span>{temperatureMax}°</span>
                <span>{temperatureMin}°</span>
            </div>
        </Card>
    )
}
export default WeatherCard;