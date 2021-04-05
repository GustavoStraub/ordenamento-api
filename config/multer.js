const multer = require('multer')
const path = require('path')
const multerS3 = require('multer-s3')
const aws = require('aws-sdk')

// const Storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.resolve(__dirname, '..', 'uploads'))
//   },
//   filename: (req, file, cb) => {
//     file.key = `${file.originalname.split(" ").join("")}`
//     cb(null, file.key)
//   }
// })

const Storage = multerS3({
  s3: new aws.S3(),
  bucket: 'uploadexamples3',
  contentType: multerS3.AUTO_CONTENT_TYPE,
  acl: 'public-read',
  key: (req, file, cb) => {
    const fileName = `${file.originalname.split(" ").join("").toLowerCase()}`
    cb(null, fileName)
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