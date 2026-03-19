import { resortPosts } from "./resortPosts.js";
window.addEventListener("load", ()=> {
    const sort = document.getElementById("post_ordering");
    const comfirm_sort = document.getElementById("go_sort");
    comfirm_sort.addEventListener("click", async ()=> {
        const sort_type = sort.value;
        console.log(sort_type);
        localStorage.setItem("sort", sort_type);
        const reload_request = await resortPosts();
        if(!reload_request.error){
            window.location.reload();
        }
    });
})