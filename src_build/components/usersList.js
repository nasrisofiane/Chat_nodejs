"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const UsersList = props => {
  const [openModalButton, setOpenModalButton] = (0, _react.useState)(_react.default.createRef());
  /**
   * Generate a div with the user's informations in the list of users
   */

  const userDivInList = (userInformations, index) => {
    getPendingMessages(userInformations);
    let iconConnectedColor = userInformations.connected ? 'text-success' : 'text-danger';
    let showPendingMessages = userInformations.pendingMessages <= 0 ? 'd-none' : 'd-flex';
    return /*#__PURE__*/_react.default.createElement("div", {
      onClick: () => checkMyDivInList(userInformations),
      key: index,
      className: "users-square col-lg-1 text-center align-items-center justify-content-center p-0"
    }, /*#__PURE__*/_react.default.createElement("section", {
      className: "container-fluid h-100 d-flex flex-column p-0"
    }, /*#__PURE__*/_react.default.createElement("p", {
      className: "mb-1 lead text-center"
    }, userInformations.username), /*#__PURE__*/_react.default.createElement("div", {
      className: "row mb-2 align-items-center justify-content-center h-100"
    }, /*#__PURE__*/_react.default.createElement("img", {
      className: "col-10",
      src: userInformations.image
    }), /*#__PURE__*/_react.default.createElement("div", {
      className: `position-absolute col-12 m-0  p-0 user-status-connected align-self-end d-flex justify-content-end`
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "rounded p-1 bg-dark d-flex justify-content-center users-status"
    }, /*#__PURE__*/_react.default.createElement("p", {
      className: `p-1 m-0 ${showPendingMessages} justify-content-center text-success align-items-center`
    }, userInformations.pendingMessages), /*#__PURE__*/_react.default.createElement("i", {
      className: `fas fa-plug ${iconConnectedColor}`
    }))))), props.myInformations.username == userInformations.username ? createModal() : null);
  };
  /**
   * Count and return the number of pending messages.
   * @param {*} userInformations 
   */


  const getPendingMessages = userInformations => {
    if (props.privateConversations[userInformations.username] && Array.isArray(props.privateConversations[userInformations.username].messages)) {
      userInformations.pendingMessages = props.privateConversations[userInformations.username].messages.filter(({
        seen
      }) => seen[props.myInformations.username] == false).length;
    } else {
      userInformations.pendingMessages = 0;
    }
  };
  /**
   * Function that return a JSX bootstrap Modal with an error message in it.
   */


  const createModal = () => {
    return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("button", {
      ref: openModalButton,
      type: "button",
      className: "d-none btn btn-primary",
      "data-toggle": "modal",
      "data-target": "#errorModal"
    }, "Open modal"), /*#__PURE__*/_react.default.createElement("div", {
      className: "modal fade",
      id: "errorModal",
      tabIndex: "-1",
      role: "dialog",
      "aria-labelledby": "errorModalUsersList",
      "aria-hidden": "true"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "modal-dialog modal-dialog-centered",
      role: "document"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "rounded-0 modal-content"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "modal-header"
    }, /*#__PURE__*/_react.default.createElement("h5", {
      className: "modal-title text-center",
      id: "exampleModalLongTitle"
    }, "Error")), /*#__PURE__*/_react.default.createElement("div", {
      className: "text-center modal-body"
    }, "Cannot select yourself"), /*#__PURE__*/_react.default.createElement("div", {
      className: "modal-footer"
    }, /*#__PURE__*/_react.default.createElement("button", {
      type: "button",
      className: "rounded-0 btn btn-secondary",
      "data-dismiss": "modal"
    }, "Close"))))));
  };
  /**
   * Function that avoid the user to open is own private message window.
   * If the user find a way to do it, backend will block the user from sending message to himself.
   * @param {*} userInformations 
   */


  const checkMyDivInList = userInformations => {
    if (props.myInformations.username == userInformations.username) {
      openModalButton.current.click();
    } else {
      props.prepareConversation(userInformations);
    }
  };

  return /*#__PURE__*/_react.default.createElement("div", {
    className: "row-fluid d-flex flex-row flex-nowrap bg-primary m-0",
    id: "users-list"
  }, props.users.map((user, index) => userDivInList(user, index)));
};

var _default = UsersList;
exports.default = _default;