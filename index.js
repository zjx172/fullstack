
// const { request, response } = require('express');
// const express=require('express')
// const app=express();
// const cors = require('cors')

// app.use(cors())
// app.use(express.json())
// app.use(express.static('build'))


// let notes = [
//   {
//     id: 1,
//     content: "HTML is easy",
//     date: "2019-05-30T17:30:31.098Z",
//     important: true
//   },
//   {
//     id: 2,
//     content: "Browser can execute only Javascript",
//     date: "2019-05-30T18:39:34.091Z",
//     important: false
//   },
//   {
//     id: 3,
//     content: "GET and POST are the most important methods of HTTP protocol",
//     date: "2019-05-30T19:20:14.298Z",
//     important: true
//   }
// ]
// // const app = http.createServer((request, response) => {
// //   response.writeHead(200, { 'Content-Type': 'application/json' })
// //   response.end(JSON.stringify(notes))
// // })


// app.get('/', (req, res) => {
//   res.send('<h1>Hello World!</h1>')
// })

// app.get('/api/notes', (req, res) => {
//   res.json(notes)
// })

// app.get('/api/notes/:id', (request, response) => {
//   // const id = request.params.id
//   const id = Number(request.params.id)
//   const note = notes.find(note => note.id === id)
// 	// const note = notes.find(note => {
// 	// 	console.log(note.id, typeof note.id, id, typeof id, note.id === id)
// 	// 	return note.id === id
// 	// })
// 	if (note) {
// 		response.json(note)
// 	} else {
// 		response.status(404).end()
// 	}
// })

// app.delete('/api/notes/:id', (request, response) => {
//   const id = Number(request.params.id)
//   notes = notes.filter(note => note.id !== id)

//   response.status(204).end()
// })


// const generateId = () => {
//   const maxId = notes.length > 0
//     ? Math.max(...notes.map(n => n.id))
//     : 0
//   return maxId + 1
// }

// // app.post('/api/notes',(request,response,next)=>{
// //   // const note=request.body
// //   // console.log(note)
// //   // response.json(note)




// //   // const maxId = notes.length > 0
// //   //   ? Math.max(...notes.map(n => n.id)) 
// //   //   : 0

// //   // const note = request.body
// //   // note.id = maxId + 1

// //   // notes = notes.concat(note)

// //   // response.json(note)



// // 	const body = request.body

// // 	if (!body.content) {
// // 		return response.status(400).json({ 
// // 		  error: 'content missing' 
// // 		})
// // 	}

// // 	const note = {
// // 		content: body.content,
// // 		important: body.important || false,
// // 		date: new Date(),
// // 		id: generateId(),
// // 	}


// // 	notes = notes.concat(note)

// // 	response.json(note)



// // })


// app.post('/api/notes', (request, response, next) => {
//   const body = request.body

//   const note = new Note({
//     content: body.content,
//     important: body.important || false,
//     date: new Date(),
//   })

//   note.save()
//     .then(savedNote => {
//       response.json(savedNote.toJSON())
//     })
//     .catch(error => next(error))
// })


// const errorHandler = (error, request, response, next) => {
//   console.error(error.message)

//   if (error.name === 'CastError') {
//     return response.status(400).send({ error: 'malformatted id' })
//   } else if (error.name === 'ValidationError') {
//     return response.status(400).json({ error: error.message })
//   }

//   next(error)
// }



// // const PORT = 3001
// // app.listen(PORT)
// // console.log(`Server running on port ${PORT}`)

// const PORT = process.env.PORT || 3001
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`)
// })


// const mongoose = require('mongoose')

// if ( process.argv.length<3 ) {
//    console.log('Please provide the password as an argument: node mongo.js <password>')
//   process.exit(1)
// }

// const password = process.argv[2]

// const url =
//   `mongodb+srv://fullstack:${password}@cluster0.3qg51.mongodb.net/note-app?retryWrites=true&w=majority`


//  // RSNN8KfllbtyvCGk

// mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

// const noteSchema = new mongoose.Schema({
//   content: String,
//   date: Date,
//   important: Boolean,
// })

// const Note = mongoose.model('Note', noteSchema)


// if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
// }
const express = require('express')
const bodyParser = require('body-parser') 
const app = express()
const Note = require('./models/note')


const logger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(express.static('build'))
app.use(bodyParser.json())
app.use(logger)

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes.map(note => note.toJSON()))
  })
})

app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note.toJSON())
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
		console.log(error)
		response.status(500).end()
    })
})

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  })

  note.save()
	.then(savedNote => {return savedNote.toJSON()})
	.then(savedAndFormattedNote => {
		// console.log(savedAndFormattedNote,222)
		response.json(savedAndFormattedNote)
	}) 
  .catch(error=>next(error))
})

// app.delete('/api/notes/:id', (request, response, next) => {
//   Note.findByIdAndRemove(request.params.id)
//     .then(result => {
//       response.status(204).end()
//     })
//     .catch(error => next(error))
// })

app.put('/api/notes/:id', (request, response, next) => {
  const body = request.body

  const note = {
    content: body.content,
    important: body.important,
  }

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then(updatedNote => {
      response.json(updatedNote.toJSON())
    })
    .catch(error => {next(error)})
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind == 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  }  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
// const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})