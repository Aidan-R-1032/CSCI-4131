clicks = 0

function toggle_style(){
    console.log("Button was clicked")
    style = localStorage.getItem("style")
    console.log(style)
    if (style === "/css/main.css"){
        localStorage.setItem("style", "/css/main.dark.css")
    }
    else {
        localStorage.setItem("style", "/css/main.css")
    }
    clicks += 1;
    document.querySelector("link").setAttribute("href", localStorage.getItem("style"))
}

window.addEventListener("load", () => {
    console.log("Page was loaded");
    document.querySelector("link").setAttribute("href", localStorage.getItem("style"))
    localStorage.setItem("style", document.querySelector("link").getAttribute("href"))
    const toggler = document.getElementById("toggle-mode");
    toggler.addEventListener("click", toggle_style);
})