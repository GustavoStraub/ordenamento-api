const express = require('express'),
  cors = require('cors'),
  mongoose = require('mongoose'),
  bodyParser = require('body-parser'),
  path = require('path'),
  morgan = require('morgan')

require('dotenv').config()

const
  Register = require('./routes/Register'),
  Users = require('./routes/Users'),
  Characters = require('./routes/Characters')

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(morgan('dev'))
app.use('/uploads', express.static('uploads'))

mongoose.connect(
  `mongodb+srv://gustavo:${process.env.MONGO_PASSWORD}@ordenamento.scpfh.mongodb.net/Ordenamento?retryWrites=true&w=majority`,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true }
)

mongoose.connection.once('open', () => {
  console.log('MongoDB connected succesfully')
})

app.listen(process.env.PORT || 4000, () => {
  console.log(`Running on port 4000`)
})

app.get('/', async (req, res) => {
  res.send({ message: "This is an Api made for the RPG ordenamento" })
})

app.use('/register', Register)
app.use('/users', Users)
app.use('/characters', Characters)