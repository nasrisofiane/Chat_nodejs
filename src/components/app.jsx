import React, { useState, useEffect } from "react";
import Login from './login';
import io from 'socket.io-client';
import ChatManager from './chatManager';

const App = (props) => {

    const [socket, setSocket] = useState(null);
    const [hasEvents, setHasEvents] = useState(false);
    const [view, setView] = useState(null);

    useEffect(() => {
        setView(props.appState.view);
        if (props.appState.view != 'Login') {
            setSocket(io('http://localhost:8080/'));
        }
    }, []);

    return view ? (view == 'Login' ? 
        <Login errorMessage={props.appState.errorMessage} /> 
        : 
        <ChatManager socket={socket} setHasEvents={setHasEvents} hasEvents={hasEvents}/>)
        : null;
}
export default App;