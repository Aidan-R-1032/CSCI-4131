const mysql = require(`mysql-await`);

var connPool = mysql.createPool({
  connectionLimit: 5, 
  host: "127.0.0.1",
  user: "C4131F23U186",
  database: "C4131F23U186",
  password: "34646", 
});

async function addUser(data){
    return await connPool.awaitQuery("INSERT INTO users(username, password_hash) VALUES(?, ?)", [data.user, data.pass_hash]);
}

async function getUser(user){
    const result = await connPool.awaitQuery("SELECT * FROM users WHERE username=?", user);
    return result[0];
}

async function countUser(user){
    const result = await connPool.awaitQuery("SELECT COUNT(*) FROM users WHERE username=?", user);
    return result[0]['COUNT(*)'];
}

async function addPost(data){
    return await connPool.awaitQuery("INSERT INTO posts(user_id, author, content, post_date, like_count) VALUES(?, ?, ?, ?, ?)",
     [data.uid, data.username, data.post_body, data.post_date, 0]);
}

async function getPostsByDate(){
    const results = await connPool.awaitQuery("SELECT * FROM posts ORDER BY post_date DESC");
    return results;
}
async function getPostsByLikes(){
    const results = await connPool.awaitQuery("SELECT * FROM posts ORDER BY like_count DESC");
    return results;
}
async function deletePost(data){
    return await connPool.awaitQuery("DELETE FROM posts WHERE post_id=? AND user_id=?", [data.post_id, data.user_id]);
}
async function editPost(data){
    return await connPool.awaitQuery("UPDATE posts SET content=? WHERE user_id=? AND post_id=?",
    [data.body, data.user_id, data.post_id]);
}
async function countLike(data){
    const result = await connPool.awaitQuery("SELECT COUNT(*) FROM likes WHERE user_id=? AND post_id=?",
    [data.user_id, data.post_id]);
    return result[0]['COUNT(*)'];
}
async function addLike(data){
    const result = await connPool.awaitQuery("INSERT INTO likes(user_id, post_id) VALUES(?, ?)", 
    [data.user_id, data.post_id]);
    return result;
}
async function removeLike(data){
    return await connPool.awaitQuery("DELETE FROM likes WHERE user_id=? AND post_id=?", [data.user_id, data.post_id]);
}
async function likePost(data){
    return await connPool.awaitQuery("UPDATE posts SET like_count = like_count + 1 WHERE post_id=?", [data.post_id]);
}
async function unlikePost(data){
    return await connPool.awaitQuery("UPDATE posts SET like_count = like_count - 1 WHERE post_id=?", [data.post_id]);
}

module.exports = {addUser, getUser, countUser, addPost, getPostsByDate, getPostsByLikes, deletePost, editPost, countLike, addLike, removeLike,
    likePost, unlikePost}