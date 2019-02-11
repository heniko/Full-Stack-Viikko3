const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url = ``

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
    mongoose.connect(url, { useNewUrlParser: true })

    console.log('puhelinluettelo:')

    Person.find({}).then(res => {
        res.forEach(p=> {
            console.log(`${p.name} ${p.number}`)
        })
        mongoose.connection.close()
    })
} else if (process.argv.length === 5) {
    mongoose.connect(url, { useNewUrlParser: true })

    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
    })

    person.save().then(response => {
        console.log('person saved!')
        mongoose.connection.close()
    })
}