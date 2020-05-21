import express from "express";
import router from "./routes";
import dotenv from 'dotenv';
import path from 'path';
import http from 'http';
import MongoDbConnection from './MongoDbConnection';
import expressSession from 'express-session';
import startWebsocketsApp from './websockets';

dotenv.config();
const MongoStore = require('connect-mongo')(expressSession);
const app = express();
const server = http.createServer(app);
const database = new MongoDbConnection();
const port = process.env.PORT || 3000;

const session = expressSession({
    secret: "my-secret",
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
        url : database.url,
        collection : database.collectionsName.sessions,
        stringify : false
    })
});

startWebsocketsApp(server, session, database);
server.listen(port);

console.log(`App listening on ${port}`);

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


















