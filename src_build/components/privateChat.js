"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _message = _interopRequireDefault(require("./message"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const PrivateChat = props => {
  const [messageToSend, setMessageToSend] = (0, _react.useState)("test");
  /**
  * Send value from the text input to the server event "message"
  */

  const sendMessage = () => {
    let datas = {
      sendTo: props.user.username,
      message: messageToSend,
      conversationId: props.conversation._id
    };
    props.socket.emit('sendPrivateMessage', datas); // Clean the value once the message has been sent to the server.

    setMessageToSend("");
  };

  (0, _react.useEffect)(() => {
    messageSeen();
    return () => messageSeen();
  }, []);
  /**
   * Trigger socket event to the server.
   * will tell the server that the user have seen all the private messages from this conversation.
   */

  const messageSeen = () => {
    props.socket.emit('messagesSeen', props.conversation._id);
  };

  return /*#__PURE__*/_react.default.createElement("div", {
    className: "container h-100 bg-secondary"
  }, /*#__PURE__*/_react.default.createElement("section", {
    className: "row h-100 align-items-center justify-content-center",
    id: "section-container"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "container align-items-center justify-content-center"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "row-fluid font-weight-normal",
    id: "username-container"
  }, /*#__PURE__*/_react.default.createElement("p", {
    className: "rounded-0 alert m-0 p-2 fade show alert-success text-center col-xl-6  lead"
  }, props.usernameMessage)), /*#__PURE__*/_react.default.createElement("div", {
    className: "row-fluid d-flex flex-row-reverse flex-nowrap bg-info m-0",
    id: "users-list"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "position-relative align-items-center justify-content-center"
  }, /*#__PURE__*/_react.default.createElement("img", {
    className: "m-2 img-private-chat",
    src: props.user.image
  }), /*#__PURE__*/_react.default.createElement("div", {
    style: {
      bottom: 0
    },
    className: `position-absolute col-12 m-0 p-1 ${props.user.connected ? 'text-success' : 'text-danger'} user-status-connected align-self-end d-flex justify-content-end`
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "rounded-circle p-1 bg-dark d-flex justify-content-center"
  }, /*#__PURE__*/_react.default.createElement("i", {
    className: "fas fa-plug"
  })))), /*#__PURE__*/_react.default.createElement("p", {
    className: "mb-0 lead text-center d-flex align-items-center"
  }, props.user.username), /*#__PURE__*/_react.default.createElement("p", {
    className: "w-100 d-flex align-items-center justify-content-start m-0 pl-3"
  }, /*#__PURE__*/_react.default.createElement("i", {
    onClick: props.goToPublicChat,
    className: "p-2 fas fa-arrow-left"
  }))), /*#__PURE__*/_react.default.createElement("div", {
    id: "chat-container",
    className: "row-fluid bg-light p-3"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "col-sm-12 lead",
    ref: props.chatAreaDOM,
    id: "chat-area"
  }, Array.isArray(props.conversation.messages) ? props.conversation.messages.map((message, index) => {
    return /*#__PURE__*/_react.default.createElement(_message.default, {
      key: index,
      message: message
    });
  }) : null), /*#__PURE__*/_react.default.createElement("div", {
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

var _default = PrivateChat;
exports.default = _default;