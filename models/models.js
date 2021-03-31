const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Character = new Schema({
  Name: String,
  FOR: String
}, { versionKey: false, strict: false })

const User = new Schema({
  Username: String,
  Password: String,
  Characters: [Character]
}, { versionKey: false, strict: false })

module.exports = {
  User: mongoose.model('user', User),
  Character: mongoose.model('character', Character)
}