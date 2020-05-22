import React, { useState, useEffect } from 'react';
import Message from './message';

const PrivateChat = (props) => {

    const [messageToSend, setMessageToSend] = useState("");

    /**
    * Send value from the text input to the server event "message"
    */
    const sendMessage = () => {
        let datas = {
            sendTo: props.user.username,
            message: messageToSend,
            conversationId: props.conversation._id
        };
        props.socket.emit('sendPrivateMessage', datas);

        // Clean the value once the message has been sent to the server.
        setMessageToSend("");
    }

    useEffect(() => {
        messageSeen();
        return () => messageSeen();
    }, [props.conversation]);

    /**
     * Trigger socket event to the server.
     * will tell the server that the user have seen all the private messages from this conversation.
     */
    const messageSeen = () => {
        props.socket.emit('messagesSeen', props.conversation._id);
    }

    return (
        <div className="container align-items-center m-0 p-0 justify-content-center">
            <div className="row-fluid font-weight-normal" id="username-container">
                <p className="rounded-0 alert m-0 p-2 fade show alert-success text-center col-xl-6  lead">{props.usernameMessage}</p>
            </div>

            <div className="row-fluid d-flex flex-row-reverse flex-nowrap bg-info m-0" id="users-list">
                <div className="position-relative align-items-center justify-content-center">
                    <img className="m-2 img-private-chat" src={props.user.image} />
                    <div style={{ bottom: 0 }} className={`position-absolute col-12 m-0 p-1 ${props.user.connected ? 'text-success' : 'text-danger'} user-status-connected align-self-end d-flex justify-content-end`}>
                        <div className="rounded-circle p-1 bg-dark d-flex justify-content-center"><i className="fas fa-plug"></i></div>
                    </div>
                </div>
                <p className="mb-0 lead text-center d-flex align-items-center">{props.user.username}</p>
                <p className="w-100 d-flex align-items-center justify-content-start m-0 pl-3"><i onClick={props.goToPublicChat} className="p-2 fas fa-arrow-left"></i></p>
            </div>

            <div id="chat-container" className="row-fluid bg-light p-3">

                <div className="col-sm-12 lead" ref={props.chatAreaDOM} id="chat-area" >
                    {Array.isArray(props.conversation.messages) ? props.conversation.messages.map((message, index) => { return <Message key={index} message={message} /> }) : null}
                </div>
                <div className="container">
                    <div className="row pl-2 pr-2">
                        <input className="rounded-0 col-sm-9 form-control" value={messageToSend} onKeyDown={(event) => event.keyCode === 13 ? sendMessage() : null} onChange={(e) => setMessageToSend(e.target.value)} type="text" placeholder="Write a message here" />
                        <button className="rounded-0 col-sm-2 btn btn-primary" onClick={() => sendMessage()}><i className="fas fa-paper-plane"></i></button>
                        <a className="rounded-0 col-sm-1 btn btn-danger align-self-end" id="disconnect-button" href="/logout"><i className="fas fa-sign-out-alt"></i></a>
                    </div>
                </div>

            </div>

        </div>
    );
}

export default PrivateChat;