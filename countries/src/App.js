import React, { useState, useEffect } from 'react'
import axios from 'axios'
//didn't do 2.14 cause I didn't want to sign up
// There is still a bug in my code. The show button state doesn't reset when I change the search option
const Filter = ({ filter, changeFilter }) => {
  return (
    <div>
      <input value={filter} onChange={changeFilter}></input>
    </div>
  )
}

const List = ({ countries, filter }) => {
  let reg = new RegExp(filter, 'gi')
  let filteredCountries = countries.filter(country => reg.test(country.name))
  // If more than 10 countries fit the filter, tell user to make filter more specific
  if (filteredCountries.length > 10) {return <div>Too many matches, make filter more specific!</div>}
  // If there is an exact match, return more information on the country
  if (filteredCountries.length === 1) {return <CountryInformation country={filteredCountries[0]} />}
  
  // Display list if there are 10 countries or less, granted that it's not one country
  return <MultipleCountries filteredCountries={filteredCountries} />
}

const MultipleCountries = ({ filteredCountries }) => {
  return (
    <div>
      <ul>
        {filteredCountries.map(( country, index ) => {
          return <li key={index} >{country.name} <Button country={country} /> </li>
        })} 
      </ul>
    </div>
  )
}

const CountryInformation = ({ country }) => {
  return (
    <div>
      <h2>{country.name}</h2>
      <p>capital: {country.capital}</p>
      <p>population: {country.population}</p>
      <br />
      <h3>languages</h3>
      <ul>
        {country.languages.map((language, index) => <li key={index}>{language}</li>)}
      </ul>
      <br />
      <img src={country.flag} alt="Flag of country" style={{width: 300}} />
    </div>
  )
}

const Button = ({ country }) => {
  const [button, setButton] = useState(false)
  //create state for the button, show more info on country when button is clicked
  const click = () => {
    setButton(!button)
  }
  //if button value is false, just show the button, nothing else
  if (!button) {return <div><button onClick={click}>Show</button></div>}

  return (
    <div>
      <button onClick={click}>Unshow</button>
      <CountryInformation country={country} />
    </div>
  )
}


const App = () => {

  const [ countries, setCountries ] = useState([])
  const [ filter, setFilter ] = useState([])

  const hook = () => {
    console.log('effect')
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        console.log('promise fulfilled')
        setCountries(response.data.map(country => {
          let countryObj = {};
          countryObj.name = country.name
          countryObj.capital = country.capital
          countryObj.population = country.population
          countryObj.languages = country.languages.map(language => language.name)
          countryObj.flag = country.flag
          return countryObj 
        }))
      })
  }

  useEffect(hook, [])

  const changeFilter = (event) => {
    setFilter(event.target.value)
  }

  return (
    <div>
      find countries <Filter filter={filter} changeFilter={changeFilter} />
      <List countries={countries} filter={filter} />
    </div>
  );
}

export default App;
