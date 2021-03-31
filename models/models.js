const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = new Schema({
  Username: String,
  Password: String
}, { versionKey: false, strict: false })

module.exports = {
  User: mongoose.model('user', User)
}