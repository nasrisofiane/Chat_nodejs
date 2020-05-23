"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _publicChat = _interopRequireDefault(require("./publicChat"));

var _privateChat = _interopRequireDefault(require("./privateChat"));

var _socketManager = _interopRequireDefault(require("./socketManager"));

var _loading = _interopRequireDefault(require("./loading"));

var _testUtils = require("react-dom/test-utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const ChatManager = props => {
  const [messagesReceived, setMessagesReceived] = (0, _react.useState)([]);
  const [privateConversations, setPrivateConversations] = (0, _react.useState)({});
  const [usernameMessage, setUsernameMessage] = (0, _react.useState)(null);
  const [myInformations, setMyInformations] = (0, _react.useState)({});
  const [users, setUsers] = (0, _react.useState)([]);
  const [talkTo, setTalkTo] = (0, _react.useState)(null);
  const [errorMessage, setErrorMessage] = (0, _react.useState)(null);
  const [isLoaded, setIsLoaded] = (0, _react.useState)(false);
  const [chatAreaDOM, setChatAreaDOM] = (0, _react.useState)(_react.default.createRef());
  /**
   * Prepare conversation, if the opened conversation is new, add an empty object to the conversations
   * @param {*} user 
   */

  const prepareConversation = user => {
    setTalkTo(user);

    if (!privateConversations[user.username]) {
      setPrivateConversations(prevConversations => {
        return { ...prevConversations,
          [user.username]: {}
        };
      });
    }
  };
  /**
   * Delete the user's session once the session is destroyed, an action is sent from server and parse with eval.
   */


  const logOut = () => {
    props.socket.emit('deleteAccount', null, (isDestroyed, action) => {
      let reload = new Function(action);
      isDestroyed ? reload() : null;
    });
  };

  const chatIsReady = () => {
    setIsLoaded(true);
  };
  /**
   * set Talkto to null to change the view.
   */


  const goToPublicChat = () => {
    setTalkTo(null);
  };
  /**
   * Display an error message if the user is already connected
   */


  const displayAlreadyConnected = () => {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "row h-100 align-items-center justify-content-center display-4"
    }, errorMessage);
  };
  /**
   * If the chatArea bar scroll is fully down, the next message will be automatically scrolled to the new max bottom.
   * @param {*} prevScrollBarPosition 
   * @param {*} prevMaxScrollBarHeight 
   */
  // const chatScroller = (prevScrollBarPosition, prevMaxScrollBarHeight) => {
  //     let newMaxScrollBarHeight = chatAreaDOM.current.scrollTopMax;
  //     if (prevScrollBarPosition == prevMaxScrollBarHeight) {
  //         chatAreaDOM.current.scrollTo({
  //             top: newMaxScrollBarHeight,
  //             left: 0,
  //             behavior: 'smooth'
  //         });
  //     }
  // }

  /**
   * Return differents view depending on conditions.
   */


  const windowDisplayer = () => {
    if (!errorMessage && !talkTo) {
      return /*#__PURE__*/_react.default.createElement(_publicChat.default, {
        privateConversations: privateConversations,
        messagesReceived: messagesReceived,
        usernameMessage: usernameMessage,
        users: users,
        logOut: logOut,
        chatIsReady: chatIsReady,
        myInformations: myInformations,
        chatAreaDOM: chatAreaDOM,
        socket: props.socket,
        prepareConversation: prepareConversation
      });
    } else if (!errorMessage && talkTo) {
      return /*#__PURE__*/_react.default.createElement(_privateChat.default, {
        user: talkTo,
        logOut: logOut,
        conversation: privateConversations[talkTo.username],
        usernameMessage: usernameMessage,
        myInformations: myInformations,
        chatAreaDOM: chatAreaDOM,
        goToPublicChat: goToPublicChat,
        socket: props.socket
      });
    } else {
      return displayAlreadyConnected();
    }
  };

  return /*#__PURE__*/_react.default.createElement("div", {
    className: "container-fluid m-0 p-0 h-100 bg-secondary"
  }, /*#__PURE__*/_react.default.createElement(_socketManager.default, {
    messagesReceived: [messagesReceived, setMessagesReceived],
    privateConversations: [privateConversations, setPrivateConversations],
    usernameMessage: [usernameMessage, setUsernameMessage],
    myInformations: [myInformations, setMyInformations],
    users: [users, setUsers],
    errorMessage: [errorMessage, setErrorMessage],
    socket: props.socket,
    talkTo: [talkTo, setTalkTo]
  }), /*#__PURE__*/_react.default.createElement("div", {
    className: "container-fluid m-0 p-0 h-100 bg-secondary d-flex align-items-center justify-content-center"
  }, /*#__PURE__*/_react.default.createElement("section", {
    className: "rounded-0 container p-0 m-0 h-100 d-flex align-items-sm-strech align-items-md-center justify-content-center",
    id: "section-container"
  }, isLoaded ? null : /*#__PURE__*/_react.default.createElement(_loading.default, null), windowDisplayer())));
};

var _default = ChatManager;
exports.default = _default;