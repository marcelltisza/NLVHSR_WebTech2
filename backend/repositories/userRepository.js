const { MongoClient, ObjectId } = require('mongodb');

function userRepository() {
    const url = 'mongodb://localhost:27017';
    const dbName = 'bookStore';
    const collection = "users";

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

    return { get, getById, add, dropDatabase };
}

module.exports = userRepository();