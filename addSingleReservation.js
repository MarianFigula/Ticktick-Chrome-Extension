// Retrieve the HTML content of the current page
const pageHTML = document.documentElement.outerHTML;

const parser = new DOMParser();
const doc = parser.parseFromString(pageHTML, 'text/html');

function parseHtml() {
    let tag = document.querySelector("h4")
    let textInTag = tag.innerText;

    textInTag = textInTag.trim()

    var lines = textInTag.split('\n')

    if (lines.length !== 2)
        return;

    var dateLine = lines[0].trim();
    var timeRange = lines[1].trim();

    // Extract the date using a regular expression
    var dateMatch = dateLine.match(/(\d+\.\d+\.\d+)/);
    console.log("DM: " + dateMatch)
    if (!dateMatch) {
        return;
    }
    var date = dateMatch[0];
    var times = timeRange.split(' - ');
    if (times.length !== 2) {
        return;
    }

    var startTime = times[0];
    var endTime = times[1];

    console.log("1. Date: " + date);
    console.log("2. Start Time: " + startTime);
    console.log("3. End Time: " + endTime);

}


// const link = document.querySelector("a.btn-primary"); // Select the anchor link with class 'btn-primary'
//
// console.log(link)
//
// if (link) {
//     link.addEventListener("click", function (event) {
//         // Prevent the default behavior of the anchor link
//         event.preventDefault();
//
//         // Execute your code, e.g., sending a message to the background script
//         chrome.runtime.sendMessage({
//             action: "test",
//             jsonArray: "ssss"
//         }, response => {
//             if (response && response.accessToken) {
//                 console.log("Data stored, response received.");
//
//                 // Delay navigation to the link after a certain time (e.g., 1000 milliseconds)
//                 setTimeout(function () {
//                     window.location.href = link.href;
//                 }, 1000); // Adjust the delay time as needed
//             }
//         });
//     });
// }
//
//

