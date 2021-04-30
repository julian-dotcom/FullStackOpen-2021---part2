import React, { useState, useEffect } from 'react'
import axios from 'axios'
import personsService from './services/persons'
const baseUrl = 'http://localhost:3001/persons'

//completed 2.6-2.10
const Filter = ({ filter, changeFilter }) => {
  return (
    <div>
      filter by name <input value={filter} onChange={changeFilter}/>
    </div>
  )
}

const Form = (props) => {
  return (
    <form onSubmit={props.addEntry}>
    <div>
      name: <input value={props.newName} onChange={props.handleNameChange}/>
    </div>
    <div>
      number: <input value={props.newNumber} onChange={props.handleNumberChange}/>
    </div>

    <div>
      <button type="submit">add</button>
    </div>
  </form>
  )
}

const List = ({ persons, filter, removeEntry }) => {
  filter = filter.toLowerCase()
  if (filter !== '') {
    persons = persons.filter(person => person.name.toLowerCase().includes(filter))
  }
  return (
    <div>
      <ul>
        {persons.map((person, i) => {
          return (
                  <div>
                    <li key={i}>{person.name} - {person.number}</li> <DeleteButton id={person.id} removeEntry={removeEntry} />
                  </div>
                ) 
        })} 
      </ul>
  </div>
  )
}

const DeleteButton = ({ id, removeEntry }) => {
  return <button onClick={() => removeEntry(id)} value={id}>delete</button>
}

const Message = ({ successMessage, updateError }) => {
  const successStyle = {
    color: 'green',
    fontStyle: 'italic',
    fontSize: 40,
    borderRadius: 5,
    backgroundColor: 'gainsboro',
    textAlign: 'center',
    border: '3px solid green'
  }
  const updateErrorStyle = {
    color: 'red',
    fontStyle: 'italic',
    fontSize: 40,
    borderRadius: 5,
    backgroundColor: 'gainsboro',
    textAlign: 'center',
    //borderColor: 'green',
    border: '3px solid red'    
  }
  if (successMessage === false && updateError === false) {
    return null
  }
  else if (successMessage === true) {
    return (
      <div style={successStyle}>
        You successfully created a new entry.
      </div>
    )
  }
  else if (updateError === true) {
    return (
      <div style={updateErrorStyle}>
        Error: Entry has already been removed from server!
      </div>
    )   
  }
}

const App = () => {
  const [ persons, setPersons ] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ filter, setNewFilter ] = useState('')
  const [ successMessage, setSuccess ] = useState(false)
  const [ updateError, setUpdateError ] = useState(false)

  //fetching data from server
  const hook = () => {
    //console.log('effect')
    axios
      .get(baseUrl)
      .then(response => {
        //console.log('promise fulfilled')
        setPersons(response.data)
        //console.log(persons)
      })
  }
  
  useEffect(hook, [])
  
  const removeEntry = (val) => {
    let toRemove = persons.filter(person => parseInt(val) === person.id)[0]
    window.confirm(`Delete person ${toRemove.name}`)
    personsService
      .remove(toRemove.id)
      .then(response => hook())
      .catch(err => console.log(err))
  }

  const addEntry = (event) => {
    event.preventDefault();

    //check if number is already in phonebook
    if ((persons.map(person => person.number)).includes(newNumber)) {
      window.alert(`${newNumber} is already added to phonebook`);
      return;
    }    
    // Check if phone number is actually numeric or not
    if (isNaN(parseFloat(newNumber))) {
      window.alert('Please enter a valid number. No hyphons, spaces or other non-numeric values.');
      return
    }
    // Check for if person's name is already in phonebook. If it is, just update the number.
    const found = persons.find(person => person.name === newName);
    if (found) {
      updateEntry(found);
      return
    }

    // POST new person to server, imported from persons.jsv !!!
    personsService
      .create(newName, newNumber)
      .then(response => hook()) //update persons from backend

    // Reset the entry states so that a new entry or filter can be created
    setNewName('');
    setNewNumber('');
    setNewFilter('');
    setSuccess(true); //show success message when new entry was successful
    setTimeout(() => {
      setSuccess(false)
    }, 5000 ) //remove success message after 5 seconds
  }

  const updateEntry = (found) => {
    // Check for if person's name is already in phonebook. If it is, just update the number.
    window.confirm(`${newName} is already in phonebook. Would you like to replace the old number with the new number?`)
    const updatedPerson = {...found, number: newNumber};
    personsService
      .update(found.id, updatedPerson)
      .then(returnedPerson => {
        console.log('returnedPerson: ', returnedPerson);
        setPersons(persons.map(person => person.id !== found.id ? person : returnedPerson));
    })
      .catch(err => {
        setUpdateError(true);
        setTimeout(() => {
          setUpdateError(false)
        }, 5000)
      })
    return
  }

  


  const handleNameChange = (event) => {
    setNewName(event.target.value);
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  }

  const changeFilter = (event) => {
    setNewFilter(event.target.value);
  }


  return (
    <div>
      <h2>Phonebook</h2>
      <Message successMessage={successMessage} updateError={updateError} />
      <Filter filter={filter} changeFilter={changeFilter} />
      <h2>add new</h2>
      <Form newName={newName} newNumber={newNumber} addEntry={addEntry} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <List persons={persons} filter={filter} removeEntry={removeEntry}/>
    </div>
  )
}

export default App