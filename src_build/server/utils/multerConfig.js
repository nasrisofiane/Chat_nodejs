"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.upload = exports.fullImagesPath = exports.usersImagesPath = exports.imageLimit = void 0;

var _multer = _interopRequireDefault(require("multer"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const imageLimit = 10500000;
exports.imageLimit = imageLimit;
const usersImagesPath = `/uploads/images`;
exports.usersImagesPath = usersImagesPath;
const fullImagesPath = `${_path.default.join(__dirname, '../../..')}/public${usersImagesPath}`;
/**
 * Filter that will check the file source and return true if this is an image
 */

exports.fullImagesPath = fullImagesPath;

const customFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("The uploaded file is not recognized as an image", false);
  }
};

const storage = _multer.default.diskStorage({
  //Previous storage
  // destination: (req, file, cb) => {
  //   cb(null, fullImagesPath);
  // },
  filename: (req, file, cb) => {
    let fileExt = _path.default.extname(file.originalname);

    let fullname = `thumbnail_${file.fieldname}_${Date.now()}${fileExt}`;
    cb(null, fullname);
  }
});

const upload = (0, _multer.default)({
  storage: storage,
  fileFilter: customFilter
});
exports.upload = upload;