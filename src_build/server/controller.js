"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.login = exports.logout = exports.chat = void 0;

var _multerConfig = require("./utils/multerConfig.js");

var _server = require("./server");

var _websockets = require("./websockets");

var _app = _interopRequireDefault(require("../components/app"));

var _AppState = _interopRequireDefault(require("./AppState"));

var _react = _interopRequireDefault(require("react"));

var _server2 = _interopRequireDefault(require("react-dom/server"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const errorMessagesEnum = {
  LOGIN: {
    NO_USERNAME: "Error with your username, username only takes alphanumeric characters",
    USERNAME_ALREADY_EXISTS: "Username already exists",
    USERNAME_LENGTH: "Username too long, username length should be 8 or less",
    NO_FILE: "The image field has not been detected, pick an image",
    NOT_IMAGE: "The file sent is not recognized as an image, please ensure to select a PNG or JPEG",
    EMPTY_FIELDS: "You cannot connect without an username and an image"
  }
};
/**
 * Render a view file
 */

const chat = (req, res) => {
  let reactApp = _server2.default.renderToString( /*#__PURE__*/_react.default.createElement(_app.default, null)); //If the session doesn't have an appState, creates one.


  if (!req.session.appState) {
    req.session.appState = new _AppState.default();
  }

  if (!req.session.username) {
    req.session.appState.view = "Login";
    res.render('index.ejs', {
      app: reactApp,
      title: req.session.appState.title,
      appState: JSON.stringify(req.session.appState)
    });
    req.session.appState.errorMessage = null;
    req.session.save();
  } else {
    req.session.appState.view = "Chat";
    res.render('index.ejs', {
      app: reactApp,
      title: req.session.appState.title,
      appState: JSON.stringify(req.session.appState)
    });
  }
};
/**
 * Will redirect to login once the destroy session has been done.
 */


exports.chat = chat;

const logout = (req, res) => {
  (0, _websockets.sendLeavedChatMessageBroadcaster)(req.session);
  req.session.destroy();
  return res.redirect('/');
};
/**
 * Check sent image and username if that correspond to the rules and redirect to the depending view.
 */


exports.logout = logout;

const login = (req, res) => {
  //Allow only alphanumeric character and delete all other characters.
  let username = req.body.username.replace(/[^A-Z0-9]/ig, "");

  if (!username.length && !req.file) {
    setSessionErrorMessages(req.session, errorMessagesEnum.LOGIN.EMPTY_FIELDS, res);
  } else if (!req.file) {
    setSessionErrorMessages(req.session, errorMessagesEnum.LOGIN.NO_FILE, res);
  } else if (!username.length) {
    setSessionErrorMessages(req.session, errorMessagesEnum.LOGIN.NO_USERNAME, res);
  } else if (!req.session.username) {
    if (username.length <= 8) {
      //Settings for the database query
      let querySettings = {
        limit: 0,
        searchByFields: {
          username: username
        }
      }; //Get all sessions with query settings passed as parameters

      _server.database.actionToDatabase(_server.database.getFewDocuments, 'sessions', querySettings, results => {
        //variable that is equal to true if a session has been found
        let usernameAlreadyExists = results.length ? true : false;

        if (usernameAlreadyExists) {
          setSessionErrorMessages(req.session, errorMessagesEnum.LOGIN.USERNAME_ALREADY_EXISTS, res);
        } else {
          //Attach the username to his current session
          req.session.username = username; //Attach the correct path to the user's image

          req.session.image = `${_multerConfig.usersImagesPath}/${req.file.filename}`;
          req.session.save();
          (0, _websockets.sendJoinedChatMessageBroadcaster)(req.session);
          return res.redirect('/');
        }
      });
    } else {
      setSessionErrorMessages(req.session, errorMessagesEnum.LOGIN.USERNAME_LENGTH, res);
    }
  }
};

exports.login = login;

const setSessionErrorMessages = (session, message, res) => {
  session.appState.errorMessage = message;
  session.save();
  res.redirect('/');
};