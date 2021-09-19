const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
require('dotenv').config();

const fileUpload = multer();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

router.post('', fileUpload.single('image'), async (req, res) => {
  const streamUpload = (req) => {
    const filename = req.file.originalname;

    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'pointing-poker',
          filename_override: filename,
          public_id: filename.substring(0, filename.lastIndexOf('.')),
        },
        (err, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(err);
          }
        },
      );

      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
  };

  const result = await streamUpload(req);
  res.send(result.url);
});

module.exports = router;