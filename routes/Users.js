const express = require('express')
const router = express.Router()

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
    const SingleUser = await User.findOne({_id: req.params.id})
    res.status(200).send(SingleUser)
  } catch (err) {
    res.status(500).send(err)
  }
})

router.get('/:id/characters', async (req, res) => {
  try {
    const SingleUser = await User.findOne({_id: req.params.id})
    res.status(200).send(SingleUser.Characters)
  } catch (err) {
    res.status(500).send(err)
  }
})


module.exports = router