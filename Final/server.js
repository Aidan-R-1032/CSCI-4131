const port = 4132
const bcrypt = require("bcryptjs");
const express = require('express')
const data = require('./data')
const myWeb = express()
const jwt = require("jwt-simple");

const hasher = 10
const secret = "ovaewpanbrepia"//random keyboard typing
myWeb.use(express.urlencoded({extended: true}))
myWeb.use(express.json())
myWeb.use(express.static("resources"))
myWeb.set("views", "pug_templates")
myWeb.set("view engine", "pug")

let posts = [] 
async function startPosts(){
    posts = await data.getPostsByDate();
}
startPosts();

myWeb.get("/", async (req, res)=>{
    console.log(req.query.page)
    let page = parseInt(req.query.page ?? 1)
    if (!page) {
        page = 1;
    }
    const offset = (page-1)*10
    const shown_posts = posts.slice(offset, offset + 10)
    const end = Math.ceil(posts.length / 10)
    console.log(shown_posts)
    res.status(200).render("home.pug", {post_list: shown_posts, page: page, end: end})
})

myWeb.get("/home", async (req, res)=>{
    console.log(req.query.page)
    let page = parseInt(req.query.page ?? 1)
    if (!page) {
        page = 1;
    }
    const offset = (page-1)*10
    const shown_posts = posts.slice(offset, offset + 10)
    const end = Math.ceil(posts.length / 10)
    console.log(shown_posts)
    res.status(200).render("home.pug", {post_list: shown_posts, page: page, end: end})
})

myWeb.get("/sign_up", (req, res)=>{
    res.status(200).render("sign_up.pug", {taken: false, missing: false})
})

myWeb.get("/sign_in", (req, res)=>{
    res.status(200).render("sign_in.pug")
})

myWeb.get("/api/posts", async (req, res)=> {
    if(req.query.sort){
        const sort = req.query.sort;
        console.log(sort);
        if(sort === "Newest"){
            posts = await data.getPostsByDate();
            res.status(200).send(posts);
        }
        else if(sort === "Likes"){
            posts = await data.getPostsByLikes();
            res.status(200).send(posts);
        }
        else {
            res.status(401).send("Invalid sort type!")
        }
    }
    else {
        res.status(400).send("Missing sort type!");
    }
    console.log(`Sorted these posts: ${posts}`)
})

myWeb.post("/api/user", async (req, res)=> {//adds a new user to the database (point of sign_up)
    if (req.body.username && req.body.password) {
        const user = req.body.username
        user_count = await data.countUser(user)
        if (user_count == 0){
            const hash = bcrypt.hashSync(req.body.password, hasher);
            user_data = {
                user: user,
                pass_hash: hash
            }
            await data.addUser(user_data)
            res.status(201).render("sign_in.pug")
        }
        else{
            res.status(400).render("sign_up.pug", {taken: true, missing: false}) // username already taken
        }
    }
    else{
        res.status(400).render("sign_up.pug", {missing: true, missing: false}) // did not enter both a username and password
    }
})

myWeb.post("/api/auth", async (req, res)=>{//verify the user is in the database and creates a token (point of sign_in)
    user = req.body.username
    user_count = (await data.countUser(user))
    if (user_count == 1){
        user_info = (await data.getUser(user));
        // console.log(user_info)
        if(bcrypt.compareSync(req.body.password, user_info.password_hash)){
            const token = jwt.encode({ username: user_info.username, id: user_info.User_id }, secret);
            res.status(200).json({ token: token });
        }
        else {
            res.status(401).send("Bad password!")
        }
    }
    else {
        res.status(400).send("Could not find user!")
    }
})

myWeb.get("/api/username", async (req, res)=>{
    if(req.query.encoded){
        const decoded = jwt.decode(req.query.encoded, secret);
        if (decoded.username){
            const user = decoded.username;
            const id = decoded.id 
            // console.log(id)
            // console.log(user);
            user_count = (await data.countUser(user));
            if(user_count == 1){
                res.status(200).json(decoded)
            }
            else {
                res.status(401).send("Invalid name!")
            }
        }
        else {
            res.status(400).send("Bad token - no username field!")
        }
    }
    else {
        res.status(400).send("Did not send a token")
    }
})

myWeb.post("/api/post", async (req, res)=> {
    if(req.body.uid && req.body.username && req.body.post_body){
        const new_post = {
            uid: parseInt(req.body.uid),
            username: req.body.username,
            post_body: req.body.post_body,
            post_date: new Date()
        }
        console.log(new_post)
        await data.addPost(new_post)
        res.status(200).send("Ay-Okay!")
    }
    else {
        res.status(400).send("Missing required field")
    }
})

myWeb.delete("/api/post", async (req, res)=>{
    if(req.body.uid && req.body.pid){
        const post_data = {
            user_id: req.body.uid,
            post_id: req.body.pid
        };
        await data.deletePost(post_data);
        res.status(200).send("Removed specified post");
    }
    else {
        res.status(400).send("Missing required fields");
    }
})

myWeb.put("/api/post", async (req, res)=> {
    if(req.body.uid && req.body.pid && req.body.new_post_body){
        const editData = {
            user_id: req.body.uid,
            post_id: req.body.pid,
            body: req.body.new_post_body
        }
        console.log(editData)
        await data.editPost(editData);
        res.status(200).send("Edited specified post");
    }
    else {
        res.status(400).send("Missing required fields");
    }
})

myWeb.post("/api/like", async (req, res)=>{
    if (req.body.pid && req.body.uid){
        const like_data = {
            user_id: req.body.uid,
            post_id: req.body.pid
        }
        const likedAlready = await data.countLike(like_data)// see if we already like this
        if(likedAlready){// if we like it already, remove the like
            await data.removeLike(like_data);
            await data.unlikePost(like_data);
            res.status(200).send({status: "removed like"})
        }
        else {// if we didn't like it before, do it now
            await data.addLike(like_data);
            await data.likePost(like_data);
            res.status(200).send({status: "liked"})
        }
    }
    else {
        res.status(400).send("Missing required fields")
    }
})

myWeb.use((req, res, next) => {
    res.status(404).render("404.pug");
})

myWeb.listen (port , () => {  // starts the server; another callback pattern
    console.log(`My website is on http://localhost:4132/`);
})
