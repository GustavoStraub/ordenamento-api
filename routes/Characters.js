const express = require('express')
const router = express.Router()
const jwt = require('jwt-simple')
const multer = require('multer')

require('dotenv').config()

const multerConfig = require('../config/multer')
const { User, Character, Image } = require('../models/models')


router.get('/', async (req, res) => {
  try {
    const ListOfCharacters = await Character
      .find()
      .exec()
    res.status(200).send(ListOfCharacters)
  } catch (err) {
    res.status(500).send(err)
  }
})

router.post('/image', multer(multerConfig).single('file'), async (req, res) => {
  try {
    const { originalname: Name, Size, key, location: url = '' } = req.file
    const newKey = await key.split(" ").join("")
    const ImageCreated = await Image.create({
      Name,
      Size,
      key: newKey,
      url,
    })
    const ImageToCharacter = await Character.findOne({ _id: req.headers.character })
    if (!ImageToCharacter.ImgId) {

      await ImageToCharacter.updateOne({ Img: ImageCreated.url, ImgId: ImageCreated._id }).exec()
      return res.status(200).send(ImageCreated)

    } else {

      const ImageToRemove = await Image.findById(ImageToCharacter.ImgId)
      await ImageToRemove.remove()
      console.log('asd')
      await ImageToCharacter.updateOne({ Img: ImageCreated.url, ImgId: ImageCreated._id }).exec()
      return res.status(200).json({ "message": `Foto atualizada ao personagem ${ImageToCharacter.Name}` })
    }
  } catch (err) {
    res.status(500).send(err)
  }
})

router.get('/:id', async (req, res) => {
  try {
    const OneCharacter = await Character.findOne({ _id: req.params.id })
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
      if (!USER) {
        res.status(400).json({ "error": "Usuário inválido" })
      } else {
        const newCharacter = new Character(req.body.Character)
        await newCharacter.save({ validateBeforeSave: false })
        const characterCreated = await Character.findOne({ Name: req.body.Character.Name })
        USER.updateOne({ $push: { Characters: characterCreated._id } }).exec()
        res.status(200).send(characterCreated)
      }
    }
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
})

router.put('/update/:id', async (req, res) => {
  try {
    const CharacterTobeUpdated = await Character.find({ _id: req.params.id })
    if (CharacterTobeUpdated) {
      res.status(400).json({ "error": "Nenhum personagem foi encontrado com esse ID" })
    } else {
      await Character.updateOne({ _id: req.params.id }, req.body)
      const CharacterUpdated = await Character.findOne({ _id: req.params.id })
      res.status(200).json({ "message": `${CharacterUpdated.Name} foi alterado com sucesso!` })
    }
  } catch (err) {
    res.status(500).send(err)
  }
})

router.delete('/delete/:id', async (req, res) => {
  try {
    const CharacterTobeDeleted = await Character.findOne({ _id: req.params.id }).exec()
    if (!CharacterTobeDeleted.Img) {
      res.status(400).json({
        "error": "Nenhum personagem foi encontrado com esse ID"
      })
    } else {
      await Character.deleteOne({ _id: req.params.id }).exec()
      res.status(200).json({
        "message": `Personagem ${CharacterTobeDeleted.Name} foi deletado com sucesso!`
      })
    }
  } catch (err) {
    res.status(500).send(err)
  }
})

module.exports = router