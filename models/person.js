// mongodb://<dbuser>:<dbpassword>@ds139722.mlab.com:39722/jannehuo-fullstack
const mongoose = require('mongoose')
const mongoconfig = require('../mongoconf.json')
const url = `mongodb://${mongoconfig.user}:${mongoconfig.password}@ds139722.mlab.com:39722/jannehuo-fullstack`
mongoose.connect(url)

const personSchema = new mongoose.Schema({ name: 'string', phone: 'string' });
personSchema.statics.format = function(p) {
  return {
    id: p._id,
    name: p.name,
    phone: p.phone
  }
}

const Person = mongoose.model('Person', personSchema)

module.exports = Person