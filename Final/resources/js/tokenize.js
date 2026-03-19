async function login(username, password) {
   const response = await fetch("/api/auth", {
      method: "POST",
      body: new URLSearchParams({ 
         username: username,
         password: password })
   });
   if (response.ok) {
      const tokenResponse = await response.json();
      localStorage.setItem("token", tokenResponse.token);
      return true;
   }
   return false;
}

window.addEventListener("load", ()=>{
   const login_button = document.getElementById("login")
   const username = document.getElementById("username")
   const password = document.getElementById("password")
   login_button.addEventListener("click", async (event)=>{
      event.preventDefault();
      result = await login(username.value, password.value);
      if(result){
         window.location.href = "/home";  // if the user has successfully logged in, redirect them to the home page
      }
   })
})