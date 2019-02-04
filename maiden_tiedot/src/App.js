import React, { useState, useEffect } from 'react';
import axios from 'axios'

const App = () => {
  const [countries, setCountries] = useState([])
  const [newSearch, setNewSearch] = useState('')
  

  useEffect(() => {
    console.log('effect')
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        console.log('promise fulfilled')
        setCountries(response.data)
      })
  }, [])

  const handleSearch = (event) => {
    setNewSearch(event.target.value)
  }

 

  const handleClick = (name) => (event) => {
    setNewSearch(name)    
  } 

  if(countries.filter(c => c.name
    .toLowerCase().startsWith(newSearch.toLowerCase()))
    .length > 10) {
    return (
      <div>
        <h2>find countries</h2>
        <input value={newSearch} onChange={handleSearch}/> 
        <li>Too many matches, specify another filter</li>
      </div>
    )
  } else if(countries.filter(c => c.name.toLowerCase()
    .startsWith(newSearch.toLocaleLowerCase()))
    .length === 1){
       
      const country = countries
        .filter(c => c.name.toLowerCase()
        .startsWith(newSearch.toLocaleLowerCase()))
       console.log(country[0].capital)
      
      const data = {} 

        useEffect(() => {
          console.log('effect')
          axios
            .get(`http://api.apixu.com/v1/current.json?key=47caea29a57440a0a95143623192801&q=${country[0].capital}`)
            .then(response => {
              console.log('promise fulfilled')
              data = response.data.json()
              console.log(data)
              
            })
        }, [])
        
      
      
       
        
        

    return (
      <div>
        <h2>find countries</h2>
        <input value={newSearch} onChange={handleSearch}/>
        <h1>{country[0].name}</h1>
        <li>capital {country[0].capital}</li>
        <li>population {country[0].population}</li>
        <h2> languages</h2>
        {country[0].languages.map(language => <li key={language.name}>{language.name}</li>)}
        <img src = {country[0].flag}/>
        <h2> Weather in {country[0].capital}</h2>
        <h3>temperature: {data.current.temp_c}</h3>

      </div>
    )
  } else {
    return (
      <div>
        <h2>find countries</h2>
        <input value={newSearch} onChange={handleSearch}/>
        {countries.filter(c => c.name.toLocaleLowerCase()
          .startsWith(newSearch.toLocaleLowerCase()))
          .map(c => <li key={c.name}>{c.name} <button onClick=
            {handleClick(c.name)}>show</button></li>)}
      </div>
    )
  } 
}

export default App;
