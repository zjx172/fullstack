// const mongoose = require('mongoose')
// const supertest = require('supertest')
// const app = require('../app')
// const api = supertest(app)
// const Note = require('../models/note')
// const helper = require('./test_helper')

// // const initialNotes = [
// //   {
// //     content: 'HTML is easy',
// //     date: new Date(),
// //     important: false,
// //   },
// //   {
// //     content: 'Browser can execute only Javascript',
// //     date: new Date(),
// //     important: true,
// //   },
// // ]
// beforeEach(async () => {
//   await Note.deleteMany({})
//   // console.log('cleared')
//   const noteObjects=helper.initialNotes.map(note=>new Note(note))
//   const promiseArray=noteObjects.map(note=>note.save())
//   await Promise.all(promiseArray)
//   // helper.initialNotes.forEach(async (note)=>{
//     // let noteObject=new Note(note)
//     // await noteObject.save()
//     // console.log('saved')
//   // })
//   console.log('done')



//   // let noteObject = new Note(helper.initialNotes[0])
//   // await noteObject.save()

//   // noteObject = new Note(helper.initialNotes[1])
//   // await noteObject.save()
// })




// test('notes are returned as json', async () => {
//   console.log('entered test')
//   await api
//     .get('/api/notes')
//     .expect(200)
//     .expect('Content-Type', /application\/json/)
// })

// // test('there are two notes', async () => {
// //   const response = await api.get('/api/notes')

// //   expect(response.body).toHaveLength(2)
// // })

// test('all notes are returned', async () => {
//   const response = await api.get('/api/notes')

//   expect(response.body).toHaveLength(helper.initialNotes.length)
// })

// test('a specific note is within the returned notes', async () => {
//   const response = await api.get('/api/notes')

//   const contents = response.body.map(r => r.content) //创建一个数组，该数组包含api返回的每个便签的内容
//   expect(contents).toContain(
//     'Browser can execute only Javascript' 
//   )
// })


// test('the first note is about HTTP methods', async () => {
//   const response = await api.get('/api/notes')

//   expect(response.body[0].content).toBe('HTML is easy')
// })


// test('a valid note can be added', async () => {
//   const newNote = {
//     content: 'async/await simplifies making async calls',
//     important: true,
//   }

//   await api
//     .post('/api/notes')
//     .send(newNote)
//     .expect(200)
//     .expect('Content-Type', /application\/json/)

//   // const response = await api.get('/api/notes')

//   const notesAtEnd=await helper.notesInDb();
//   expect(notesAtEnd).toHaveLength(helper.initialNotes.length+1)

//   // const contents = response.body.map(r => r.content)
//   // expect(response.body).toHaveLength(initialNotes.length + 1)

//   const contents=notesAtEnd.map(n=>n.content)
//   expect(contents).toContain(
//     'async/await simplifies making async calls'
//   )
// })

// test('note without content is not added', async () => {
//   const newNote = {
//     important: true
//   }

//   await api
//     .post('/api/notes')
//     .send(newNote)
//     .expect(400)

//   // const response = await api.get('/api/notes')
//   // expect(response.body).toHaveLength(initialNotes.length)
//   const notesAtEnd =await helper.notesInDb();
//   expect(notesAtEnd).toHaveLength(helper.initialNotes.length)
// })

// test('a specific note can be viewed', async () => {
//   const notesAtStart = await helper.notesInDb()

//   const noteToView = notesAtStart[0]

//   const resultNote = await api
//     .get(`/api/notes/${noteToView.id}`)
//     .expect(200)
//     .expect('Content-Type', /application\/json/)

//   const processedNoteToView = JSON.parse(JSON.stringify(noteToView))
//   expect(resultNote.body).toEqual(processedNoteToView)
// })


// test('a note can be deleted', async () => {
//   const notesAtStart = await helper.notesInDb()
//   const noteToDelete = notesAtStart[0]

//   await api
//     .delete(`/api/notes/${noteToDelete.id}`)
//     .expect(204)

//   const notesAtEnd = await helper.notesInDb()

//   expect(notesAtEnd).toHaveLength(
//     helper.initialNotes.length - 1
//   )

//   const contents = notesAtEnd.map(r => r.content)

//   expect(contents).not.toContain(noteToDelete.content)
// })


// afterAll(() => {
//   mongoose.connection.close()
// })



const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Note = require('../models/note')


const bcrypt=require('bcrypt')
const User=require('../models/user')

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const user = new User({ username: 'root', password: 'sekret' })
    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  // test('creation fails with proper statuscode and message if username already taken', async () => {
  //   const usersAtStart = await helper.usersInDb()

  //   const newUser = {
  //     username: 'root',
  //     name: 'Superuser',
  //     password: 'salainen',
  //   }

  //   const result = await api
  //     .post('/api/users')
  //     .send(newUser)
  //     .expect(400)
  //     .expect('Content-Type', /application\/json/)

  //   expect(result.body.error).toContain('`username` to be unique')

  //   const usersAtEnd = await helper.usersInDb()
  //   expect(usersAtEnd.length).toBe(usersAtStart.length)
  // })

})
// beforeEach(async () => {
//     await User.deleteMany({})

