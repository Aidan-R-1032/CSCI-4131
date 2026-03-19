import { decodeToken } from './detokenize.js';

window.addEventListener("load", ()=> {
    localStorage.setItem("newPost", 0);
    const personal = document.getElementById("personal");
    const user = document.getElementById("user");
    const uid = document.getElementById("uid");
    const new_post = document.getElementById("new_user_post");
    const sign_in = document.getElementById("sign_in");
    const sign_out = document.getElementById("sign_out");
    setInterval(async ()=>{
        const token = localStorage.getItem("token");
        const result = await decodeToken(token);
        if (result.error){
            user.style.visibility = 'hidden';
            personal.style.visibility = 'hidden';
            new_post.style.visibility = 'hidden';
            sign_out.style.visibility = 'hidden';
            sign_in.style.visibility = 'visible';
        }
        else {
            personal.style.visibility = 'visible';
            user.style.visibility = 'visible';
            new_post.style.visibility = 'visible';
            sign_out.style.visibility = 'visible';
            sign_in.style.visibility = 'hidden';
            user.innerText = result.username;
            uid.innerText = result.id;
        }
    }, 1000);
});
