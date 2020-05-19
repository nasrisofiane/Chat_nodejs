"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _login = _interopRequireDefault(require("./login"));

var _socket = _interopRequireDefault(require("socket.io-client"));

var _chatManager = _interopRequireDefault(require("./chatManager"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const App = props => {
  const [socket, setSocket] = (0, _react.useState)(null);
  const [hasEvents, setHasEvents] = (0, _react.useState)(false);
  const [view, setView] = (0, _react.useState)(null);
  (0, _react.useEffect)(() => {
    setView(props.appState.view);

    if (props.appState.view != 'Login') {
      setSocket((0, _socket.default)('http://localhost:8080/'));
    }
  }, []);
  return view ? view == 'Login' ? /*#__PURE__*/_react.default.createElement(_login.default, {
    errorMessage: props.appState.errorMessage
  }) : /*#__PURE__*/_react.default.createElement(_chatManager.default, {
    socket: socket,
    setHasEvents: setHasEvents,
    hasEvents: hasEvents
  }) : null;
};

var _default = App;
exports.default = _default;