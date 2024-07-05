"use strict";

//URL for the API
let url = "http://127.0.0.1:4000/api/work";

window.onload = init;

function init() {
    //Fetch jobs
    getJobs();
}

//Get jobs from API.
function getJobs() {
    fetch(url)
    .then(response => {
        if(response.status !=200) {
            return
        }
        return response.json()
        .then(data => writeJobs(data))
        .catch(err => console.log(err))
    })
}

//Write jobs
function writeJobs(jobArray) {
    const divElement = document.getElementById("joblist");

    //Make sure div is cleared so a new call to function drops the entire list and reprint a new one.
    divElement.innerHTML = "";

    //Writing every line in the table.
    jobArray.forEach(job=> {
        divElement.innerHTML += `<article><h3 class="job jobheaders">${job.companyname}</h3><div class="collapse"><h4 class="job"><span id="title${job._id}" contenteditable>${job.jobtitle}</span> på <span id="company${job._id}" contenteditable>${job.companyname}</span></h4><p id="description${job._id}" class="job" contenteditable>${job.description}</p><p class="job left">Anställd: <span id="startdate${job._id}" contenteditable>${job.startdate}</span> till <span id="enddate${job._id}" contenteditable>${job.enddate}</span> i <span id="location${job._id}" contenteditable>${job.location}</span>.</p><p class="job right"><span id="message${job._id}"></span><button type="button" class="update button" data-id="${job._id}">Uppdatera</button><button type="button" class="delete button" data-id="${job._id}">Radera</button></p></div></article>`;  
    });

    //Make delete and update-buttons work.
    let updateButtons = document.getElementsByClassName("update");
    let deleteButtons = document.getElementsByClassName("delete");

    for(let i=0; i < updateButtons.length; i++) {
        updateButtons[i].addEventListener("click", updateJob);
    }

    for(let i=0; i < deleteButtons.length; i++) {
        deleteButtons[i].addEventListener("click", deleteJob);
    }

    //Make collapsible CSS wok.
    let jobheaders = document.getElementsByClassName("jobheaders");

    for(let i=0; i < jobheaders.length; i++) {
        jobheaders[i].addEventListener("click", showCollapse);
    }

}

//Use fetch for functionality of update-button
function updateJob(event) {
    let id = event.target.dataset.id;
    let companyname = document.getElementById("company" + id).innerHTML;
    let jobtitle = document.getElementById("title" + id).innerHTML;
    let description = document.getElementById("description" + id).innerHTML;
    let startdate  = document.getElementById("startdate" + id).innerHTML;
    let enddate = document.getElementById("enddate" + id).innerHTML;
    let location = document.getElementById("location" + id).innerHTML;

    let jsonString = JSON.stringify({
        _id: id,
        companyname: companyname,
        jobtitle: jobtitle,
        location: location,
        startdate: startdate,
        enddate: enddate,
        description: description
    });

    fetch(url + "/" + id, {
        method: "PUT",
        headers: {
            "content-type": "application/json"
        },
        body: jsonString
    })
    .then(response => {
        if(response.status != 200) {
            //Show error message if update fails.
            let message = document.getElementById("message" + id);
            message.innerHTML = "Jobbet kunde inte uppdateras."
            return
        }
        return response.json()
        .then(getJobs)
        .catch(err => console.log(err))
    })
}

//Use fetch for functionality of -button
function deleteJob(event) {
    let id = event.target.dataset.id;

    fetch(url + "/" + id, {
        method: "DELETE"
    })
    .then(response => {
        if(response.status != 200) {
            //Show error-message in case delete fails.
            let message = document.getElementById("message" + id);
            message.innerHTML = "Jobbet kunde inte raderas.";
            return
        }
        return response.json()
        .then(getJobs)
        .catch(err => console.log(err))
    })
}

//Show collapsible CSS.
function showCollapse() {
    this.classList.toggle("active");
    let collapse = this.nextElementSibling;

    if(collapse.style.display === "block") {
        collapse.style.display = "none";
    } else {
        collapse.style.display = "block";
        
    }
}