window.addEventListener("load", () => {
    const date = document.getElementById("meeting");
    const type = document.getElementById("meeting_type")
    scheduler = document.getElementById("scheduler");
    const submit_button = document.getElementById("submit");
    function calculate_cost(){
        total = 0;
        meet_date = date.value;
        currDateTime = new Date();
        date_obj = new Date(meet_date + "Z");
        if(date_obj.getMonth() == currDateTime.getMonth()){
            total += 10;
        }
        else{
            total += 5;
        }

        meet_type = type.value;
        if (meet_type === "Zoom" || meet_type === "Google Meet"){
            total += 2;
        }
        else {
            total += 4;
        }
        return parseFloat(total)
    }
    const update = ()=>{
        let children = scheduler.children;
        if(children.length == 7){
            // console.log("Children before deletion: ");
            // console.log(children)
            scheduler.removeChild(children[children.length - 2])
            children = scheduler.children;
            // console.log("Children after deletion: ");
            // console.log(children)
        }
        let total = calculate_cost();

        total_cost = document.createElement("div");
        newText = document.createTextNode("Total: $" + total);
        total_cost.append(newText);

        // console.log("Children before append: ");
        // console.log(children)
        scheduler.appendChild(total_cost);        
        children = scheduler.children;
        scheduler.insertBefore(children[children.length -1], children[children.length -2])
        // console.log("Children after append: ");
        // console.log(children)
    };
    date.addEventListener("input", update)
    type.addEventListener("input", update)
})