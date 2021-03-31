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

router.get('/create', async (req, res) => {
  try {
    const USER = await User.findOne({ Username: 'Ryustraub' }).exec()
    const ATT = {
      Name: 'Cleidson, O Pica',
      FOR: '20'
    }
    const newCharacter = new Character(ATT)
    await newCharacter.save({ validateBeforeSave: false })
    let characterCreated = await Character.findOne({ Name: 'Cleidson, O Pica' })
    USER.updateOne({ $push: { Characters: characterCreated } }).exec()
    res.status(200).send(USER)
    
  } catch (err) {
    res.status(500).send(err)
  }
})

module.exports = router