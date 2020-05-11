import React, {useState, useEffect} from "react";
import Login from './login';
import ChatManager from './chatManager';

const App = (props) => {
    
    const [view, setView] = useState(null);

    useEffect(() => {
        setView(props.appState.view);
    },[]);

    return view ? (view == 'Login' ? <Login errorMessage={props.appState.errorMessage}/> : <ChatManager/>) : null;
}
export default App;