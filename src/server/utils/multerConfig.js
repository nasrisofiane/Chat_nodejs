
import multer from 'multer';
import path from 'path';
export const usersImagesPath = `/uploads/images`;
export const fullImagesPath = `${path.join(__dirname, '../../..')}/public${usersImagesPath}`;

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
    //Previous storage

    // destination: (req, file, cb) => {
    //   cb(null, fullImagesPath);
    // },
    
    filename: (req, file, cb) => {
        let fileExt = path.extname(file.originalname);
        let fullname = `thumbnail_${file.fieldname}_${Date.now()}${fileExt}`;
      cb(null, fullname);
    }
});

export const upload = multer({
  storage : storage,
  fileFilter : customFilter
});