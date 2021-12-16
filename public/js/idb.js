// Create a variable to hold db connection
let db;

// Establish a connection to IndexedDB database called 'pwa_budget_tracker' and set it to version 1
const request = indexedDB.open('pwa_budget_tracker', 1);

// In indexedDB, the container that stores the data is an object store.
// Cant create an object store until the connectionto the database is open, emitting an event that the request variable will be able to capture
// This event will emit if the database version changes
request.onupgradeneeded = function(event) {
    //save a reference to the database
    const db = event.target.result;
    //create an object store (table) called 'transaction', set it to have an auto incrementing primary key of sorts
    db.createObjectStore('transaction', { autoIncrement: true });
};

// upon sucess
request.onsuccess = function(event) {
    // when db is successfully created with its object store (from onupgradeneeded) event above or simply established a connection, save reference to db in global variable
    db = event.target.result;

    // check if app is online, if yes run `uploadTransaction()' function to send all local db data to api
    if (navigator.onLine) {
        //
        // uploadTransaction()
    }
}

request.onerror = function(event) {
    // log error here
    console.log(event.target.errorCode);
}