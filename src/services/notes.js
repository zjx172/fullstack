// import axios from 'axios'
// const baseUrl = 'http://localhost:3001/notes'

// const getAll = () => {
//   return axios.get(baseUrl)
// }

// const create = newObject => {
//   return axios.post(baseUrl, newObject)
// }

// const update = (id, newObject) => {
//   return axios.put(`${baseUrl}/${id}`, newObject)
// }

// export default { 
//   getAll: getAll, 
//   create: create, 
//   update: update 
// }


import axios from 'axios'
// const baseUrl = 'http://localhost:3001/api/notes'
const baseUrl = '/api/notes'

let token=null

const setToken=newToken=>{
	token=`bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newObject => {
	const config={
		headers:{Authorization:token}
	}
	const response = await axios.post(baseUrl, newObject,config)
	return response.data
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

export default {
    getAll,
    create,
    update,
    setToken
}