import { decodeToken } from "./detokenize.js";
import { resortPosts } from "./resortPosts.js";

const post_button = document.getElementById("post_this");
post_button.addEventListener("click", async ()=>{
    localStorage.setItem("newPost", 0);
    const token = localStorage.getItem("token") ?? "";
    const result = await decodeToken(token);
    if (!result.error){
        const post_body = document.getElementById("new_post_body");
        const response = await fetch("/api/post", {
            method: "POST",
            body: new URLSearchParams({ 
               uid: result.id,
               username: result.username,
               post_body: post_body.value,
            })
        });
        if(response.ok){
            console.log("Created Post!");
            const reload_request = await resortPosts();
            if(!reload_request.error){
                window.location.reload();
            }
        }
        else {
            console.log("Could not create post!")
        }
    }
});