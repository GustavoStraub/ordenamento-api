const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt-nodejs')
const jwt = require('jwt-simple')

require('dotenv').config()

const { User } = require('../models/models')

router.get('/', async (req, res) => {
  res.send({ message: "aoba" })
})

router.post('/user', async (req, res) => {
  try {
    const { Username, Password } = req.body
    const UserExist = await User.findOne({ Username })
    if (UserExist) {
      res.status(500).send({ error: "Username já cadastrado!" })
    } else {
      req.body.Password = bcrypt.hashSync(Password, bcrypt.genSaltSync())
      let newUser = new User(req.body)
      let result = await newUser.save({ validateBeforeSave: false })
      res.status(200).send(result)
    }
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
})

router.post('/login', async (req, res) => {
  try {
    const { Username, Password } = req.body
    const UserExists = await User.findOne({ Username })
    if (!UserExists) {
      res.status(401).send({ error: 'Usuário não existe' })
    } else {
      const IsPasswordCorrect = bcrypt.compareSync(Password, UserExists.Password)
      if (!IsPasswordCorrect) {
        res.status(401).send({ error: 'Senha incorreta' })
      }
      let token = jwt.encode(UserExists._id, process.env.SECRET)
      res.status(200).send(token)
    }
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
})

module.exports = router