const express = require('express')
const app = express()
const PORT = 3001 || process.env.PORT
const bodyParser = require('body-parser')
var morgan = require('morgan')
const persons = require('./modules/persons.js')

app.use(bodyParser.json())

morgan.token('postData', (req,res) => {
  return JSON.stringify(req.body);
})

app.use(morgan(':method :url :postData :status :res[content-length] - :response-time ms'))

app.get('/api/persons', (req,res) => {
  res.send(persons)
})

app.get('/api/persons/:id', (req,res) => {
  const id = Number(req.params.id)
  const person = persons.persons.find(p => p.id === id)
  res.send(person)
})

app.delete('/api/persons/:id', (req,res) => {
  const id = Number(req.params.id)
  persons.persons = persons.persons.filter(p => p.id !== id)
  res.send(persons)
})

app.post('/api/persons', (req,res) => {
  let person = req.body
  const existing = persons.persons.filter(p => p.name === person.name)
  
  let response = {
    success:true,
    message:''
  }

  if(person.name.length === 0) {
    response.success = false;
    response.message = 'Name missing'
  }
  
  if(person.number.length === 0) {
    response.success = false
    response.message = 'Number missing'
  }

  if(existing.length > 0) {
    response.success = false
    response.message = 'Same name alreday exists'
  }

  if(person.name.length > 0 && person.number.length > 0 && existing.length === 0) {
    person.id = Math.floor(Math.random() * 9990)
    persons.persons.push(person)
    response.success = true
    response.message = 'Person added'
    response.person = person
  }

  res.send(response)
})

app.get('/info', (req,res) => {
  const date = new Date()
  const html = `<p>Sovelluksessa ${persons.persons.length}:n henkilön tiedot</p><p>${date}</p>`
  res.send(html)
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} `)
})
