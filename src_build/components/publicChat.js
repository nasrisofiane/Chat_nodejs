"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _usersList = _interopRequireDefault(require("./usersList"));

var _message = _interopRequireDefault(require("./message"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const PublicChat = props => {
  const [messageToSend, setMessageToSend] = (0, _react.useState)("test");
  /**
  * Send value from the text input to the server event "message"
  */

  const sendMessage = () => {
    let socket = props.socket;
    socket ? socket.emit('message', messageToSend) : null; // Clean the value once the message has been sent to the server.

    setMessageToSend("");
  };

  return /*#__PURE__*/_react.default.createElement("div", {
    className: "container h-100 bg-secondary"
  }, /*#__PURE__*/_react.default.createElement("section", {
    className: "rounded-0 row h-100 align-items-center justify-content-center",
    id: "section-container"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "container align-items-center justify-content-center"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "row-fluid font-weight-normal",
    id: "username-container"
  }, /*#__PURE__*/_react.default.createElement("p", {
    className: "rounded-0 alert m-0 p-2 fade show alert-success text-center col-xl-6  lead"
  }, props.usernameMessage)), props.users ? /*#__PURE__*/_react.default.createElement(_usersList.default, {
    myInformations: props.myInformations,
    privateConversations: props.privateConversations,
    users: props.users,
    prepareConversation: props.prepareConversation
  }) : null, /*#__PURE__*/_react.default.createElement("div", {
    id: "chat-container",
    className: "row-fluid bg-light p-3"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "col-sm-12 lead",
    ref: props.chatAreaDOM,
    id: "chat-area"
  }, props.messagesReceived.length ? props.messagesReceived.map((message, index) => /*#__PURE__*/_react.default.createElement(_message.default, {
    key: index,
    message: message
  })) : null), /*#__PURE__*/_react.default.createElement("div", {
    className: "container"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "row pl-2 pr-2"
  }, /*#__PURE__*/_react.default.createElement("input", {
    className: "rounded-0 col-sm-9 form-control",
    value: messageToSend,
    onKeyDown: event => event.keyCode === 13 ? sendMessage() : null,
    onChange: e => setMessageToSend(e.target.value),
    type: "text",
    placeholder: "Write a message here"
  }), /*#__PURE__*/_react.default.createElement("button", {
    className: "rounded-0 col-sm-2 btn btn-primary",
    onClick: () => sendMessage()
  }, /*#__PURE__*/_react.default.createElement("i", {
    className: "fas fa-paper-plane"
  })), /*#__PURE__*/_react.default.createElement("a", {
    className: "rounded-0 col-sm-1 btn btn-danger align-self-end",
    id: "disconnect-button",
    href: "/logout"
  }, /*#__PURE__*/_react.default.createElement("i", {
    className: "fas fa-sign-out-alt"
  }))))))));
};

var _default = PublicChat;
exports.default = _default;