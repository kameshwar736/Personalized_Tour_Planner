import React, { useContext, useEffect, useState } from 'react'
import GalleryContext from '../context/GalleryContext'
import { data } from 'react-router-dom'

const AboutDesti = () => {

    const [detail, setDetail] = useState({})
    const [weather,setWeather] = useState({city : "" , minTemp : "" ,maxTemp : "",temp : "" ,fellLike : "",humidity : "",windSpeed : "" ,weather : ""})

    const weatherApi = import.meta.env.VITE_WEATHER_API_KEY

    const fetchWeather = async (city) => {
        try {
            const res = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApi}&units=metric`
            )
            const data = await res.json()
            console.log(data);
            setWeather({...weather,city : data.name , minTemp : data.main.temp_min , maxTemp : data.main.temp_max , temp :data.main.temp , fellLike : data.main.feels_like , humidity : data.main.humidity , windSpeed : data.wind.speed , weather : data.weather[0].main })
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        const getData = JSON.parse(localStorage.getItem("tempData"))
        console.log(getData);
        
        setDetail(getData)

        if (getData?.name) {
            fetchWeather(getData.name)
        }
    }, [])



    console.log(weather);
    



    return (
        <>
            <div>
                <div>
                    <h1>{detail?.name}</h1>
                    <p>{detail?.state}</p>
                </div>
                <div className='flex flex-wrap gap-2'>
                    {
                        detail?.image?.map((e, i) => (
                            <img src={e} alt="img" key={i + 1} className='w-100 h-100' />
                        ))
                    }
                </div>

                <div>
                    <p>{detail?.description}</p>
                    <p>best Season : {detail?.bestSeason}</p>
                    <p>Price per Day (Approx) : {detail?.pricePerDay}</p>
                    <p>Rating : {detail?.rating}</p>
                </div>

                <div>
                    <h1>Weather</h1>
                    <p>Location : {weather.city}</p>
                    <p>temp : {weather.temp}</p>
                    <p>min_temp : {weather.minTemp}</p>
                     <p>min_temp : {weather.maxTemp}</p>
                     <p>fell like : {weather.fellLike}</p>
                     <p>humidity : {weather.humidity}</p>
                      <p>windSpeed : {weather.windSpeed}</p>
                       <p>weather : {weather.weather}</p>
                </div>
            </div>
        </>
    )
}

export default AboutDesti