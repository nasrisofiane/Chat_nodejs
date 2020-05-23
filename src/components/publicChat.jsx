import React, { useState, useEffect } from 'react';
import UsersList from './usersList';
import Message from './message';

const PublicChat = (props) => {

    const [messageToSend, setMessageToSend] = useState("");

    /**
    * Send value from the text input to the server event "message"
    */
    const sendMessage = () => {
        let socket = props.socket;
        socket ? socket.emit('message', messageToSend) : null;

        // Clean the value once the message has been sent to the server.
        setMessageToSend("");
    }

    return (

        <div className="container m-0 p-0 d-flex flex-column align-items-stretch justify-content-center">
            <div className="row-fluid font-weight-normal" id="username-container">
                <p className="rounded-0 alert m-0 p-2 fade show alert-success text-center col-xl-6  lead">{props.usernameMessage}</p>
            </div>
            {props.users ? <UsersList chatIsReady={props.chatIsReady} myInformations={props.myInformations} privateConversations={props.privateConversations} users={props.users} prepareConversation={props.prepareConversation} /> : null}
            <div id="chat-container" className="col bg-light p-3 d-flex flex-column justify-content-between">


                <div className="col lead" ref={props.chatAreaDOM} id="chat-area" >
                    {props.messagesReceived.length ? props.messagesReceived.map((message, index) => <Message key={index} message={message} />) : null}
                </div>
                <div className="container">
                    <div className="row pl-2 pr-2">
                        <input className="rounded-0 col-sm-9 form-control" value={messageToSend} onKeyDown={(event) => event.keyCode === 13 ? sendMessage() : null} onChange={(e) => setMessageToSend(e.target.value)} type="text" placeholder="Write a message here" />
                        <button className="rounded-0 col-sm-2 btn btn-primary" onClick={() => sendMessage()}><i className="fas fa-paper-plane"></i></button>
                        <button className="rounded-0 col-sm-1 btn btn-danger align-self-end" id="disconnect-button" onClick={props.logOut}><i className="fas fa-sign-out-alt"></i></button>
                    </div>
                </div>

            </div>

        </div>

    );
}

export default PublicChat;