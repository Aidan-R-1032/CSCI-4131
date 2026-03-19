const data = require('./data')

async function getContactList(contacts){
    contacts = await data.getContacts()
}

let c = []
logContacts(c)

console.log(`c: ${c}`)