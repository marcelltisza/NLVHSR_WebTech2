const { MongoClient, ObjectId } = require('mongodb');
const data = require("../data/seed.json");

function bookRepository() {
    const url = 'mongodb://localhost:27017';
    const dbName = 'bookStore';
    const collection = 'books';

    function get() {
        return new Promise(async (resolve, reject) => {
            const client = new MongoClient(url);
            try {
                await client.connect();
                const db = client.db(dbName);

                let items = db.collection(collection).find(); 

                resolve(await items.toArray());
                client.close();
            }
            catch (error) {
                reject(error);
            }
        });
    }

    function getById(id) {
        return new Promise(async (resolve, reject) => {
            const client = new MongoClient(url);
            try {
                await client.connect();
                const db = client.db(dbName);

                const item = await db.collection(collection).findOne({_id: ObjectId(id)});

                resolve(item);
                client.close();
            }
            catch (error) {
                reject(error);
            }
        });
    }
    
    function add(item) {
        return new Promise(async (resolve, reject) => {
            const client = new MongoClient(url);
            try {
                await client.connect();
                const db = client.db(dbName);

                const addedItem = await db.collection(collection).insertOne(item);

                resolve(addedItem.insertedId);
                client.close();
            }
            catch (error) {
                reject(error);
            }
        });
    }

    function remove(id) {
        return new Promise(async (resolve, reject) => {
            const client = new MongoClient(url);
            try {
                await client.connect();
                const db = client.db(dbName);

                const removed = await db.collection(collection).deleteOne({_id: ObjectId(id)});
                
                resolve(removed.deletedCount === 1);
                client.close();
            }
            catch (error) {
                reject(error);
            }
        });
    }

    function update(id, newItem) {
        return new Promise(async (resolve, reject) => {
            const client = new MongoClient(url);
            try {
                await client.connect();
                const db = client.db(dbName);

                const updatedItem = await db.collection(collection)
                    .findOneAndReplace({_id: ObjectId(id)}, newItem, {returnDocument: "after"});

                resolve(updatedItem.value);
                client.close();
            }
            catch (error) {
                reject(error);
            }
        });
    }

    function seedData() {
        return new Promise(async (resolve, reject) => {
            const client = new MongoClient(url);
            try {
                await client.connect();
                const db = client.db(dbName);

                results = await db.collection(collection).insertMany(data);
                resolve(results);
                client.close();
            } catch(error) {
                reject(error)
            }
        })
    }

    function dropDatabase() {
        return new Promise(async (resolve, reject) => {
            const client = new MongoClient(url);
            try {
                await client.connect();
                const result = await client.db(dbName).dropDatabase();
                resolve(result);
                client.close();
            } catch(error) {
                reject(error)
            }
        })
    }

    return { get, getById, add, remove, update, seedData, dropDatabase };
}

module.exports = bookRepository();