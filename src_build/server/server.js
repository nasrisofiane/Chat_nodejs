"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.database = exports.session = exports.server = void 0;

var _express = _interopRequireDefault(require("express"));

var _routes = _interopRequireDefault(require("./routes"));

var _path = _interopRequireDefault(require("path"));

var _http = _interopRequireDefault(require("http"));

var _MongoDbConnection = _interopRequireDefault(require("./MongoDbConnection"));

var _sessionstore = _interopRequireDefault(require("sessionstore"));

var _expressSession = _interopRequireDefault(require("express-session"));

var _websockets = _interopRequireDefault(require("./websockets"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = (0, _express.default)();

const server = _http.default.createServer(app);

exports.server = server;
const database = new _MongoDbConnection.default();
exports.database = database;

const customSessionsStore = _sessionstore.default.createSessionStore({
  type: 'mongodb',
  url: '***',
  collectionName: 'sessions'
});

const session = (0, _expressSession.default)({
  secret: "my-secret",
  resave: false,
  saveUninitialized: true,
  store: customSessionsStore
});
exports.session = session;
(0, _websockets.default)(server, session, database);
server.listen(8080); //Express middlewares

app.use(session);
app.use(_routes.default); //views engine

app.set('views', `${_path.default.join(__dirname, '../')}/views`); //Retrieve needed ressources from customs paths.

app.use(_express.default.static('public'));
app.use("/css", _express.default.static(__dirname + '/views/assets/css'));
app.use("/js", _express.default.static(__dirname + '/views/assets/js'));