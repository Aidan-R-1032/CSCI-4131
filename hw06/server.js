const express = require('express') // loads the express library - akin to an import statement; require is specifically for modules
const basicAuth = require('express-basic-auth')
const data = require('./data')
const app = express() // creates an express object; entrypoint to expressjs library
const port = 4131

app.set("views", "templates")
app.set("view engine", "pug")

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(express.static("resources"))

const titles = {
  main: ["Ruiz Foundation", "Grind. Optimize. Automate. Thrive."], 
  testimonies: ["Read Reviews", "Here's what our customers have to say!"], 
  contact: ["Schedule an Appointment", "Let's plan a meeting!"],
  contact_log: ["My Contacts", "See your appointments!"],
  not_found: ["404", "Page Not Found"]
}

const reviews = [
  {body: '"The Ruiz Foundation helped me throughout my major by providing resources."', name: 'John S.'},
  {body: '"I love the G.O.A.T. mindset!"', name: 'Samuel J.'},
  {body: '"I tried various programs in the past before, but none can compare to what hte Ruiz Foundation provides."', name: 'Sarah B.'},
  {body: '"The Ruiz Foundation is the GOAT!"', name: 'Micheal J.'},
  {body: '"The G.O.A.T. mindset helped me finish my projects and pass with full marks!"', name: 'Abigail K.'}
]

app.get("/", (req, res)=>{
  res.status(200).render("mainpage.pug", {title_info: titles.main})
})

app.get("/main", (req, res)=>{
  res.status(200).render("mainpage.pug", {title_info: titles.main})
})

app.get("/testimonies", (req, res)=> {
  res.status(200).render("testimonies.pug", {title_info: titles.testimonies, reviews: reviews})
})

app.get("/contact", (req, res)=> {
  res.status(200).render("contactform.pug", {title_info: titles.contact})
})

app.post("/contact", async (req, res)=> {
  if(req.body.name && req.body['user-email'] && req.body.meeting && req.body.meeting_type){
    c = {
      name: req.body.name,
      email: req.body['user-email'],
      meeting: req.body.meeting, 
      meeting_type: req.body.meeting_type,
      subscribe: req.body.subscribe ?? 'off', 
    }
    await data.addContact(c); // new mysql 
    res.status(201).render("contactform_success.pug", {title_info: titles.contact})
  }
  else {
    res.status(400).render("contactform_failure.pug", {title_info: titles.contact})
  }
})

app.delete("/api/contact", basicAuth({
  users: { 'admin': 'password' }, 
  challenge: true, 
  unauthorizedResponse: "Forbidden"
}), async (req, res)=>{
    if((req.get('Content-Type') === 'application/json') && req.body.id){
      
      start = (await (await data.getContacts())).length; //new mysql
      data.deleteContact(req.body.id);
      end = (await (await data.getContacts())).length; // new mysql
      found = (end + 1 === start);
      
      if(found){
        res.status(200).send('Deleted a contact')
      }
      else {
        res.status(404).send('Bad Id')
      }
    }
    else {
      res.status(400).send('Missing Content-Type or ID')
    }
})

app.get("/api/sale", async (req, res) => {
  most_recent_sales = await (await data.getRecentSales());
  active_sale = false;
  if (most_recent_sales.length > 0){
    most_recent_sale = most_recent_sales[0];
    console.log(most_recent_sale)
    if(!(most_recent_sale.end_time)){
      active_sale = true;
    }
  }
  if(active_sale){
    res.status(200).send({active: true, message: most_recent_sale.sale})
  }
  else {
    res.status(200).send({active: false})
  }
})

app.get("/api/salelog", basicAuth({
  users: { 'admin': 'password' }, 
  challenge: true, 
  unauthorizedResponse: "Forbidden"
}), async (req, res) => {
  most_recent_sales = await (await data.getRecentSales())
  sale_log = []
  for(i = 0; i < most_recent_sales.length; i++){
    active_sale = false
    sale = most_recent_sales[i];
    if(!(sale.end_time)){
      active_sale = true;
    }
    sale_json = {"message": sale.sale, "active": active_sale}
    sale_log.push(sale_json)
  }
  res.status(200).send(sale_log)
})

app.delete("/api/sale", basicAuth({
  users: { 'admin': 'password' }, 
  challenge: true, 
  unauthorizedResponse: "Forbidden"
}), async (req, res)=>{
  await data.endSale(); // new mysql
  res.status(200).send("deleted sale")
})

app.post("/api/sale", basicAuth({
  users: { 'admin': 'password' }, 
  challenge: true, 
  unauthorizedResponse: "Forbidden"
}), async (req, res)=>{
  if((req.get('Content-Type') == 'application/json') && req.body.message){
    await data.addSale(req.body.message); // new mysql
    res.status(200).send(req.body.message)
  }
})


app.get("/admin/contactlog", basicAuth({
  users: { 'admin': 'password' }, 
  challenge: true, 
  unauthorizedResponse: "Forbidden"
}), async (req, res)=>{
  let contacts = await (await data.getContacts()) // new mysql
  for (i = 0; i < contacts.length; i++){
    date = new Date(contacts[i].meeting)
    let year = date.getFullYear();
    let month = date.getMonth() + 1; 
    let day = date.getDate();
    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;
    let formattedDate = `${year}-${month}-${day}`;
    contacts[i].meeting = formattedDate;
  }
  res.status(200).render("contactlog.pug", {title_info: titles.contact_log, contact_list: contacts})// new mysql
})

app.use((req, res, next) => {
  res.status(404).render("404.pug", {title_info: titles.not_found})
})

app.listen (port , () => {  // starts the server; another callback pattern
  console.log(`Example app listening on port ${port}`)
})