//     const passwordHash = await bcrypt.hash('sekret', 10)
//     const user = new User({ username: 'root', passwordHash })

//     await user.save()
//   })

// describe('when there is initially one user in db', () => {

//   test('creation succeeds with a fresh username', async () => {
//     const usersAtStart = await helper.usersInDb()

//     const newUser = {
//       username: 'mluukkai',
//       name: 'Matti Luukkainen',
//       password: 'salainen',
//     }

//     await api
//       .post('/api/users')
//       .send(newUser)
//       .expect(200)
//       .expect('Content-Type', /application\/json/)

//     const usersAtEnd = await helper.usersInDb()
//     expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

//     const usernames = usersAtEnd.map(u => u.username)
//     expect(usernames).toContain(newUser.username)
//   })
// })


// describe('when there is initially one user in db', () => {
//   // ...

//   test('creation fails with proper statuscode and message if username already taken', async () => {
//     const usersAtStart = await helper.usersInDb()

//     const newUser = {
//       username: 'root',
//       name: 'Superuser',
//       password: 'salainen',
//     }

//     const result = await api
//       .post('/api/users')
//       .send(newUser)
//       .expect(400)
//       .expect('Content-Type', /application\/json/)

//     expect(result.body.error).toContain('`username` to be unique')

//     const usersAtEnd = await helper.usersInDb()
//     expect(usersAtEnd).toHaveLength(usersAtStart.length)
//   })
// })





// beforeEach(async () => {
//   await Note.deleteMany({})

//   const noteObjects = helper.initialNotes
//     .map(note => new Note(note))
//   const promiseArray = noteObjects.map(note => note.save())
//   await Promise.all(promiseArray)
// })



// describe('when there is initially some notes saved', () => {
//   test('notes are returned as json', async () => {
//     await api
//       .get('/api/notes')
//       .expect(200)
//       .expect('Content-Type', /application\/json/)
//   })

//   test('all notes are returned', async () => {
//     const response = await api.get('/api/notes')

//     expect(response.body).toHaveLength(helper.initialNotes.length)
//   })

//   test('a specific note is within the returned notes', async () => {
//     const response = await api.get('/api/notes')

//     const contents = response.body.map(r => r.content)
//     expect(contents).toContain(
//       'Browser can execute only Javascript'
//     )
//   })
// })

// describe('viewing a specific note', () => {
//   test('succeeds with a valid id', async () => {
//     const notesAtStart = await helper.notesInDb()

//     const noteToView = notesAtStart[0]

//     const resultNote = await api
//       .get(`/api/notes/${noteToView.id}`)
//       .expect(200)
//       .expect('Content-Type', /application\/json/)

//     const processedNoteToView = JSON.parse(JSON.stringify(noteToView))
//     expect(resultNote.body).toEqual(processedNoteToView)
//   })

//   test('fails with statuscode 404 if note does not exist', async () => {
//     const validNonexistingId = await helper.nonExistingId()

//     console.log(validNonexistingId)

//     await api
//       .get(`/api/notes/${validNonexistingId}`)
//       .expect(404)
//   })

//   test('fails with statuscode 400 id is invalid', async () => {
//     const invalidId = '5a3d5da59070081a82a3445'

//     await api
//       .get(`/api/notes/${invalidId}`)
//       .expect(400)
//   })
// })

// describe('addition of a new note', () => {
//   test('succeeds with valid data', async () => {
//     const newNote = {
//       content: 'async/await simplifies making async calls',
//       important: true,
//     }

//     await api
//       .post('/api/notes')
//       .send(newNote)
//       .expect(200)
//       .expect('Content-Type', /application\/json/)


//     const notesAtEnd = await helper.notesInDb()
//     expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1)

//     const contents = notesAtEnd.map(n => n.content)
//     expect(contents).toContain(
//       'async/await simplifies making async calls'
//     )
//   })

//   test('fails with status code 400 if data invaild', async () => {
//     const newNote = {
//       important: true
//     }

//     await api
//       .post('/api/notes')
//       .send(newNote)
//       .expect(400)

//     const notesAtEnd = await helper.notesInDb()

//     expect(notesAtEnd).toHaveLength(helper.initialNotes.length)
//   })
// })

// describe('deletion of a note', () => {
//   test('succeeds with status code 204 if id is valid', async () => {
//     const notesAtStart = await helper.notesInDb()
//     const noteToDelete = notesAtStart[0]

//     await api
//       .delete(`/api/notes/${noteToDelete.id}`)
//       .expect(204)

//     const notesAtEnd = await helper.notesInDb()

//     expect(notesAtEnd).toHaveLength(
//       helper.initialNotes.length - 1
//     )

//     const contents = notesAtEnd.map(r => r.content)

//     expect(contents).not.toContain(noteToDelete.content)
//   })
// })

afterAll(() => {
  mongoose.connection.close()
})