import Axios from 'axios'

const appUrls = {
  persons:'/api/persons/'
}

const getAll = () => {
  return Axios.get(appUrls.persons)
}

const create = (newObject) => {
  return Axios.post(appUrls.persons, newObject)
}

const update = (id, newObject) => {
  return Axios.put(`${appUrls.persons}${id}`, newObject)
}

const deletePerson = (id) => {
  return Axios.delete(`${appUrls.persons}${id}`)
}

export default { getAll, create, update, deletePerson }