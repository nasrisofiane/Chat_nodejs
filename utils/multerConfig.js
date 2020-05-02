
const 
    multer = require('multer'),
    usersImagesPath = `/uploads/images`,
    path = require('path');

/**
 * Filter that will check the file source and return true if this is an image
 */
const customFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("The uploaded file is not recognized as an image", false);
  }
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `${__dirname}/../public${usersImagesPath}`)
    },
    filename: (req, file, cb) => {
        let fileExt = path.extname(file.originalname)
      cb(null, `${file.fieldname}_${Date.now()}.${fileExt}`)
    }
});

const upload = multer({
  storage : storage,
  limits: {
    fileSize: 100 * 1024
  },
  fileFilter : customFilter
});

module.exports = {
    upload : upload,
    usersImagesPath : usersImagesPath
}