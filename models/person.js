const mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator')

mongoose.set('useFindAndModify', false)

const url = process.env.MONGODB_URI

console.log(`Connecting to: ${url}`)

mongoose.connect(url, { useNewUrlParser: true })
    .then(res => {
        console.log(`Connected to MongoDB`)
    })
    .catch((error) => {
        console.log(`Error connecting to MongoDB: ${error.message}`)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    number: {
        type: String,
        required: true
    }
})

personSchema.plugin(uniqueValidator)

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)