// content.js
console.log("Content script loaded");


function convertDateFormat(inputDate) {
    // Split the input date string into day, month, and year
    var parts = inputDate.split('.');

    if (parts.length !== 3) {
        return false;
    }

    var day = parts[0];
    var month = parts[1];
    var year = parts[2];

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

// Retrieve the HTML content of the current page
const pageHTML = document.documentElement.outerHTML;


const parser = new DOMParser();
const doc = parser.parseFromString(pageHTML, 'text/html');
var data = [];
function parseHtmlData() {
    // Find the first table element in the parsed document
    const firstTable = doc.querySelector('table');

    if (!firstTable){
        console.log("no table found");
        return;
    }

    const tbody = firstTable.querySelector('tbody');

    if (!tbody){
        console.log("no tbody found")
        return;
    }


    // Get all the table rows (tr elements) within the tbody
    const rows = tbody.querySelectorAll('tr');

    // Iterate through the rows
    rows.forEach(row => {
        // Get all the table cells (td elements) within the current row
        const cells = row.querySelectorAll('td');

        // Create a JSON object to store cell content
        const rowData = {};

        // Iterate through the cells except the last one
        for (let i = 0; i < cells.length; i++) {
            // Get the content of the cell
            let cellContent = cells[i].textContent;
            cellContent = cellContent.replace(/[\s\n]/g, '');

            if (cellContent.includes('-')) {
                let substrings = cellContent.split('-')
                let substring1 = substrings[0];
                let substring2 = substrings[1];
                rowData['startTime'] = substring1
                rowData['endTime'] = substring2
                continue
            }

            let convertedDate = convertDateFormat(cellContent)

            if (convertedDate !== false) {
                rowData['date'] = convertedDate;
                console.log('Cell Content:', cellContent.replace(/[\s\n]/g, ''));
                continue;

            }

            if (i === cells.length - 1) {
                // Handle the last cell differently (get the href from the last <a> tag)
                const lastCellLink = cells[i].querySelector('a');
                if (lastCellLink) {
                    // Get the href attribute
                    const href = lastCellLink.getAttribute('href');
                    console.log("HREF: " + href)
                    //rowData["lastCellHref"] = href;
                    // Assuming you have already obtained the href value
                    const numberMatch = href.match(/\d+/);

                    if (numberMatch) {
                        const extractedNumber = parseInt(numberMatch[0]);
                        rowData['workoutId'] = extractedNumber
                        console.log("Extracted Number: " + extractedNumber);
                    } else {
                        console.log("No number found in the href.");
                    }
                }
                continue;
            }

            rowData["title"] = cellContent;

        }
        data.push(rowData)
    });
    console.log(data)
}

//parseHtmlData()

// Get the current URL
let currentUrl = window.location.href;

console.log(currentUrl)

let paramString = "";

if (currentUrl.includes('?')) {
    paramString = currentUrl.substring(currentUrl.indexOf('?') + 1);
}
console.log(currentUrl);


// Parse the URL to get the query parameters
const urlSearchParams = new URLSearchParams(paramString);

// Get the value of the 'code' parameter
const authorizationCode = urlSearchParams.get('code');


console.log(authorizationCode)

// Check if the code parameter exists
if (authorizationCode) {
    // The authorization code is available, and you can proceed with the token exchange
    console.log('Authorization Code:', authorizationCode);
    // Save the authorization code to local storage
    chrome.storage.local.set({authorizationCode: authorizationCode}, function () {
        console.log('Authorization code saved.');
    });
} else {
    // Handle the case where the 'code' parameter is not present in the URL
    console.error('Authorization Code not found in the URL.');
}


// FIRST MESSAGE TO HANDLE
// chrome.runtime.sendMessage({
//     action: "exchangeToken",
//     jsonArray: data
// }, response => {
//     if (response && response.accessToken) {
//         console.log("response got");
//     }
// });



