const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt-nodejs')
const jwt = require('jwt-simple')

require('dotenv').config()

const { User } = require('../models/models')

router.post('/', async (req, res) => {
  try {
    req.body.Username = req.body.Username.toLowerCase()
    const { Username, Password } = req.body
    const UserExist = await User.findOne({ Username })
    if (UserExist) {
      res.status(400).json({ "error": "Username já cadastrado!" })
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
  req.body.Username = req.body.Username.toLowerCase()
  try {
    const { Username, Password } = req.body
    const UserExists = await User.findOne({ Username })
    if (!UserExists) {
      res.status(400).json({ "error": "Usuário não existe" })
    } else {
      const IsPasswordCorrect = bcrypt.compareSync(Password, UserExists.Password)
      if (!IsPasswordCorrect) {
        res.status(400).json({ "error": "Senha incorreta" })
      } else {
        let token = jwt.encode(UserExists._id, process.env.SECRET)
        res.status(200).send(token)
      }
    }
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
})

module.exports = router