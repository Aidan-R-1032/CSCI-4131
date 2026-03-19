import { decodeToken } from "./detokenize.js";
import { getPostIDs } from "./get_post_ids.js";
import { resortPosts } from "./resortPosts.js";

window.addEventListener("load", async ()=> {
    const edit_buttons = document.getElementsByClassName("edit");
    for(let i = 0; i < edit_buttons.length; i++){
        const edit_button = edit_buttons[i];
        const the_post = edit_button.parentNode.parentNode;// two levels up: post > post_buttons > edit
        const ids = getPostIDs(the_post)
        const uid = ids.uid
        const pid = ids.pid
        // console.log(`uid: ${uid}, pid: ${pid}`);
        const token = localStorage.getItem("token");
        const token_results = await decodeToken(token);
        if(token_results.id && parseInt(token_results.id) === uid){
            edit_button.style.visibility = "visible";
        }
        edit_button.addEventListener("click", async ()=> {
            if(token_results.id && (parseInt(token_results.id) === uid)){// verify that the post was created by the user
                const editContent = the_post.querySelector(".editContent");
                const content = the_post.querySelector(".post_content");
                editContent.style.display = "flex";
                content.style.display = "none";
                const saveButton = editContent.querySelector(".save");
                const editedBody = editContent.querySelector(".new_post_body")
                saveButton.addEventListener("click", async ()=>{
                    console.log(editedBody.value);
                    const response = await fetch("/api/post", {
                        method: "PUT",
                        body: new URLSearchParams({
                            uid: uid,
                            pid: pid,
                            new_post_body: editedBody.value
                        })
                    });
                    if(response.ok){
                        console.log("Edited the post!");
                        content.innerText = editedBody.value;
                        editContent.style.display = "none";
                        content.style.display = "flex";
                        const reload_request = await resortPosts();
                        if(!reload_request.error){
                            window.location.reload();
                        }
                    }
                    else {
                        editContent.style.display = "none";
                        content.style.display = "flex";
                        console.log("Could not edit post!")
                    }
                })
            }
            else {
                console.log("ID Mismatch!")
            }
        })
    }
})