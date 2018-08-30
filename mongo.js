// mongodb://<dbuser>:<dbpassword>@ds139722.mlab.com:39722/jannehuo-fullstack
const mongoose = require('mongoose')
const mongoconfig = require('./mongoconf.json')
const url = `mongodb://${mongoconfig.user}:${mongoconfig.password}@ds139722.mlab.com:39722/jannehuo-fullstack`
const node_arguments = process.argv.slice(2)
const name = node_arguments[0]
const phone = node_arguments[1]

console.log(arguments)

mongoose.connect(url)

const Person = mongoose.model('Person', {
  name: String,
  phone: String
})

const savePerson = () => {
  const person = new Person({
    name: name,
    phone: phone
  })

  person
    .save()
    .then(() => {
      console.log(`lisätään henkilö ${name} numero ${phone} luetteloon`)
      closeConn()
    })
}

const listPersons = () => {
  Person.find({}).then((persons) => {
    persons.forEach(p => console.log(p.name + " " + p.phone))
    closeConn()
  })
}

const closeConn = () => {
  mongoose.connection.close()
}

if(name && phone) {
  savePerson()
} else {
  listPersons()
}