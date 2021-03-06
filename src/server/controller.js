import { usersImagesPath, imageLimit } from './utils/multerConfig.js';
import { database } from './server';
import { sendJoinedChatMessageBroadcaster, sendLeavedChatMessageBroadcaster } from './websockets';
import errorMessagesEnum from './errorMessages';
import App from "../components/app";
import resizeFile from './utils/sharp';
import AppState from "./AppState";
import React from "react";
import ReactDOMServer from "react-dom/server";

/**
 * Render a view file
 */
export const chat = (req, res) => {
    let reactApp = ReactDOMServer.renderToString(<App />);
    //If the session doesn't have an appState, creates one.
    if (!req.session.appState) {
        req.session.appState = new AppState();
    }

    if (!req.session.username) {
        req.session.appState.view = "Login";

        res.render('index.ejs',
            {
                app: reactApp,
                title: req.session.appState.title,
                appState: JSON.stringify(req.session.appState)
            }
        );

        req.session.appState.errorMessage = null;
        req.session.save();
    }
    else {
        req.session.appState.view = "Chat";

        res.render('index.ejs',
            {
                app: reactApp,
                title: req.session.appState.title,
                appState: JSON.stringify(req.session.appState)
            }
        );
    }

}

/**
 * Check sent image and username if that correspond to the rules and redirect to the depending view.
 */
export const login = (req, res) => {

    //Allow only alphanumeric character and delete all other characters.
    let username = req.body.username.replace(/[^A-Z0-9]/ig, "");

    if (!username.length && !req.file) {
        setSessionErrorMessages(req.session, errorMessagesEnum.LOGIN.EMPTY_FIELDS, res);
    }
    else if (!req.file) {
        setSessionErrorMessages(req.session, errorMessagesEnum.LOGIN.NO_FILE, res);
    }
    else if (!username.length) {
        setSessionErrorMessages(req.session, errorMessagesEnum.LOGIN.NO_USERNAME, res);
    }
    else if (!req.session.username) {
        if (req.file.size > imageLimit) return setSessionErrorMessages(req.session, errorMessagesEnum.LOGIN.FILE_SIZE, res);

        if (username.length <= 8) {

            let newUsername = '';

            for (let i = 0; i < username.length; i++) {

                if (i == 0) {
                    newUsername += username[i].toUpperCase();
                }
                else {
                    newUsername += username[i].toLowerCase();
                }

            }

            //Settings for the database query
            let querySettings = {
                limit: 0,
                searchByFields: {
                    "session.username" :  newUsername  
                }
            }

            //Get all sessions with query settings passed as parameters
            database.actionToDatabase(database.getFewDocuments, 'sessions', querySettings, (results) => {

                //variable that is equal to true if a session has been found
                let usernameAlreadyExists = results.length ? true : false;

                if (usernameAlreadyExists) {
                    setSessionErrorMessages(req.session, errorMessagesEnum.LOGIN.USERNAME_ALREADY_EXISTS, res);
                }
                else {
                    //Attach the username to his current session
                    req.session.username = newUsername;

                    //Attach the correct path to the user's image
                    req.session.image = `${usersImagesPath}/${req.file.filename}`;
                    req.session.save();
                    resizeFile(req.file);
                    sendJoinedChatMessageBroadcaster(req.session);
                    return res.redirect('/');
                }
            });
        }
        else {
            setSessionErrorMessages(req.session, errorMessagesEnum.LOGIN.USERNAME_LENGTH, res);
        }


    }
}

const setSessionErrorMessages = (session, message, res) => {
    session.appState.errorMessage = message;
    session.save();
    res.redirect('/');
}