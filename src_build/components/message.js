"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const Message = props => {
  /**
   * Add a simple messsage to chat area
   */
  const simpleMessage = message => {
    return /*#__PURE__*/_react.default.createElement("p", null, /*#__PURE__*/_react.default.createElement("strong", null, message.username), " : ", message.message);
  };
  /**
   * When the current user connect, create a message that alert the user
   */


  const userConnectionMessage = message => {
    return /*#__PURE__*/_react.default.createElement("p", {
      className: "alert mt-2 mb-1 p-2 fade show alert-success rounded-0"
    }, /*#__PURE__*/_react.default.createElement("em", null, message.message, " ", message.username));
  };
  /**
   * When a new user connect, create a message that alert the current user
   */


  const newUserConnection = message => {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "alert mt-2 mb-1 p-2  alert-dismissible fade show alert-info rounded-0",
      role: "alert"
    }, /*#__PURE__*/_react.default.createElement("p", {
      className: "m-0"
    }, /*#__PURE__*/_react.default.createElement("em", null, /*#__PURE__*/_react.default.createElement("strong", null, message.username), " ", message.message)), /*#__PURE__*/_react.default.createElement("button", {
      type: "button",
      className: "close p-1",
      "data-dismiss": "alert",
      "aria-label": "Close"
    }, /*#__PURE__*/_react.default.createElement("span", {
      "aria-hidden": "true"
    }, "\xD7")));
  };
  /**
   * When a user leave the chat, the user is alerted by a message
   */


  const messageDisconnected = message => {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "alert mt-2 mb-1 p-2  alert-dismissible fade show alert-warning rounded-0",
      role: "alert"
    }, /*#__PURE__*/_react.default.createElement("p", {
      className: "m-0"
    }, /*#__PURE__*/_react.default.createElement("em", null, /*#__PURE__*/_react.default.createElement("strong", null, message.username), " ", message.message)), /*#__PURE__*/_react.default.createElement("button", {
      type: "button",
      className: "close p-1",
      "data-dismiss": "alert",
      "aria-label": "Close"
    }, /*#__PURE__*/_react.default.createElement("span", {
      "aria-hidden": "true"
    }, "\xD7")));
  };

  return /*#__PURE__*/_react.default.createElement("div", null, props.message.messageType == 'message' ? simpleMessage(props.message) : '', props.message.messageType == 'disconnected' ? messageDisconnected(props.message) : '', props.message.messageType == 'notme' ? newUserConnection(props.message) : '', props.message.messageType == 'me' ? userConnectionMessage(props.message) : '');
};

var _default = Message;
exports.default = _default;