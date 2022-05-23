const bookRepository = require("../repositories/bookRepository");
const assert = require('assert');
const data = require("../data/seed.json");

async function main() {
    // seed db
    const results = await bookRepository.seedData();
    assert.equal(data.length, results.insertedCount);

    // list items
    let items = await bookRepository.get();
    console.log("numbor of items: " + items.length);
    console.log("items:");
    items.forEach(item => {
        console.log(JSON.stringify(item));
    });

    // add item
    const newItem = {
        "author": "Somebody",
        "title": "Just a book",
        "publisher": "The Publisher",
        "release": 1990
    };
    const addedItemId = await bookRepository.add(newItem);
    items = await bookRepository.get();
    console.log("numbor of items: " + items.length);
    console.log("items:");
    items.forEach(item => {
        console.log(JSON.stringify(item));
    });

    // update item
    const updatedItem = await bookRepository.update(addedItemId, {
        "author": "Somebody asd",
        "title": "Just a book asd",
        "publisher": "The Publisher asd",
        "release": 1000
    });
    console.log("updated item: " + JSON.stringify(updatedItem));

    // delete item
    const removed = await bookRepository.remove(addedItemId);
    assert(removed);

    // delete db
    await bookRepository.dropDatabase();
}

main();