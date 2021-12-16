// Create a variable to hold db connection
let db;

// Establish a connection to IndexedDB database called 'pwa_budget_tracker' and set it to version 1
const request = indexedDB.open('pwa_budget_tracker', 1);