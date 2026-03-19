import { decodeToken } from "./detokenize.js";
import { getPostIDs } from "./get_post_ids.js";
import { resortPosts } from "./resortPosts.js";

window.addEventListener("load", async ()=> {
    const like_this_buttons = document.getElementsByClassName("like_this");
    for(let i = 0; i < like_this_buttons.length; i++){
        const like_this_button = like_this_buttons[i];
        const the_post = like_this_button.parentNode.parentNode;// two levels up: post > post_buttons > like_this
        const ids = getPostIDs(the_post);
        const token = localStorage.getItem("token");
        const token_results = await decodeToken(token);
        if(token_results.id){   // only those logged into accounts can like posts - so the like button is hidden for non-account holders
            like_this_button.style.visibility = "visible";
        }
        like_this_button.addEventListener("click", async ()=> {
            if(token_results.id){
                const uid = parseInt(token_results.id)
                const pid = ids.pid;
                console.log(`uid: ${uid}, pid: ${pid}`);
                const result = await fetch("/api/like", {
                    method: "POST",
                    body: new URLSearchParams({
                        uid: uid,
                        pid: pid
                    })
                });
                if(result.ok){
                    const like_count_elem = (like_this_button.parentElement).querySelector(".like_count");
                    console.log("edited the like status of the post!");
                    const response_body = await result.json()
                    const like_status = response_body.status;
                    console.log(like_status);
                    if (like_status === "liked"){
                        like_count_elem.innerText = parseInt(like_count_elem.innerText) + 1;
                    }
                    else {
                        like_count_elem.innerText = parseInt(like_count_elem.innerText) - 1;
                    }
                    await resortPosts();
                }
                else {
                    console.log("Couldn't edit the like status of the post!");
                }
            }
            else {
                console.log("Missing user id!");
            }
        })
    }
})