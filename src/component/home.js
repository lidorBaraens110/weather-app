import React, { useState, useEffect, useContext } from 'react';
import { FavoriteContext } from '../context/favoriteContext'
import { Grid, Card, Button } from '@material-ui/core';
import WeatherCard from '../common/weatherCard';
import { Link, useLocation } from 'react-router-dom';
import Search from './search';

const apiKey = 'kOdKspDcsGUtGNMM4aCQprGSrWMgGCAV';

const Home = () => {

    const { favorites, setFavorites } = useContext(FavoriteContext);

    const location = useLocation();

    const [options, setOptions] = useState([{ key: '', city: '', country: '' }]);
    const [existingName, setExistingName] = useState(false);
    const [searchValue, setSearchValue] = useState(false);
    const [weatherValue, setWeatherValue] = useState({ country: '', city: '', temperatureC: '', temperatureF: '', tempValue: '', currentDay: '', iconText: '', icon: '', description: '', lastTimeCheck: '' })
    const [weatherFiveDay, setWeatherFiveDay] = useState([]);
    const [favoriteAlarm, setFavoriteAlarm] = useState(false)

    useEffect(() => {
        console.log(location.state)
        if (location.state) {
            setCitiesToOptionsFromFavorite(location.state)
        }
    }, [location])

    const setCitiesToOptionsFromFavorite = (value) => {

        if (value !== '') {
            fetch(`https://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=${apiKey}&q=${value.city}`)
                .then(res => res.json()).then(data => {
                    console.log(data)
                    getInfoWithKey(data.filter(d => {
                        return d.Key === value.key
                    })
                    )
                })
        }
    }

    const setCitiesToOptions = (e) => {
        const newCitiesArr = [];
        const { value } = e.target;
        if (value !== '') {
            fetch(`https://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=${apiKey}&q=${value}`)
                .then(res => res.json()).then(data => {
                    console.log(data)
                    data.map(d => {
                        newCitiesArr.push({ key: d.Key, city: d.LocalizedName, country: d.Country.LocalizedName })
                    })
                }).then(() => setOptions([...newCitiesArr]))
        }
    }

    const getInfoWithKey = (value) => {
        let v = value[0];
        v.key = value[0].Key;
        v.country = value[0].Country.LocalizedName;
        v.city = value[0].LocalizedName;
        getInfo(v);
    }

    const getInfoWithValue = (v, value) => {
        getInfo(value);
    }

    const getInfo = (value) => {
        setWeatherFiveDay([])
        console.log(value)
        if (value !== null) {
            setSearchValue(true)
            let wetherApi = `https://dataservice.accuweather.com/currentconditions/v1/${value.key}?apikey=${apiKey}&language=He`;
            let fiveDaysApi = `https://dataservice.accuweather.com/forecasts/v1/daily/5day/${value.key}?apikey=${apiKey}&language=He`;
            fetch(wetherApi)
                .then(response => response.json())
                .then(data => {
                    console.log('we are get res')
                    let description = data[0].WeatherText;
                    let icon = data[0].WeatherIcon;
                    let iconText = data[0].WeatherText;
                    let temperatureC = data[0].Temperature.Metric.Value;
                    let temperatureF = data[0].Temperature.Imperial.Value;
                    let tempValue = 'C';
                    let lastTimeCheck = checkTime(data[0].LocalObservationDateTime);
                    let currentDay = getDateInHebrew(data[0].EpochTime)
                    let city = value.city;
                    let country = value.country;
                    let key = value.key
                    setWeatherValue({ key, country, city, temperatureC, temperatureF, tempValue, icon, iconText, description, lastTimeCheck, currentDay })
                    console.log(data)
                })
                .catch(err => console.log(err))
            fetch(fiveDaysApi)
                .then(response => response.json())
                .then(data => {

                    let thoseDays = data.DailyForecasts;
                    console.log(thoseDays)
                    thoseDays.map(day => {
                        let newDay = {
                            day: getDateInHebrew(day.Date),
                            tempMin: (((day.Temperature.Minimum.Value - 32) * 5) / 9).toFixed(),
                            tempMax: (((day.Temperature.Maximum.Value - 32) * 5) / 9).toFixed(),
                            icon: day.Day.Icon,
                            description: day.Day.IconPhrase
                        }
                        setWeatherFiveDay(preValue => {
                            return [...preValue, newDay]
                        })
                    })
                })
                .catch(err => console.log(err))
        }
    }

    const getDateInHebrew = (date) => {
        let newDate = new Date(date)
        let day = newDate.getDay();
        let hebrewDate = '';
        switch (day) {
            case 0:
                hebrewDate = 'ראשון';
                break
            case 1:
                hebrewDate = 'שני';
                break
            case 2:
                hebrewDate = 'שלישי';
                break
            case 3:
                hebrewDate = 'רביעי';
                break
            case 4:
                hebrewDate = 'חמישי';
                break
            case 5:
                hebrewDate = 'שישי';
                break
            case 6:
                hebrewDate = 'שבת';
                break
            default: return null
        }
        return hebrewDate;
    }

    const checkTime = (date) => {
        let d = new Date(date)
        let time = d.getHours() + ':' + (d.getMinutes() < 10 ? ('0' + d.getMinutes().toString()) : d.getMinutes())
        return time
    }

    const changeTemp = (value) => {
        if (value === 'C') {
            setWeatherValue(preValue => {
                return { ...preValue, tempValue: 'F' }
            })
            let newTemp = [...weatherFiveDay]
            newTemp.forEach(day => {
                day.tempMax = ((day.tempMax * 9) / 5 + 32).toFixed()
                day.tempMin = ((day.tempMin * 9) / 5 + 32).toFixed()
            })
            setWeatherFiveDay([...newTemp])
        } else {
            setWeatherValue(preValue => {
                return { ...preValue, tempValue: 'C' }
            })
            let newTemp = [...weatherFiveDay]
            newTemp.forEach(day => {
                day.tempMax = (((day.tempMax - 32) * 5) / 9).toFixed();
                day.tempMin = (((day.tempMin - 32) * 5) / 9).toFixed();
            })
            setWeatherFiveDay([...newTemp])
        }

    }

    const pushToFavorites = (value) => {

        if (value) {
            if (searchValue) {
                let favoriteFlag = favorites.find(favorite => {
                    return favorite.key === value.key
                })
                if (!favoriteFlag) {
                    setFavorites(preValue => {
                        return [...preValue, value]
                    })
                    setExistingName(false)
                    setFavoriteAlarm(true)
                } else {
                    setFavoriteAlarm(false)
                    setExistingName(true)
                }
            }
        }
    }

    return (
        <div style={{ display: 'flex', textAlign: 'center', padding: '1rem', flexDirection: 'column' }}>
            <header style={{ fontSize: '3rem' }} > The Weather</header>
            <h1>Home</h1>
            <Grid container spacing={5} direction={"row-reverse"}>
                <Grid item
                    xs={false} sm={false} md={4} lg={4} xl={4}
                >
                    <div></div>
                </Grid>
                <Grid item style={{ textAlign: 'center' }}
                    xs={10} sm={10} md={4} lg={4} xl={4}
                >
                    <Search onChange={setCitiesToOptions} options={options} getInfo={getInfoWithValue} onClick={() => console.log(weatherValue)}
                    />
                </Grid>
                <Grid item
                    xs={12} sm={12} md={4} lg={4} xl={4}
                >
                    <div style={{ display: 'flex', flexDirection: 'row-reverse', textAlign: 'center', justifyContent: 'space-evenly' }}>
                        {searchValue ? <Button
                            onClick={() => pushToFavorites(weatherValue)}
                            style={{ color: 'black', border: '1px black solid', backgroundColor: 'white', padding: '1rem' }}>
                            הוסף למועדפים
                    </Button>
                            : <Button
                                disabled
                                style={{
                                    padding: '1rem',
                                    color: 'black',
                                    border: '1px black solid', backgroundColor: 'gray'
                                }}>
                                הוסף למועדפים
                    </Button>
                        }
                        <Link to={{ pathname: '/favorites', state: favorites }}>
                            <Button style={{ padding: '1rem', color: 'black', border: '1px black solid', backgroundColor: 'white' }}>עבור למועדפים</Button>
                        </Link>
                    </div>
                </Grid>
            </Grid>
            <div style={{ backgroundColor: '#90EE90', marginTop: '1rem', padding: '0 2rem 0 2rem', borderRadius: '2rem' }}>
                <span>{existingName && 'שם העיר כבר קיים במועדפים שלך'}
                    {favoriteAlarm && 'שם העיר נוסף למועדפים שלך'}
                </span>
            </div>



            {weatherValue.city ? <Card style={{ margin: '2rem 0 1rem 0', textAlign: 'center' }}>
                <Grid container direction={'row-reverse'} style={{ padding: '2rem' }}>
                    <Grid item style={{ textAlign: 'right' }}
                        xs={12} sm={12} md={6} lg={6} xl={6}
                    >

                        <h1>{weatherValue.city}</h1>
                        <h4>{weatherValue.country}</h4>
                        <div>
                            <span>יום {weatherValue.currentDay}, </span>
                            <span>נכון לשעה {weatherValue.lastTimeCheck}</span>
                        </div>

                    </Grid>
                    <Grid item style={{ textAlign: 'center' }}
                        xs={12} sm={12} md={6} lg={6} xl={6}
                    >
                        <div style={{ display: 'flex', padding: '2rem 5rem 2rem 5rem', flexDirection: 'row-reverse', textAlign: 'right' }}>

                            <div style={{ flex: '1', display: 'flex', textAlign: 'center', justifyContent: 'center', alignItems: 'center' }}>
                                <div >
                                    <img src={weatherValue.city && `https://www.accuweather.com/images/weathericons/${weatherValue.icon}.svg`} style={{ height: '10rem' }} />
                                </div>
                                <span>{weatherValue.description} </span>
                            </div>
                        </div>
                    </Grid>
                </Grid>
                {weatherValue.tempValue === 'C' ?
                    <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
                        <span>{weatherValue.temperatureC}°</span>
                        <Button onClick={() => changeTemp(weatherValue.tempValue)}
                        >C°
                            </Button>
                    </div>
                    :
                    <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
                        <span>{weatherValue.temperatureF}°</span>
                        <Button onClick={() => changeTemp(weatherValue.tempValue)}
                        >F°
                            </Button>
                    </div>
                }
            </Card> : <Card style={{ height: '20rem', margin: '2rem 0 1rem 0', textAlign: 'center' }}>
                </Card>}
            {
                weatherFiveDay &&
                <div style={{ display: 'flex', flexDirection: 'row-reverse', justifyContent: 'space-between' }}>
                    {weatherFiveDay.map(day => {
                        return <WeatherCard key={day.day} day={day.day} temperatureMax={day.tempMax} temperatureMin={day.tempMin}
                            url={day.icon}
                            description={day.description} />
                    })}
                </div>
            }
        </div >
    )
}

export default Home;