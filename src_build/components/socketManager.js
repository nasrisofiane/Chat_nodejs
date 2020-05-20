"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const SocketManager = props => {
  (0, _react.useEffect)(() => {
    initializeSocketEvents();
    return () => removeEvents();
  }, [props]);
  /**
   * Remove all socket events
   */

  const removeEvents = () => {
    props.socket.off('alreadyConnected');
    props.socket.off('lastMessages');
    props.socket.off('lastConversations');
    props.socket.off('messagesSeen');
    props.socket.off('newConversation');
    props.socket.off('privateMessage');
    props.socket.off('connectedUsers');
    props.socket.off('message');
  };
  /**
   * Create socket events
   */


  const initializeSocketEvents = () => {
    props.socket.on('alreadyConnected', message => props.errorMessage[1](message)); // Event that retrieve the last messages once the server triggered the event.

    props.socket.on('lastMessages', ({
      messages
    }) => props.messagesReceived[1](prevMessages => [...prevMessages, ...messages]));
    props.socket.on('lastConversations', savedPrivateConversations => {
      let lastConversations = {};
      savedPrivateConversations.map(conversation => {
        let user = conversation.users[0];
        lastConversations[user] = conversation;
      });
      props.privateConversations[1](lastConversations);
    });
    props.socket.on('messagesSeen', conversationUser => {
      if (conversationUser) {
        props.privateConversations[0][conversationUser].messages.map(message => message.seen = true);
        props.privateConversations[1](prevConversations => {
          return { ...prevConversations
          };
        });
      }
    });
    props.socket.on('newConversation', newConversation => {
      let user = newConversation.users.filter(user => user != props.myInformations[0].username)[0];
      props.privateConversations[1](prevConversations => {
        return { ...prevConversations,
          [user]: newConversation
        };
      });
    });
    props.socket.on('privateMessage', message => {
      let usersConversation = {};

      if (message.sendTo == props.myInformations[0].username) {
        if (props.privateConversations[0][message.username] && Array.isArray(props.privateConversations[0][message.username].messages)) {
          usersConversation = props.privateConversations[0][message.username];
          usersConversation.messages.push(message);
        } else {
          usersConversation.messages = [message];
        }

        props.privateConversations[1](prevConversations => {
          return { ...prevConversations,
            [message.username]: usersConversation
          };
        });
      } else {
        if (props.privateConversations[0][message.sendTo] && Array.isArray(props.privateConversations[0][message.sendTo].messages)) {
          usersConversation = props.privateConversations[0][message.sendTo];
          usersConversation.messages.push(message);
        } else {
          usersConversation.messages = [message];
        }

        props.privateConversations[1](prevConversations => {
          return { ...prevConversations,
            [message.sendTo]: usersConversation
          };
        });
      }
    });
    props.socket.on('connectedUsers', usersInChat => {
      props.users[1]([...usersInChat]);
      console.log(usersInChat);
    }); //Event that retrieve new messages once the server triggered the event. 

    props.socket.on('message', message => {
      let prevScrollBarPosition = props.chatAreaDOM.current.scrollTop;
      let prevMaxScrollBarHeight = props.chatAreaDOM.current.scrollTopMax;

      if (message.messageType == "me") {
        props.myInformations[1](prevInformations => {
          return { ...prevInformations,
            username: message.myInformations.username,
            image: message.myInformations.image
          };
        });
        props.usernameMessage[1](`${message.message} ${message.myInformations.username}`);
      } else {
        props.messagesReceived[1](prevMessages => [...prevMessages, message]);
      }

      props.chatScroller(prevScrollBarPosition, prevMaxScrollBarHeight);
    });
  };

  return null;
};

var _default = SocketManager;
exports.default = _default;