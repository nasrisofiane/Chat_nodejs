"use strict";

var _react = _interopRequireDefault(require("react"));

var _reactDom = require("react-dom");

var _app = _interopRequireDefault(require("./app"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Retrieve the global variable and parse the string as a JSON.
appState = JSON.parse(appState); // Hydrate the  the app client side once the app has been rendered from the server and pass the global variable as a props.

(0, _reactDom.hydrate)( /*#__PURE__*/_react.default.createElement(_app.default, {
  appState: appState
}), document.getElementById("app")); //Once props are passed in the hydrated component, delete unused datas.

appState = null;