function getDates(){
    dates = [];
    for(i = 1; i < all_rows.length; i++){
        dates[i] = (all_rows[i].children[2]).innerText;
    }
    return dates
}

function addDeletion(t_bod, all_rows, dates){
    k = 1;
    for(let row of all_rows){
        const button = row.children[row.children.length - 2];
        const person_id = row.children[row.children.length - 1];
        console.log(person_id);
        button.addEventListener("click", async () => {
            id = parseInt(person_id.innerText)
            console.log(id)
            message = {"id": id}
            const result = await fetch("/api/contact", {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(message)
            })
            if(result.ok){
                t_bod.removeChild(button.parentNode);
                dates.splice(k, 1)
            }
            else{
                console.log("Oh no!")
            }
        })
        k++;
    }
}
function updateTime(all_rows, dates){
    for(i = 1; i < all_rows.length; i++){
        console.log(dates)
        let row = all_rows[i];
        let dateNode = row.children[2];
        dateString = dates[i];
        console.log(dateString)
        dateFields = dateString.split("-");
        dateObj = new Date(parseInt(dateFields[0]), parseInt(dateFields[1]) - 1, parseInt(dateFields[2]));
        curDate = new Date();
        let ms = dateObj.getTime() - curDate.getTime();
        if(ms > 0){
            sec = Math.floor(ms / 1000);
            days = Math.floor(sec / (60 * 60 * 24));
            sec -= days * (60 * 60 * 24);
            hours = Math.floor(sec / (60 * 60));
            sec -= hours * (60 * 60);
            min = Math.floor(sec / 60);
            sec -= min * 60;
    
            readable_time = "";
            
            if(days > 0){
                readable_time = readable_time + days + " Days, ";
            }
            if(hours > 0){
                readable_time = readable_time + hours + " Hours, ";
            }
            if(min > 0){
                readable_time = readable_time + min + " Minutes, "
            }
            if(sec >= 0){
                readable_time = readable_time + sec + " Seconds"
            }
            dateNode.textContent = dateFields[0]+'-'+dateFields[1]+'-'+dateFields[2] + " - " + readable_time + " left";
        }
        else{
            dateNode.textContent = dateFields[0]+'-'+dateFields[1]+'-'+dateFields[2] + " - PAST";
        }
    }
}
window.addEventListener("load", () => {
    table = document.querySelector("table")
    t_bod = table.tBodies[0]
    all_rows = t_bod.children
    addDeletion(t_bod, all_rows, getDates(all_rows));
    setInterval(()=>updateTime(all_rows, getDates(all_rows)), 1000);
})
