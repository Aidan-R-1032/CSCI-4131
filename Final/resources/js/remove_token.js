window.addEventListener("load", ()=> {
    const sign_out = document.getElementById("sign_out")
    sign_out.addEventListener("click", ()=> {
        localStorage.setItem("token", "");
        localStorage.setItem("newPost", 0);
        localStorage.setItem("deleted", 0);
        localStorage.setItem("edits", 0);
        window.location.reload();
    })
})