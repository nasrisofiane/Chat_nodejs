
const multer = require('multer');
const usersImagesPath = `/uploads/images`;
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `${__dirname}/../public${usersImagesPath}`)
    },
    filename: (req, file, cb) => {
        let fileExt = path.extname(file.originalname)
      cb(null, `${file.fieldname}_${Date.now()}.${fileExt}`)
    }
  });

const upload = multer({storage : storage});

module.exports = {
    upload : upload,
    usersImagesPath : usersImagesPath
}