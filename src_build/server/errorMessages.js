"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _multerConfig = require("./utils/multerConfig");

var _controller = require("./controller");

const errorMessagesEnum = {
  LOGIN: {
    NO_USERNAME: "Username only takes alphanumeric characters",
    USERNAME_ALREADY_EXISTS: "Username already exists",
    USERNAME_LENGTH: "Username length should be 8 or less",
    NO_FILE: "The image field has not been detected",
    FILE_SIZE: `File size too big, maximum authorized is ${_multerConfig.imageLimit / 1000} ko`,
    NOT_IMAGE: "Please ensure to select a PNG or JPEG",
    EMPTY_FIELDS: "Empty fields"
  }
};
var _default = errorMessagesEnum;
exports.default = _default;