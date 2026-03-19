import { decodeToken } from "./detokenize.js";
import { getPostIDs } from "./get_post_ids.js";
import { resortPosts } from "./resortPosts.js";

window.addEventListener("load", async ()=> {
    const delete_buttons = document.getElementsByClassName("delete");
    for(let i = 0; i < delete_buttons.length; i++){
        const delete_button = delete_buttons[i];
        const the_post = delete_button.parentNode.parentNode;// two levels up: post > post_buttons > delete
        const ids = getPostIDs(the_post)
        const uid = ids.uid
        const pid = ids.pid
        // console.log(`uid: ${uid}, pid: ${pid}`);
        const token = localStorage.getItem("token");
        const token_results = await decodeToken(token);
        if(token_results.id && parseInt(token_results.id) === uid){
            delete_button.style.visibility = "visible";
        }
        delete_button.addEventListener("click", async ()=> {
            if(token_results.id && (parseInt(token_results.id) === uid)){// verify that the post was created by the user
                const result = await fetch("/api/post", {
                    method: "DELETE",
                    body: new URLSearchParams({
                        uid: uid,
                        pid: pid
                    })
                });
                if(result.ok){
                    console.log("Deleted the post!")
                    const reload_request = await resortPosts();
                    if(!reload_request.error){
                        window.location.reload();
                    }
                }
                else {
                    console.log("Could not delete post!")
                }
            }
            else {
                console.log("ID Mismatch!")
            }
        })
    }
})