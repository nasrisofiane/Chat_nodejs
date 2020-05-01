const 
    express = require('express'),
    app = express(),
    routes = require('./routes.js'),
    server = require('http').Server(app),
    sessionstore = require('sessionstore'),
    MongoDbConnection = require('./MongoDbConnection').MongoDbConnection;
    database = new MongoDbConnection();

const customSessionsStore = sessionstore.createSessionStore({
    type: 'mongodb',
    host: 'localhost',
    port: 27017,
    dbName: 'chat',
    collectionName: 'sessions',
});

const session = require("express-session")({
    secret: "my-secret",
    resave: true,
    saveUninitialized: true,
    store : customSessionsStore
});

require('./websockets.js')(server, session, database);

server.listen(8080);
app.use(session);

//Retrieve needed ressources from customs paths.
app.use(express.static('public'));
app.use("/css", express.static(__dirname + '/views/assets/css'));
app.use("/js", express.static(__dirname + '/views/assets/js'));
app.use(routes);













