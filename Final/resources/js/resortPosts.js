export async function resortPosts(){
    const sort_type = localStorage.getItem("sort") ?? "Newest";
    const result = await fetch(`/api/posts?sort=${encodeURIComponent(sort_type)}`, {
        method: "GET",
    });
    if(result.ok){
        console.log("Sorted the posts!");
        return await result.json();
    }
    else {
        console.log("Could not sort the posts!");
        return await {error: "Could not fetch!"};
    }
}