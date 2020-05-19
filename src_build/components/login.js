"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const Login = props => {
  const [imageSelected, setImageSelected] = (0, _react.useState)(null);

  const uploadFile = _react.default.createRef();

  const [errorMessage, setErrorMessage] = (0, _react.useState)(props.errorMessage);
  (0, _react.useEffect)(() => {});
  /**
   * Pass input target in the function and retrieve the file selected, read the file data as url and pass it in a event function.
   */

  const handleFileSelect = e => {
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.onload = onFileLoaded;
    reader.readAsDataURL(file);
  };
  /**
   * Take a file in params, retrieve the data url and set the state with the value 
   */


  const onFileLoaded = e => {
    setImageSelected(e.target.result);
  };
  /**
   * Return a window with an error message
   */


  const createErrorMessage = () => {
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "alert mt-2 mb-1 p-2 alert-dismissible fade show alert-danger",
      role: "alert"
    }, /*#__PURE__*/_react.default.createElement("p", {
      className: "m-0"
    }, /*#__PURE__*/_react.default.createElement("strong", null, errorMessage)), /*#__PURE__*/_react.default.createElement("button", {
      type: "button",
      className: "close p-1",
      "data-dismiss": "alert",
      "aria-label": "Close"
    }, /*#__PURE__*/_react.default.createElement("span", {
      "aria-hidden": "true"
    }, "\xD7")));
  };

  return /*#__PURE__*/_react.default.createElement("div", {
    className: "row h-100 align-items-center justify-content-center"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "col-sm-6 bg-light p-3"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "row justify-content-center"
  }, /*#__PURE__*/_react.default.createElement("h1", {
    className: "text-center display-4"
  }, "Login")), /*#__PURE__*/_react.default.createElement("form", {
    className: "row justify-content-center",
    action: "/",
    encType: "multipart/form-data",
    method: "post",
    id: "image-form"
  }, /*#__PURE__*/_react.default.createElement("input", {
    className: "rounded-0 col-sm-6 m-1 form-control",
    name: "username",
    type: "text",
    placeholder: "Username"
  }), /*#__PURE__*/_react.default.createElement("input", {
    type: "file",
    ref: uploadFile,
    className: "d-none form-control-file",
    name: "uploadFile",
    onChange: handleFileSelect
  }), /*#__PURE__*/_react.default.createElement("button", {
    className: "rounded-0 col-sm-6 btn btn-primary m-1",
    id: "send-username-button"
  }, "Connect")), /*#__PURE__*/_react.default.createElement("div", {
    className: "row mt-3"
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "col-12 d-flex flex-column justify-content-center align-items-center"
  }, /*#__PURE__*/_react.default.createElement("p", {
    className: "lead mb-1"
  }, "Select a picture"), /*#__PURE__*/_react.default.createElement("img", {
    className: " border",
    src: imageSelected,
    width: "50",
    height: "50",
    onClick: () => uploadFile.current.click(),
    id: "open-file-dialog"
  }))), errorMessage ? createErrorMessage() : null));
};

var _default = Login;
exports.default = _default;