const express = require('express')
const bodyParser = require('body-parser')
var morgan = require('morgan')
const cors = require('cors')
const app = express()

let persons = [
    {
        id: 1,
        name: 'Arto Hellas',
        number: '045-123456'
    },
    {
        id: 2,
        name: 'Arto Järvinen',
        number: '041-123456'
    },
    {
        id: 3,
        name: 'Lea Kutvonen',
        number: '040-123456'
    },
    {
        id: 4,
        name: 'Martti Tienari',
        number: '09-123456'
    },
]

app.use(express.static('build'))
app.use(morgan('tiny'))
app.use(cors())
app.use(bodyParser.json())

const generateId = () => {
    const maxId = persons.length > 0 ? Math.max(...persons.map(p => p.id)) : 0
    return maxId + 1
}

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)

    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (body.name === undefined) {
        return res.status(400).json({ error: 'name missing' })
    }

    else if (body.number === undefined) {
        return res.status(400).json({ error: 'number missing' })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    if (persons.filter(p => p.name === person.name) > 0) {
        return res.status(400).json({ error: 'name must be unique' })
    } else {
        persons = persons.concat(person)
        res.json(person)
    }
})

app.get('/info', (req, res) => {
    var d = new Date();
    var ds = d.toString();
    res.send(
        `<div>
        <p>Puhelinluettelossa on ${persons.length} henkilön tiedot</p>
        <p>${ds}</p>
        </div>`)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
})