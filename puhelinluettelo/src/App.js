import React, { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services/persons'

const Filter = (props) =>{
  const { newSearch, handleSearch} = props
  return (
    <div>
      rajaa näytettäviä<input value={newSearch} onChange={handleSearch}/>
    </div>        
  )
}

const PersonForm = (props) => {
  const  {addName, newName, newNumber, persons, 
    handleNameChange, handleNumberChange} = props
  
  return (
    <form onSubmit={addName}>
    <div>
      nimi: <input value={newName} onChange={handleNameChange}/>
    </div>
    <div>
      numero: <input value={newNumber} onChange={handleNumberChange}/>
    </div>
    <div>
      <button type="submit">lisää</button>
    </div>
  </form>
  )  
}

const Persons = (props) => {
  const {persons, newSearch, handleClick} = props
  
  return(
    <div>
      {persons.filter(p => p.name
      .toLowerCase().indexOf(newSearch)>=0)
      .map(person => <li key={person.name}>
        {person.name} {person.number} <button onClick=
            {handleClick(person.name, person.id)}>poista</button></li>)}
    </div>    
  )
}

const Notification = ({ message }) => {
  if(message === null) {
    return null
  }

  return (
    <div className='success'>
      {message}
    </div>
  )
}

const FailureNotification = ({ message }) => {
  if(message === null) {
    return null
  }

  return (
    <div className = 'failure'>
      {message}
    </div>
  )
}

const App = () => {
  const [ persons, setPersons] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ newSearch, setNewSearch ] = useState('')
  const [successMessage, setSuccesMessage ] = useState(null)
  const [ failureMessage, setFailureMessage ] = useState(null) 

  useEffect(() => {
    console.log('effect')
    personService
      .getAll()
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response.data)
      })
  }, [])  
  
  const addName = (event) => {
    event.preventDefault()
    const nameObject = {
      name: newName,
      number: newNumber
    }

    if(persons.find(p => p.name === newName)){
      if(window.confirm(`${newName} on jo luettelossa,
        korvataanko vanha numero uudella?`)){
          const oldId = persons.filter(person => person.name === newName)
          console.log(oldId[0].id)          
          const vali = persons.filter(person => person.id !== oldId[0].id)
          personService
            .update(oldId[0].id, nameObject)
            .then(response => {
              console.log('promise fulfilled')
              setPersons(vali.concat(response.data))
              setSuccesMessage(`Korvattiin ${newName}` )
            })
      }      
    } else  {
      personService
        .create(nameObject)
        .then(response => {
          console.log('promise fulfilled')
          setPersons(persons.concat(response.data))
          setSuccesMessage(`Listättiin ${newName}`)
        })
        .catch(error => {
          setFailureMessage(error.response.data.error)
          setTimeout(() => {
            setFailureMessage(null)
          }, 2000)
        })      
    }
    setTimeout(() => {
      setSuccesMessage(null)
    }, 2000)
    setNewName('')
    setNewNumber('')    
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearch = (event) => {
    setNewSearch(event.target.value)   
  }

  const handleClick = (name, id) => (event) => {
    if(window.confirm(`Poistetaanko ${name}`)){
      const delName = name
      const vali = persons.filter(person => person.id !== id)    
      personService
        .dele(id)
        .then(response => {
          console.log('promise fulfilled')
          setPersons(vali)
          setSuccesMessage(`Poistettiin ${delName}`)
          setTimeout(() => {
            setSuccesMessage(null)
          }, 2000)
      })
    }    
  }

  return (
    <div>
      <h2>Puhelinluettelo</h2>

      <Notification message={successMessage} />

      <FailureNotification message={failureMessage} />

      <Filter newSearch={newSearch} 
        handleSearch={handleSearch}/>

      <h3>lisää uusi</h3>  

      <PersonForm addName={addName} newName={newName} 
        newNumber={newNumber} persons={persons}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}/>            
      
      <h3>Numerot</h3>

      <Persons persons={persons} newSearch={newSearch}
        handleClick={handleClick} />
      
    </div>
  )

}

export default App