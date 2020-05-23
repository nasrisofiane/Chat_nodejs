"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _controller = require("./controller");

var _multerConfig = require("./utils/multerConfig");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = _express.default.Router();
/**
 * Render an HTML file on the route connection
 */


router.get('/', _controller.chat);
/**
 * Send post parameters to controller function
 */

router.post('/', _multerConfig.upload.single('uploadFile'), _controller.login);
var _default = router;
exports.default = _default;