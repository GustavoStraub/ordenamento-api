const multer = require('multer')
const path = require('path')

const Storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname, '..', 'uploads'))
  },
  filename: (req, file, cb) => {
    file.key = `${file.originalname.split(" ").join("")}`
    cb(null, file.key)
  }
})


module.exports = {
  dest: path.resolve(__dirname, '..', 'uploads'),
  storage: Storage,
  limits: {
    fileSize: 2 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'image/jpeg',
      'image/pjpeg',
      'image/png',
      'image/jpg'
    ]

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type.'))
    }
  }
}