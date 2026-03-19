const express = require('express') // loads the express library - akin to an import statement; require is specifically for modules
const basicAuth = require('express-basic-auth')
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

const contacts = [
  {name: "John Doe", email: "jdoe2go@gmail.com", meeting: "2023-12-01", meeting_type: "Zoom", subscribe: "on", id: 1},
  {name: "Chris Dave", email: "chrismasDave@gmail.com", meeting: "2023-12-25", meeting_type: "Zoom", subscribe: "on", id: 2},
  {name: "Old School", email: "oldschooliscool@gmail.com", meeting: "2022-12-01", meeting_type: "Zoom", subscribe: "on", id: 3},
]

contact_id = contacts.length + 1;

const sale = {message: "", ongoing: false}

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

app.post("/contact", (req, res)=> {
  if(req.body.name && req.body['user-email'] && req.body.meeting && req.body.meeting_type){
    c = {
      name: req.body.name,
      email: req.body['user-email'],
      meeting: req.body.meeting, 
      meeting_type: req.body.meeting_type,
      subscribe: req.body.subscribe ?? 'off', 
      id: contact_id
    }
    contact_id += 1;
    console.log(c)
    contacts.push(c)
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
}), (req, res)=>{
    if((req.get('Content-Type') === 'application/json') && req.body.id){
      found = false
      for(let i = 0; i < contacts.length; i++){
        if(contacts[i].id === req.body.id){
          found = true
          contacts.splice(i, 1)
        }
      }
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

app.get("/api/sale", (req, res) => {
  if(sale.ongoing){
    res.status(200).send({active: sale.ongoing, message: sale.message})
  }
  else {
    res.status(200).send({active: false})
  }
})

app.delete("/api/sale", basicAuth({
  users: { 'admin': 'password' }, 
  challenge: true, 
  unauthorizedResponse: "Forbidden"
}), (req, res)=>{
  sale.ongoing = false;
  sale.message = '';
  res.status(200).send("deleted sale")
})

app.post("/api/sale", basicAuth({
  users: { 'admin': 'password' }, 
  challenge: true, 
  unauthorizedResponse: "Forbidden"
}), (req, res)=>{
  if((req.get('Content-Type') == 'application/json') && req.body.message){
    sale.message = req.body.message
    sale.ongoing = true
    res.status(200).send(req.body.message)
  }
})


app.get("/admin/contactlog", basicAuth({
  users: { 'admin': 'password' }, 
  challenge: true, 
  unauthorizedResponse: "Forbidden"
}), (req, res)=>{
  res.status(200).render("contactlog.pug", {title_info: titles.contact_log, contact_list: contacts})
})

app.use((req, res, next) => {
  res.status(404).render("404.pug", {title_info: titles.not_found})
})

app.listen (port , () => {  // starts the server; another callback pattern
  console.log(`Example app listening on port ${port}`)
})