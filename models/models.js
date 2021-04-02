const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Character = new Schema({
  Name: String,
  Img: String,
  ImgId: String,
  FOR: String,
}, { versionKey: false, strict: false })

const User = new Schema({
  Username: String,
  Password: String,
  Characters: [{ type: Schema.Types.ObjectId, ref: 'character' }]
}, { versionKey: false, strict: false })

const Image = new Schema({
  Name: String,
  Size: Number,
  key: String,
  url: String,
})

Image.pre('save', function () {
  if (!this.url) {
    this.url = `${process.env.APP_URL}/uploads/${this.key}`
  }
})

Image.pre('remove', function () {
  return fs.unlink(path.resolve(__dirname, '..', 'uploads', this.Key), (err => {
    if (err) console.log(err)
    else {
      console.log("\nDeleted file");
    }
  }))
})

module.exports = {
  User: mongoose.model('user', User),
  Character: mongoose.model('character', Character),
  Image: mongoose.model('image', Image)
}