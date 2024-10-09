// content.js
console.log("Content script loaded");

// Content Script 1
const port1 = chrome.runtime.connect({ name: "getcode" });

const ulNavBar = document.querySelector('ul.navbar-nav');


const newNavItem = document.createElement('li');
const ticktickLink = document.createElement('a')


newNavItem.className = 'nav-item';
ticktickLink.className = 'nav-link title'
ticktickLink.id = 'ticktickLink'
ticktickLink.href = "#"
ticktickLink.innerText = "Tick Tick"


newNavItem.appendChild(ticktickLink)
// Append the new <li> element to the <ul>
ulNavBar.appendChild(newNavItem);


ticktickLink.addEventListener('click', () => {
    console.log("link clicked")
    port1.postMessage({ action: "authRequest"}, response => {
        if (response) {
            console.log("response got");
        }
    })
})


function convertDateFormat(inputDate) {
    // Split the input date string into day, month, and year
    const parts = inputDate.split('.');

    if (parts.length !== 3) {
        return false;
    }

    let day = parts[0];
    let month = parts[1];
    let year = parts[2];

    if (day.length === 1) {
        day = "0" + day;
    }
    if (month.length === 1) {
        month = "0" + month;
    }


    return year + "-" + month + "-" + day;
}


const pageHTML = document.documentElement.outerHTML;


const parser = new DOMParser();
const doc = parser.parseFromString(pageHTML, 'text/html');
const data = [];
function parseHtmlData() {

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

function getAuthCode(){
    // Get the current URL
    let currentUrl = window.location.href;
    let paramString = "";
    let isCookieSet = false;

    if (!currentUrl.includes('?')){
        return;
    }

    chrome.storage.local.get('authorizationCode', function (data) {
        if (data.authorizationCode) {
            console.log("got from cookies")
            isCookieSet = true;
        }
    });

    if (isCookieSet)
        return;

    paramString = currentUrl.substring(currentUrl.indexOf('?') + 1);
    // Parse the URL to get the query parameters
    const urlSearchParams = new URLSearchParams(paramString);

    // Get the value of the 'code' parameter
    const authorizationCode = urlSearchParams.get('code');


    if (!authorizationCode)
        return;

    chrome.storage.local.set({authorizationCode: authorizationCode}, function () {
        console.log('Authorization code saved.');
    });

    port1.postMessage({ action: "authorizationCode"}, response => {
        if (response) {
            console.log("response got");
        }
    })
}

getAuthCode()


