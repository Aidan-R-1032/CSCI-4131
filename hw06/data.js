// this package behaves just like the mysql one, but uses async await instead of callbacks.
const mysql = require(`mysql-await`); // npm install mysql-await

// first -- I want a connection pool: https://www.npmjs.com/package/mysql#pooling-connections
// this is used a bit differently, but I think it's just better -- especially if server is doing heavy work.
var connPool = mysql.createPool({
  connectionLimit: 5, // it's a shared resource, let's not go nuts.
  host: "127.0.0.1",// this will work
  user: "C4131F23U186",
  database: "C4131F23U186",
  password: "34646", // we really shouldn't be saving this here long-term -- and I probably shouldn't be sharing it with you...
});

// later you can use connPool.awaitQuery(query, data) -- it will return a promise for the query results.

async function addContact(data){
    // you CAN change the parameters for this function. please do not change the parameters for any other function in this file.
    return await connPool.awaitQuery(
      'INSERT INTO contacts(contact_name, email, meeting, meeting_type, subscribe) VALUES(?, ?, ?, ?, ?)',
      [data.name, data.email, data.meeting, data.meeting_type, data.subscribe]);
}

async function deleteContact(id){
  return await connPool.awaitQuery('DELETE FROM contacts where id=?;', id);
}

async function getContacts() {
  return await connPool.awaitQuery('SELECT * FROM contacts;');
}

async function addSale(message) {
  return await connPool.awaitQuery('INSERT INTO sales(sale) VALUES(?);', message);
}

async function endSale() {
  return await connPool.awaitQuery('UPDATE sales SET end_time = CURRENT_TIMESTAMP WHERE end_time IS NULL;');
}

async function getRecentSales() {
  return await connPool.awaitQuery('SELECT * FROM sales ORDER BY start_time DESC LIMIT 3;');
}

module.exports = {addContact, getContacts, deleteContact, addSale, endSale, getRecentSales}