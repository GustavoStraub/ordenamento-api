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


module.exports = router