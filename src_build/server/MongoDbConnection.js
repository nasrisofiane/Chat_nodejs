"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Class that manage mongoDB actions.
 */
class MongoDbConnection {
  constructor() {
    _defineProperty(this, "actionToDatabase", async (callbackAction, collectionName, datas, next) => {
      //Connect to mongoDb with the url passed in parameter
      this.MongoClient.connect(this.url, (err, client) => {
        this.assert.equal(null, err); //Connect to the database passed in parameter.

        let db = client.db(this.databaseName); //CallbackAction with all required paramters predefined 

        callbackAction(db, results => {
          next(results);
        }, collectionName, datas);
        client.close();
      });
    });

    _defineProperty(this, "insertDocuments", (db, callback, collectionName, datas) => {
      this.assert.equal(collectionName, this.collectionsName[collectionName]);
      let collection = db.collection(collectionName);
      collection.insertMany(datas, (err, result) => {
        this.assert.equal(err, null);
        this.assert.equal(datas.length, result.result.n);
        this.assert.equal(datas.length, result.ops.length);
        callback(result);
      });
    });

    _defineProperty(this, "insertSingleDocument", (db, callback, collectionName, datas) => {
      this.assert.equal(collectionName, this.collectionsName[collectionName]);
      let collection = db.collection(collectionName);

      if (typeof datas != 'undefined' && datas._id) {
        datas._id = this.ObjectId(datas._id);
      }

      collection.save(datas, (err, result) => {
        this.assert.equal(err, null);
        this.assert.equal(1, result.result.n);
        callback(result);
      });
    });

    _defineProperty(this, "getFewDocuments", (db, callback, collectionName, datas = {
      limit: 0,
      searchByFields: {}
    }) => {
      this.assert.equal(collectionName, this.collectionsName[collectionName]);
      let collection = db.collection(collectionName);

      if (typeof datas.searchByFields != 'undefined' && datas.searchByFields._id) {
        datas.searchByFields._id = this.ObjectId(datas.searchByFields._id);
      }

      collection.find(datas.searchByFields).sort({
        _id: -1
      }).limit(datas.limit).toArray((err, result) => {
        this.assert.equal(err, null);
        callback(result);
      });
    });

    this.mongoDb = require('mongodb');
    this.ObjectId = this.mongoDb.ObjectID;
    this.MongoClient = this.mongoDb.MongoClient;
    this.assert = require('assert');
    this.url = `mongodb+srv://webwarriorsteam:f6gJ8YZ1bAtS176L@cluster0-0it93.gcp.mongodb.net/chat?retryWrites=true&w=majority`;
    this.databaseName = 'chat'; //Every action to database will check if a collection is well writed by checking in this array with an assert function.

    this.collectionsName = {
      messages: 'messages',
      sessions: 'sessions',
      privateConversations: 'privateConversations'
    };
  }
  /**
   * Function that handle any actions to mangoDB
   * @callBackAction An action as "insertDocuments" to pass as parameter
   * @collectionName A collectionName to perform the action
   * @datas Datas related to the action
   * @next CallBack that will be performed at the end of the function
   */


}

var _default = MongoDbConnection;
exports.default = _default;