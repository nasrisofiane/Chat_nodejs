import express from "express";
import router from "./routes";
import path from 'path';
import http from 'http';
import MongoDbConnection from './MongoDbConnection';
import sessionstore from 'sessionstore';
import expressSession from 'express-session';
import startWebsocketsApp from './websockets';

const app = express();
const server = http.createServer(app);
const database = new MongoDbConnection();

const customSessionsStore = sessionstore.createSessionStore({
    type: 'mongodb',
    url : '***',
    collectionName: 'sessions'
});

const session = expressSession({
    secret: "my-secret",
    resave: false,
    saveUninitialized: true,
    store: customSessionsStore
});

startWebsocketsApp(server, session, database);
server.listen(8080);

//Express middlewares
app.use(session);
app.use(router);

//views engine
app.set('views', `${path.join(__dirname, '../')}/views`);

//Retrieve needed ressources from customs paths.
app.use(express.static('public'));
app.use("/css", express.static(__dirname + '/views/assets/css'));
app.use("/js", express.static(__dirname + '/views/assets/js'));

export { server, session, database };


















