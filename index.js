const express = require('express')
const app = express()
const PORT = 3001 || process.env.PORT
const bodyParser = require('body-parser')
var morgan = require('morgan')
const persons = require('./modules/persons.js')
const Person = require('./models/person.js')

app.use(bodyParser.json())

app.use(express.static('frontend/build'))

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
  Person.find({}).then((persons) => {
    res.json(persons.map(Person.format))
  }).catch(error => {
    console.log(error)
    res.status(400).send({ error: error })
  })
})

app.get('/api/persons/:id', (req,res) => {
  const id = req.params.id
  
  Person.findById(id).then(result => {
    res.json(Person.format(result))
  })
  .catch(error => {
    response.status(400).send({ error: 'malformatted id' })
  })
})

app.delete('/api/persons/:id', (req,res) => {
  const id = req.params.id
  Person.findByIdAndRemove(id).then(result =>{
    res.status(200).end()
  })
  .catch(error => {
    res.status(400).send({ error: 'malformatted id' })
  })
})

app.post('/api/persons', (req,res) => {
  let person = req.body
  
  if(person.name === '' || person.name === undefined) {
    return res.status(400).json({error: 'name missing'})
  }

  if(person.phone === '' || person.phone === undefined) {
    return res.status(400).json({error: 'number missing'})
  }

  const newPerson = new Person({
    name: person.name,
    phone: person.phone
  })

  Person.find({name:person.name}).then(result => {
    if(result.length === 0) {
      newPerson.save().then((savedPerson) => {
        res.json(Person.format(savedPerson))
      }).catch(error => {
        console.log(error)
        response.status(400).send({ error: error })
      })
    } else {
      res.status(400).send({ error: `User name ${person.name} already exists!` })
    }
  }).catch(error => {
    console.log(error)
    res.status(400).send({ error: error })
  })
})

app.put('/api/persons/:id', (req,res) => {
  const person = req.body
  const id = req.params.id

  const updatedPerson = {
    name: person.name,
    phone: person.phone
  }

  Person.findByIdAndUpdate(id, updatedPerson, {new:true}).then(updatedPerson => {
    res.json(Person.format(updatedPerson))
  }).catch(error => {
    console.log(error)
    res.status(400).send({ error: error })
  })

})

app.get('/info', (req,res) => {
  const date = new Date()
  const html = `<p>Sovelluksessa ${persons.persons.length}:n henkilön tiedot</p><p>${date}</p>`
  res.send(html)
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} `)
})