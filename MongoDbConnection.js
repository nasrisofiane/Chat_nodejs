
/**
 * Class that manage mongoDB actions.
 */
class MongoDbConnection{

  constructor(){
    this.MongoClient = require('mongodb').MongoClient;
    this.assert = require('assert');
    this.url = 'mongodb://localhost:27017';
    this.databaseName = 'chat';

    //Every action to database will check if a collection is well writed by checking in this array with an assert function.
    this.collectionsName = { messages : 'messages'};
  }

  /**
   * Function that handle any actions to mangoDB
   * @callBackAction An action as "insertDocuments" to pass as parameter
   * @collectionName A collectionName to perform the action
   * @datas Datas related to the action
   * @next CallBack that will be performed at the end of the function
   */
  actionToDatabase = async (callbackAction, collectionName, datas, next) => {

    //Connect to mongoDb with the url passed in parameter
    this.MongoClient.connect(this.url, (err, client) => {

      this.assert.equal(null, err);

      //Connect to the database passed in parameter.
      let db = client.db(this.databaseName);

      //CallbackAction with all required paramters predefined 
      callbackAction(db, (results) => {next(results)}, collectionName, datas);

      client.close();
    });

  }

  /**
   * Insert many documents with a single action
   * @db A database
   * @callback callback that will handle an action at the end of the function
   * @collectionName collectionName to insert documents
   * @datas an Array of objects that will reprensent the documents type
   */
  insertDocuments = (db, callback, collectionName, datas) => {

    this.assert.equal(collectionName, this.collectionsName[collectionName]);
    let collection = db.collection(collectionName);

    collection.insertMany(datas , (err, result) => {
      
      this.assert.equal(err, null);
      this.assert.equal(datas.length, result.result.n);
      this.assert.equal(datas.length, result.ops.length);

      console.log(`Inserted ${result.ops.length} documents into ${collectionName}`);
      callback(result);
    });
  }

  /**
   * Insert a singleDocument
   * @db A database
   * @callback callback that will handle an action at the end of the function
   * @collectionName collectionName to insert the document
   * @datas an object that will reprensent the document type
   */
  insertSingleDocument = (db, callback, collectionName, datas) =>{

    this.assert.equal(collectionName, this.collectionsName[collectionName]);
    let collection = db.collection(collectionName);

    collection.insertOne(datas, (err, result) =>{
      this.assert.equal(err, null);
      this.assert.equal(1, result.result.n);
      this.assert.equal(1, result.ops.length);

      console.log(`Inserted ${result.ops.length} documents into ${collectionName}`);
      callback(result);
    });
  }
  
  /**
   * Retrieve few documents in a collection
   * @db a database
   * @callback callback that will handle an action at the end of the function
   * @collectionName the collection where you want to retrieve the datas
   * @numberOfRecored the number of records that you wants to retrieve from the collection
   */
  getFewDocuments = (db, callback, collectionName, numberOfRecords) =>{

    this.assert.equal(collectionName, this.collectionsName[collectionName]);
    let collection = db.collection(collectionName);

    collection.find().sort({_id: -1}).limit(numberOfRecords).toArray((err, result) => {
      this.assert.equal(err, null);
      callback(result);
    });

  }

}

module.exports.MongoDbConnection = MongoDbConnection;