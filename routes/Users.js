const express = require('express')
const router = express.Router()
const jwt = require('jwt-simple')

require('dotenv').config()

const { User, Character } = require('../models/models')


router.get('/', async (req, res) => {
  try {
    const ListOfUsers = await User.find()
    res.status(200).send(ListOfUsers)
  } catch (err) {
    res.status(500).send(err)
  }
})

router.get('/:id', async (req, res) => {
  try {
    const SingleUser = await User.findOne({ _id: req.params.id })
    res.status(200).send(SingleUser)
  } catch (err) {
    res.status(500).send(err)
  }
})

router.get('/:Token', async (req, res) => {
  try {
    if (!req.params.Token) {
      res.status(500).send({ error: "Token não enviado" })
    } else {
      const Token = jwt.decode(req.params.Token, process.env.SECRET)
      const SingleUser = await User.findOne({ _id: Token })
      res.status(200).send(SingleUser)
    }
  } catch (err) {
    res.status(500).send(err)
  }
})

router.get('/:Token/characters', async (req, res) => {
  try {
    if (!req.params.Token) {
      res.status(500).send({ error: "Token não enviado" })
    } else {
      const Token = jwt.decode(req.params.Token, process.env.SECRET)
      const SingleUser = await User.findOne({ _id: Token })
      res.status(200).send(SingleUser.Characters)
    }
  } catch (err) {
    res.status(500).send(err)
  }
})


module.exports = router