
// Content Script 2
const port2 = chrome.runtime.connect({ name: "addOrRemoveTask" });
let task = {}

function parseHtml() {
    let tag = document.querySelector("h4")
    let textInTag = tag.innerText;

    textInTag = textInTag.trim()

    const lines = textInTag.split('\n')

    if (lines.length !== 2)
        return;

    const dateLine = lines[0].trim();
    const timeRange = lines[1].trim();

    // Extract the date using a regular expression
    const dateMatch = dateLine.match(/(\d+\.\d+\.\d+)/);
    console.log("DM: " + dateMatch)
    if (!dateMatch) {
        return;
    }
    const date = dateMatch[0];
    const times = timeRange.split(' - ');
    if (times.length !== 2) {
        return;
    }

    const startTime = times[0];
    const endTime = times[1];

    console.log(getTitle())
    console.log(date);
    console.log(startTime);
    console.log(endTime);


    task['title'] = getTitle()
    task['date'] = convertDateFormat(date)
    task['startTime'] = startTime.trim()
    task['endTime'] = endTime.trim()
    task['myTaskId'] = getTaskId()

}

function getTitle(){
    const h1Elements = document.querySelectorAll('h1');
    console.log(h1Elements)
    for (let i = 0; i < h1Elements.length; i++) {
        if (h1Elements[i].textContent.includes('Posilňovňa')) {
            return h1Elements[i].innerText;
        }
    }
    return "Posilka/Stena/Plaváreň"
}

function convertDateFormat(inputDate) {
    // Split the input date string into day, month, and year
    const parts = inputDate.split('.');

    if (parts.length !== 3) {
        return false;
    }

    let day = parts[0];
    let month = parts[1];
    const year = parts[2];

    // Ensure day and month are zero-padded if necessary
    if (day.length === 1) {
        day = "0" + day;
    }
    if (month.length === 1) {
        month = "0" + month;
    }

    // Construct the new date string in "yyyy-MM-dd" format
    return year + "-" + month + "-" + day;
}

function getTaskId(){
    let url = window.location.href
    console.log("URL: " + url)
// Split the URL by '/'
    const urlParts = url.split('/');

// Get the last part of the URL
    const lastString = urlParts[urlParts.length - 1];

    console.log(lastString); // Output: 4210
    return lastString;

}

parseHtml()


console.log("ADD SINGLE - DATA: ")
console.log(task)

const linkCreateTask = document.querySelector("a.btn-primary"); // Select the anchor link with class 'btn-primary'
const linkDeleteTask = document.querySelector("a.btn-danger"); // Select the anchor link with class 'btn-primary'


if (linkCreateTask) {
    linkCreateTask.addEventListener("click", function (event) {
        // Prevent the default behavior of the anchor link
        event.preventDefault();
        console.log("sending action")
        // Execute your code, e.g., sending a message to the background script
        port2.postMessage({action: "createTask", taskJson: task})
    });
}

// if (linkDeleteTask){
//     linkDeleteTask.addEventListener("click", function (event){
//         event.preventDefault()
//
//         // TODO: dokoncit - neda sa ziska taskID/projectID
//         port2.postMessage({action: "deleteTask"})
//     })
// }


let backgroundProcessingComplete = false;
// Listen for messages from the background script
port2.onMessage.addListener((message) => {
    console.log(message.response)
    if (message.response === "created") {
        console.log("Data stored, response received.");

        backgroundProcessingComplete = true;
        if (backgroundProcessingComplete){
            navigateToNewPage(linkCreateTask);
            backgroundProcessingComplete = false
        }
    }else if (message.response === "error create" || message.response === "no access token"){
        console.log("error when creating / no access token")
        backgroundProcessingComplete = true;
        if (backgroundProcessingComplete)
            navigateToNewPage(linkCreateTask)
        backgroundProcessingComplete = false
    }
    else if (message.response === "deleted"){
        if (backgroundProcessingComplete)
            navigateToNewPage(linkDeleteTask)
        backgroundProcessingComplete = false
    }
});
function navigateToNewPage(link) {
    if (backgroundProcessingComplete) {
        window.location.href = link.href;
    }
}
