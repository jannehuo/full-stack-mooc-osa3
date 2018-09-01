import React from 'react'
/** Paketti id kenttien luontiin  */
import shortid from 'shortid'

const Persons = ({persons,filter, deletePerson}) => {
  let personsElements
  
  if(!persons) {
    personsElements = '<div>...</div>'
  } else {
    const personsList = filter.length > 0 ? 
                      persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase())) :
                      persons;

    personsElements = personsList.map((person) => {
      return <Person key={shortid.generate()} person={person} deletePerson={deletePerson}/>
    });
  }
  return (
    <div>{personsElements}</div>
  )
}

const Person = ({person,deletePerson}) => {
  return (
    <p className='person-row'>{person.name} {person.phone} <button className='delete-button' data-person-id={person.id} onClick={deletePerson}>Poista</button></p>
  )
}

export default Persons