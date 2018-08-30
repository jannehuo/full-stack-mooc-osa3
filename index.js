const express = require('express')
const app = express()
const PORT = 3001 || process.env.PORT
const bodyParser = require('body-parser')
var morgan = require('morgan')
const persons = require('./modules/persons.js')

app.use(bodyParser.json())

app.use(express.static('build'))

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  next();
});

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
  if(person) {
    res.send(person)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req,res) => {
  const id = Number(req.params.id)
  persons.persons = persons.persons.filter(p => p.id !== id)
  res.status(200).end()
})

app.post('/api/persons', (req,res) => {
  let person = req.body
  const existing = persons.persons.filter(p => p.name === person.name)
  
  if(person.name === '' || person.name === undefined) {
    return res.status(400).json({error: 'name missing'})
  }

  if(person.number === '' || person.number === undefined) {
    return res.status(400).json({error: 'number missing'})
  }

  if(existing.length > 0) {
    return res.status(400).json({error: 'person already in list'})
  }

  person.id = Math.floor(Math.random() * 9990)
  persons.persons.push(person)

  res.send(person)
})

app.get('/info', (req,res) => {
  const date = new Date()
  const html = `<p>Sovelluksessa ${persons.persons.length}:n henkilön tiedot</p><p>${date}</p>`
  res.send(html)
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} `)
})