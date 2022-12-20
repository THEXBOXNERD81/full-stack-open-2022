import { useState, useEffect } from 'react'
import noteService from './services/persons'


const Filter = ({search, setSearch}) => {
  return(
    <div>filter shown with  
      <input 
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
    </div>
  )
}

const Notice = ({notification}) => {
  if (notification === null) {
    return null
  }


  return (
    <div className='notice'>
      added {notification} to phonebook
    </div>
  )
}

const Error = ({ error }) => {
  if (error === null){
    return null
  }
  return (
    <div className='error'>
      {error}
    </div>
  )
}

const PersonForm = ({onSubmit, nameValue, numberValue, onNameChange, onNumberChange}) => {

  return(
    <form onSubmit={onSubmit}>
      <div>
        name: 
        <input 
          value={nameValue}
          onChange={onNameChange}
        />
      </div>
      <div>number: 
        <input 
          value={numberValue}
          onChange={onNumberChange}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = ({ filteredPersons, search, persons, setPersons, handleRemove}) => {


    const personToShow = search==='' ? persons.map(({ name, number, id }) => {
          return(<div key={id}>
            {name + ' ' + number}
            <button onClick={handleRemove(id, name)}>delete</button>            
            </div>)
        }) : filteredPersons.map(({ name, number, id }) => {
          return(<div key={id}>
            {name + ' ' + number}
            <button onClick={handleRemove(id, name)}>delete</button>
            </div>)
        })
    return (
      <>
        {personToShow}
      </>
    )

}
 

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')
  const [notification, setNotification] = useState(null)
  const [error, setError] = useState(null)

  const hook = () => {
    noteService
      .getAll()
      .then(response => {
        setPersons(response)
      })
  }

  useEffect(hook, [])

  const addContent = (e) => {
    e.preventDefault()
    const contentObject = {
      name: newName,
      number: newNumber
    }
    const foundPerson = persons.find(person => person.name === newName)
    if (persons.some(person => person.name === newName)) {
      if (window.confirm(newName + ' is already added to phonebook, replace old number with a new number')){
        noteService
          .update(foundPerson.id, contentObject)
          .then(response => {
            setPersons(persons.map(person => (person.id !== foundPerson.id ? person : response)))
          })
          .catch(error => {
            console.log(error.response.data.error)
            setError(error.response.data.error)
            setTimeout(() => {
              setError(null)
            }, 5000)
        })
      } 
    }
    else{
      noteService
        .create(contentObject)
        .then(response => {
          setPersons(persons.concat(response))
          setNewName('')
          setNewNumber('')
          setNotification(newName)
          setTimeout(() => {
            setNotification(null)
          }, 5000)
        })
        .catch(error => {
          console.log(error.response.data.error)
          setError(error.response.data.error)
          setTimeout(() => {
            setError(null)
          }, 5000)
        })

    }
  }

  const handleNewName = (e) => {
    setNewName(e.target.value)
    
  }

  const handleNewnumber = (e) => {
    setNewNumber(e.target.value)
  }

  const filteredPersons = persons.filter(person => {
    return person.name.toLowerCase().includes(search.toLowerCase());
  });

  const handleRemove = (id, name) => () => {
    if (window.confirm(`delete ${name}?`)) {
      noteService
        .remove(id)
        .then(response => {
          setPersons(persons.filter(person => person.name !== name))
        })
    }
  }  

  return (
    <div>
      <h2>Phonebook</h2>
      <Notice notification={notification} />
      <Error error={error}/>
      <Filter setSearch={setSearch} value={search}/>
      <h2>add a new</h2>
      <PersonForm nameValue={newName} numberValue={newNumber} onSubmit={addContent} onNameChange={handleNewName} onNumberChange={handleNewnumber}/>
      <h2>Numbers</h2>
      <Persons persons={persons} search={search} filteredPersons={filteredPersons} setPersons={setPersons} handleRemove={handleRemove}/>
    </div>
  )
}

export default App