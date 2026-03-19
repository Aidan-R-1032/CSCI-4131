async function fetch_sale(){
    const response = await fetch("/api/sale", {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    })
    placeholder = document.getElementById("placeholder");
    if(response.ok){
        res_json = await response.json()
        if(res_json.active){
            placeholder.style.visibility = 'visible'
            placeholder.innerText = "Sale: " + res_json.message;
        }
        else{
            placeholder.style.visibility = 'hidden'
        }
    }
    else{
        console.log("Uh oh!")
    }
}

window.addEventListener("load", () => {
    setInterval(fetch_sale, 1000)
})