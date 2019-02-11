if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const express = require('express')
const bodyParser = require('body-parser')
var morgan = require('morgan')
const cors = require('cors')
const app = express()
const PORT = process.env.PORT
const Person = require('./models/person')

app.use(express.static('build'))
app.use(morgan('tiny'))
app.use(cors())
app.use(bodyParser.json())

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons.map(p => p.toJSON()))
    })
})

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
        .then(person => {
            if (person) {
                res.json(person.toJSON())
            } else {
                res.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
        .then(() => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (body.name === undefined) {
        return res.status(400).json({ error: 'name missing' })
    }

    else if (body.number === undefined) {
        return res.status(400).json({ error: 'number missing' })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        res.json(savedPerson.toJSON())
    })
})

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body

    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(req.params.id, person, { new: true })
        .then(updatedPerson => {
            res.json(updatedPerson.toJSON())
        })
        .catch(error => next(error))
})

app.get('/info', (req, res) => {
    var d = new Date()
    var ds = d.toString()

    Person.find({}).then(persons => {
        res.send(
            `<div>
            <p>Puhelinluettelossa on ${persons.length} henkilön tiedot</p>
            <p>${ds}</p>
            </div>`)
    })
})

const errorHandler = (error, req, res, next) => {
    console.error(error.message)
    if (error.name === 'CastError' && error.kind == 'ObjectId') {
        return res.status(400).send({ error: 'Malformatted id' })
    } else if (error.name === 'ValidatorError') {
        return res.status(400).json({ error: error.message })
    }

    next(error)
}

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
})