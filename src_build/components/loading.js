"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Loading = () => {
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "spinner-border text-primary",
    id: "loading-module",
    role: "status"
  }, /*#__PURE__*/_react.default.createElement("span", {
    className: "sr-only"
  }, "Loading..."));
};

var _default = Loading;
exports.default = _default;