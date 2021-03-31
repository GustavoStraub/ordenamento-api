require('dotenv').config()
const
  express = require('express'),
  cors = require('cors'),
  mongoose = require('mongoose'),
  bodyParser = require('body-parser')

const
  Register = require('./routes/Register')

const app = express()
app.use(cors())
app.use(bodyParser.json())

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