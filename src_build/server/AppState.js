"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**
 * This class create a store for react initial states.
 */
class AppState {
  constructor() {
    this.title = "Chat Websockets";
    this.view = "Login";
    this.errorMessage = null;
  }

}

var _default = AppState;
exports.default = _default;