import React, {useState, useEffect} from "react";
import Login from './login';
import Chat from './chat';

const App = (props) => {
    
    const [view, setView] = useState(null);

    useEffect(() => {
        setView(props.appState.view);
    },[]);

    return view ? (view == 'Login' ? <Login errorMessage={props.appState.errorMessage}/> : <Chat/>) : null;
}
export default App;