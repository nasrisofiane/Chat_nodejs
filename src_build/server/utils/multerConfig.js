"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.upload = exports.usersImagesPath = void 0;

var _multer = _interopRequireDefault(require("multer"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const usersImagesPath = `/uploads/images`;
/**
 * Filter that will check the file source and return true if this is an image
 */

exports.usersImagesPath = usersImagesPath;

const customFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("The uploaded file is not recognized as an image", false);
  }
};

const storage = _multer.default.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${_path.default.join(__dirname, '../../..')}/public${usersImagesPath}`);
  },
  filename: (req, file, cb) => {
    let fileExt = _path.default.extname(file.originalname);

    cb(null, `${file.fieldname}_${Date.now()}.${fileExt}`);
  }
});

const upload = (0, _multer.default)({
  storage: storage,
  limits: {
    fileSize: 100 * 1024
  },
  fileFilter: customFilter
});
exports.upload = upload;