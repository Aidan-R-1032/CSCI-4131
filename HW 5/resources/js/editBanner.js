window.addEventListener("load", ()=>{
    const deleteSale = document.getElementById("end_sale");
    const editSale = document.getElementById("change_sale");
    const saleInfo = document.getElementById("sale_info");
    deleteSale.addEventListener("click", async (event)=> {
        event.preventDefault();
        const response = await fetch("/api/sale", {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if(response.ok){
            console.log("Successfully deleted sale")
        }
        else{
            console.log("Uh Oh! Couldn't delete sale")
        }
    });
    editSale.addEventListener("click", async (event)=> {
        event.preventDefault();
        const newMessage = {'message': saleInfo.value};
        const response = await fetch("/api/sale", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newMessage)
        })
        if(response.ok){
            console.log("Successfully edited sale")
        }
        else{
            console.log("Uh Oh! Couldn't edit sale")
        }
    });
})