const express = require('express')
const router = express.Router()
const jwt = require('jwt-simple')

require('dotenv').config()

const { User, Character } = require('../models/models')


router.get('/', async (req, res) => {
  try {
    const ListOfCharacters = await Character.find()
    res.status(200).send(ListOfCharacters)
  } catch (err) {
    res.status(500).send(err)
  }
})

router.get('/:id', async (req, res) => {
  try {
    const OneCharacter = await Character.findOne({_id: req.params.id})
    res.status(200).send(OneCharacter)
  } catch (err) {
    res.status(500).send(err)
  }
})

router.post('/create', async (req, res) => {
  try {
    if (!req.body.Token) {
      res.status(500).send({ error: "Token não enviado" })
    } else {
      const decoded = await jwt.decode(req.body.Token, process.env.SECRET)
      const USER = await User.findOne({ _id: decoded }).exec()
      const newCharacter = new Character(req.body.Character)
      await newCharacter.save({ validateBeforeSave: false })
      let characterCreated = await Character.findOne({ Name: req.body.Character.Name })
      USER.updateOne({ $push: { Characters: characterCreated } }).exec()
      res.status(200).send(characterCreated)
    }
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
})

router.put('/update/:id', async (req, res) => {
  try {
    const CharacterUpdate = await Character.updateOne({_id: req.params.id}, req.body).exec()
    res.status(200).send(CharacterUpdate)
  } catch (err) {
    res.status(500).send(err)
  }
})


module.exports = router