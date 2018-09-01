import React from 'react'
import Persons from './components/Persons.js'
import Form from './components/Form.js'
import Filter from './components/Filter.js'
import personsService from './services/Persons.js'
import shortid from 'shortid'
import Success from './components/Success.js'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      persons: null,
      newName: '',
      newNumber:'',
      filter:'',
      nameError:false,
      existingUser:{},
      show:false,
      successMsg: ''
    }
    this.submitForm = this.submitForm.bind(this)
    this.nameInputChange = this.nameInputChange.bind(this)
    this.phoneInputChange = this.phoneInputChange.bind(this)
    this.filterInputChange = this.filterInputChange.bind(this)
    this.deletePerson = this.deletePerson.bind(this)
    this.getPersons = this.getPersons.bind(this)
    this.addPerson = this.addPerson.bind(this)
    this.updatePerson = this.updatePerson.bind(this)
    this.resetNotification = this.resetNotification.bind(this)
  }

  componentWillMount() {
    this.getPersons()
  }

  getPersons() {
    personsService.getAll().then(res => {
      if(res.status === 200) {
        this.setState({
          persons:res.data
        })
      }
    })
  }

  submitForm(e) {
    e.preventDefault()
    const newNameObj = {
      name:this.state.newName,
      phone:this.state.newNumber
    }
    
    if(!this.state.nameError) {
      newNameObj.id = shortid.generate()
      this.addPerson(newNameObj)
    } else {
      this.updatePerson(this.state.newNumber)
    }
  }

  addPerson(personObj) {
    personsService.create(personObj).then(res => {
      if(res.status === 200) {
        this.setState({
          newName:'',
          newPhone:'',
          show:true,
          successMsg: `Lisättin ${personObj.name}`
        })
        this.getPersons()
        document.querySelector('.phone-form').reset()
        this.resetNotification(1000)
      }
    })
  }

  updatePerson(newNum) {
    if (window.confirm(`Haluatko päivittää henkilön: ${this.state.existingUser.name} numeron?`)) { 
      const updatedPerson = {...this.state.existingUser}
      updatedPerson.phone = newNum
      personsService.update(updatedPerson.id,updatedPerson).then(res => {
        if(res.status === 200) {
          this.setState({
            existingUser: {},
            newName:'',
            newPhone:'',
            show:true,
            successMsg: `Päivitettiin ${updatedPerson.name}`
          })
          this.getPersons()
          document.querySelector('.phone-form').reset()
        }
      }).catch(err => {
        this.setState({
          show:true,
          successMsg: `Käyttäjää ${updatedPerson.name} ei enää löydy.`,
          notificationColor: 'darkRed'
        })
      })
      this.resetNotification(1000)
    }
  }

  nameInputChange(e) {
    const alreadyExists = this.state.persons.filter((person) => {
      return person.name.toLocaleLowerCase() === e.target.value.toLocaleLowerCase()
    })
    
    if(alreadyExists.length > 0) {
      this.setState({
        nameError: true,
        existingUser: alreadyExists[0]
      })
    } else {
      this.setState({
        newName: e.target.value,
        nameError: false
      })
    }
  }

  phoneInputChange(e) {
    this.setState({
      newNumber:e.target.value
    })
  }

  filterInputChange(e) {
    this.setState({
      filter:e.target.value
    })
  }

  deletePerson(e) {
    const id = e.currentTarget.dataset.personId;
    const person = this.state.persons.filter(person => person.id.toString() === id)
    
    if (window.confirm(`Haluatko poistaa henkilön: ${person[0].name}?`)) { 
      personsService.deletePerson(id).then(res => {
        if(res.status === 200) {
          this.getPersons()
          this.setState({
            show:true,
            successMsg: `Poistettiin ${person[0].name}`
          })
        }
      }).catch(err => {
        this.setState({
          show:true,
          successMsg: `Käyttäjää ${person[0].name} ei enää löydy.`,
          notificationColor: 'darkRed'
        })
      })
      this.resetNotification(1000)
    }
  }

  resetNotification(time) {
    const timeOut = typeof time === 'undefined' ? 1000 : time
    setTimeout(() => {
      this.setState({
        show:false,
        successMsg: '',
        notificationColor: ''
      })
    }, timeOut);
  }

  render() {
    return (
      <div className='app-container'>
        <Success show={this.state.show} message={this.state.successMsg} color={this.state.notificationColor} />
        <h1>Puhelinluettelo</h1>
        <Filter filterInput={this.filterInputChange} />
        <Form submit={this.submitForm} phoneInput={this.phoneInputChange} nameInput={this.nameInputChange}/>
        <h1>Numerot</h1>
        <Persons filter={this.state.filter} persons={this.state.persons} deletePerson={this.deletePerson}/>
      </div>
    )
  }
}

export default App