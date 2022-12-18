import { useState, useEffect } from 'react'
import axios from 'axios'

const Filter = ({ search, setSearch}) => {
  return(
    <>
      <div>
        Filter Country:  
        <input 
          value={search} 
          onChange={(e)=> {setSearch(e.target.value)}} 
        />
      </div>
      {}
    </>
  )
}


const Countries = ({filteredCountries, search, countries, setSearch, setWeather, weather}) => {
  

  const showCountry = 
        filteredCountries.length > 10 
          ? <p>Too many matches, specify</p> 
          : filteredCountries.length === 1 
            ? <div>
                <h1>{filteredCountries[0].name.common}</h1>
                <p>Capitol: {filteredCountries[0].capital}</p>
                <p>Area: {filteredCountries[0].area}</p>
                <h4>languages</h4>
                <ul>
                  {Object.values(filteredCountries[0].languages).map((language => {
                    return <li key={language}>{language}</li>
                  }))}
                </ul>
                <img src={filteredCountries[0].flags.png} alt="country flag" />
                <h2>Weather in {filteredCountries[0].capital}</h2>
                <p>temp: {weather.main.temp} Celsius</p>
                {console.log('W',weather)}
                <p>wind: {weather.wind.speed} m/S</p>
              </div>
            
          : filteredCountries.map((country, i) => {
          return(
            <div key={i}>
              {country.name.common}
              <button onClick={() => {setSearch(country.name.common)}}>Show</button>
            </div>
            )
        })  

  
  return(
    <>
      {showCountry}
    </>
  )
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')
  const [weather, setWeather] = useState([])
  const [shift, setShift] = useState(true)


  const filteredCountries = countries.filter(country => {
    return country.name.common.toLowerCase().includes(search.toLowerCase())
  }
  );

useEffect(()=> {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(respone =>  {
        setCountries(respone.data)
      })
  }, [])
  
  const API_KEY = '97174bc49f896e07bfca4c3439f5a8ba'
  useEffect(() => {

    if (filteredCountries.length>1) {
      setShift(true)
    }

    if (filteredCountries.length===1 && shift===true) {
      axios
      // GETING 401 UNATHORIZED ERROR CODE
        .get(`https://api.openweathermap.org/data/2.5/weather?lat=${filteredCountries[0].latlng[0]}&lon=${filteredCountries[0].latlng[1]}&appid=${API_KEY}`)
        .then(response => {
          console.log(response.data)
          setWeather(response.data)
        })
      setShift(false)
    }
  }, [filteredCountries, setWeather, setShift, shift])

  

  return (
    <>
      <Filter countries={countries} value={search} setSearch={setSearch} />
      <Countries filteredCountries={filteredCountries} countries={countries} search={search} setWeather={setWeather} setSearch={setSearch} weather={weather}/>
    </>
    )
}

export default App;
