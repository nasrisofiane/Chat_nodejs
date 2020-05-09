import React from "react";
import { hydrate } from "react-dom";
import App from "./app";

// Retrieve the global variable and parse the string as a JSON.
appState = JSON.parse(appState);

// Hydrate the  the app client side once the app has been rendered from the server and pass the global variable as a props.
hydrate(<App appState={appState} />, document.getElementById("app"));

//Once props are passed in the hydrated component, delete unused datas.
appState = null;
