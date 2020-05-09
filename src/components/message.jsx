import React, { useState, useEffect } from 'react';

const Message = (props) => {

    /**
     * Add a simple messsage to chat area
     */
    const simpleMessage = (message) => {
        return <p><strong>{message.userName}</strong> : {message.message}</p>;
    }

    /**
     * When the current user connect, create a message that alert the user
     */
    const userConnectionMessage = (message) => {
        return <p className="alert mt-2 mb-1 p-2 fade show alert-success rounded-0"><em>{message.message} {message.userName}</em></p>;
    }

    /**
     * When a new user connect, create a message that alert the current user
     */
    const newUserConnection = (message) => {

        return (
            <div className="alert mt-2 mb-1 p-2  alert-dismissible fade show alert-info rounded-0" role="alert">
                <p className="m-0"><em><strong>{message.userName}</strong> {message.message}</em></p>
                <button type="button" className="close p-1" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        );
    }

    /**
     * When a user leave the chat, the user is alerted by a message
     */
    const messageDisconnected = (message) => {
        return (
            <div className="alert mt-2 mb-1 p-2  alert-dismissible fade show alert-warning rounded-0" role="alert">
                <p className="m-0"><em><strong>{message.userName}</strong> {message.message}</em></p>
                <button type="button" className="close p-1" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        );
    }

    return (
        <div>
            {props.message.messageType == 'message' ? simpleMessage(props.message) : ''}
            {props.message.messageType == 'disconnected' ? messageDisconnected(props.message) : ''}
            {props.message.messageType == 'notme' ? newUserConnection(props.message) : ''}
            {props.message.messageType == 'me' ? userConnectionMessage(props.message) : ''}
        </div>
    );
}

export default Message;
