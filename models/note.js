// const mongoose = require('mongoose')

// mongoose.set('useFindAndModify', false)

// const url = process.env.MONGODB_URI

// console.log('commecting to', url)

// mongoose.connect(url, { useNewUrlParser: true })
//   .then(result => {
//     console.log('connected to MongoDB')
//   })
//   .catch((error) => {
//     console.log('error connection to MongoDB:', error.message)
//   })

// const noteSchema = new mongoose.Schema({
//   content: {
//     type: String,
//     required: true,
//     minlength: 5
//   },
//   date: Date,
//   important: Boolean,
// })

// noteSchema.set('toJSON', {
//   transform: (document, returnedObject) => {
//     returnedObject.id = returnedObject._id.toString()
//     delete returnedObject._id
//     delete returnedObject.__v
//   }
// })
  
// module.exports = mongoose.model('Note', noteSchema)



// const mongoose = require('mongoose')

// const url = process.env.MONGODB_URI

// console.log('connecting to', url)

// mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
//   .then(result => {
//     console.log('connected to MongoDB')
//   })
//   .catch((error) => {
//     console.log('error connecting to MongoDB:', error.message)
//   })

// const noteSchema = new mongoose.Schema({
//   content: String,
//   date: Date,
//   important: Boolean,
// })

// noteSchema.set('toJSON', {
//   transform: (document, returnedObject) => {
//     returnedObject.id = returnedObject._id.toString()
//     delete returnedObject._id
//     delete returnedObject.__v
//   }
// })

// module.exports = mongoose.model('Note', noteSchema)



const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    minlength: 5
  },
  date: {
    type: Date,
    required: true,
  },
  important: Boolean,
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  }
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Note', noteSchema)