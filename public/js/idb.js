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
    //create an object store (table) called 'new_transaction', set it to have an auto incrementing primary key of sorts
    db.createObjectStore('new_transaction', { autoIncrement: true });
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

// This function will be executed if we attemp to submit a new transaction and there is no internet connection
function saveTransactionForBudget(record) {
    // open a new transaction with the database with read and write permissions
    const transaction = db.transaction(['new_transaction'], 'readwrite');
    // access the object store for 'new_transaction'
    const transactionObjectStore = transaction.objectStore('new_transaction');
    // add record to your store with add method
    transactionObjectStore.add(record)
}

function uploadTransaction() {
    // open a transaction on your db
    const transaction = db.transaction(['new_transaction'], 'readwrite');
    // access your object store
    const transactionObjectStore = transaction.objectStore('new_transaction');
    // get all records from store and set to a variable
    const getAll = transactionObjectStore.getAll();

    getAll.onsuccess = function() {
        // if there was data in indexedDB's store, let's send it to the api server
        if (getAll.result.length > 0) {
            fetch('/api/transaction/...', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(serverResponse => {
                if (serverResponse.message) {
                    throw new Error(serverResponse);
                }
                //open one more transaction
                const transaction = db.transaction(['new_transaction'], 'readwrite');
                //access the 'new_transaction' object store
                const transactionObjectStore = transaction.objectStore('new_transaction');
                //clear all items in your store
                transactionObjectStore.clear();

                alert('All saved transactions have been submitted!');
            })
            .catch(err => {
                console.log(err);
            });
        }
    };
};

// listen for app coming back online
window.addEventListener('online', uploadTransaction);