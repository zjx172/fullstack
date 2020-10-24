const mongoose = require('mongoose')

if ( process.argv.length<3 ) {
   console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.3qg51.mongodb.net/note-app?retryWrites=true&w=majority`

//连接数据库
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

//新建模式
// const noteSchema = new mongoose.Schema({
//   content: {
//     type: String,
//     minlength: 5,
//     required: true
//   },
//   date: { 
//     type: Date,
//     required: true
//   },
//   important: Boolean,
// })

//新建匹配的模型
const Note = mongoose.model('Note', {
  content: String,
  date: Date,
  important: Boolean,
}))

// const note = new Note({
//   content: 'HTML is Easy',
//   date: new Date(),
//   important: true,
// })

// note.save().then(result => {
//   console.log('note saved!')
//   mongoose.connection.close()
// })

const note = new Note({
  content: 'Promise auttaa asynkronisissa operaatiossa',
  date: new Date(),
  important: false,
})

if (false) {
  note.save().then(response => {
    console.log('note saved!')
    mongoose.connection.close()
  })
}



Note.find({}).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})