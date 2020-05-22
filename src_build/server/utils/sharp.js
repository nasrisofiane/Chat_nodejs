"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sharp = _interopRequireDefault(require("sharp"));

var _multerConfig = require("./multerConfig");

var _imageSize = _interopRequireDefault(require("image-size"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const proportionalHeightFromWidth = (file, resizeToWidth) => {
  let originalRatio = (0, _imageSize.default)(file.path).width / (0, _imageSize.default)(file.path).height;
  let newHeight = resizeToWidth / originalRatio;
  return parseInt(newHeight);
};

const resizeFile = file => {
  let resizeToWidth = 200;
  let proportionalHeight = proportionalHeightFromWidth(file, resizeToWidth);
  (0, _sharp.default)(file.path).resize(resizeToWidth, proportionalHeight).toFile(`${_multerConfig.fullImagesPath}/${file.filename}`, (err, resizeImage) => {
    if (err) {
      console.log(err);
    }
  });
};

var _default = resizeFile;
exports.default = _default;