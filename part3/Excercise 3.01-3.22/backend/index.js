require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/note')

app.use(express.static('build'))
app.use(cors()) 
app.use(express.json())

morgan.token('body', (request, response) => request.method === 'POST' ? JSON.stringify(request.body) : '')

app.use(morgan((tokens, request, response) => [ 
        tokens.method(request, response),
        tokens.url(request, response),
        tokens.status(request, response),
        tokens.res(request, response, 'content-length'),
        ' - ',
        tokens['response-time'](request, response),
        ' ms ',
        tokens.body(request, response)
    ].join('')
))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
] 

app.get('/api/persons', (request, response) => {
  Person.find({}).then(person => {
    response.json(person)
  })
})

app.get('/info', (request, response) => {
  Person.find({}).then(person => {
    response.send(`
    <div>
        <p>Phonebook has info for ${person.length} people</p>
        <p>${Date()} 
    </div>`
    )
  })
})



app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(persons => {
      if (persons) {
        response.json(persons)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

const generateId = () => {
  const maxId = persons.length > 0
    ? (Math.random() * 100000000000000)
    : 0
  return maxId + 1
}



app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findByIdAndUpdate(
    request.params.id, 
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  ) 
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  const nameExists = persons.some(person => person.name === body.name);
  const numberExists = persons.some(person => person.number === body.number);

  if (!body.name) {
    return response.status(400).json({ 
      error: 'Name content missing' 
    })
  }
  else if (!body.number) {
    return response.status(400).json({ 
      error: 'Number content missing' 
    })
  }
  else if(nameExists) {
      return response.status(400).json({ 
      error: 'Name must be unique' 
    })
  }
  else if(numberExists) {
      return response.status(400).json({ 
          error: 'Name must be unique' 
        })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })
  persons = persons.concat(person)

  person.save().then(savedNote => {
  response.json(savedNote)
  })
  .catch(error => next(error))
})

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(requestLogger)

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }  
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}


app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})