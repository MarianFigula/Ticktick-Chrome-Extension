// background.js


let htmlContent = null;


// Define a function to handle messages received from content scripts
// function handleMessage(request, sender, sendResponse) {
//     if (request.htmlContent) {
//         htmlContent = request.htmlContent
//
//         // Send a response (optional)
//         sendResponse({ message: "HTML content received" });
//     }
// }
// Add a message listener to listen for messages from content scripts
//chrome.runtime.onMessage.addListener(handleMessage);
//
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     if (message.action === "exchangeToken") {
//         const clientID = '98tJj0kwfv0IvVmSFb';
//         const clientSecret = '$C3h&JXT^lY(p0howq$l1^)1TX9v5Jd9';
//         const authorizationCode = message.authorizationCode;
//         const redirectUri = 'https://rezervacie.elfsport.sk/moje-rezervacie';
//
//         // Set up the request parameters
//         const url = 'https://ticktick.com/oauth/token';
//         const data = new URLSearchParams();
//         data.append('code', authorizationCode);
//         data.append('grant_type', 'authorization_code');
//         data.append('scope', 'tasks:write tasks:read');
//         data.append('redirect_uri', redirectUri);
//
//         // Set up the request headers for Basic Auth and content type
//         const headers = new Headers({
//             'Authorization': `Basic ${btoa(`${clientID}:${clientSecret}`)}`,
//             'Content-Type': 'application/x-www-form-urlencoded',
//         });
//
//         // Make the POST request using fetch
//         fetch(url, {
//             method: 'POST',
//             headers: headers,
//             body: data,
//         })
//             .then(response => response.json())
//             .then(data => {
//                 const accessToken = data.access_token;
//                 sendResponse({ accessToken });
//             })
//             .catch(error => {
//                 console.error('Error exchanging authorization code for access token:', error);
//             });
//
//         return true;
//     }
// });
console.log("BACKGROUND")


// background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "test") {
        // Simulate a database operation (replace with your actual code)
        console.log("Simulating data storage...");

        // Once the database operation is complete, you can send a response
        // back to the content script to signal that data storage is done.
        const response = {
            accessToken: "your-access-token" // Replace with your actual response data
        };

        sendResponse(response);
    }
});





//
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "test"){
        console.log("TEST")
    }

    // Retrieve the authorization code from local storage
    let authorizationCode = null;
    chrome.storage.local.get('authorizationCode', function(data) {
        if (data.authorizationCode) {
            authorizationCode = data.authorizationCode;
            console.log('Authorization code: ' + authorizationCode);

            // You can use the authorization code as needed
        } else {
            console.log('Authorization code not found in local storage.');
            return;
        }
    });

    if (message.action === "exchangeToken" &&  authorizationCode !== null) {


        console.log(message.jsonArray)

        const allTasks = message.jsonArray
        const clientID = '98tJj0kwfv0IvVmSFb';
        const clientSecret = '$C3h&JXT^lY(p0howq$l1^)1TX9v5Jd9';
        const redirectUri = 'https://rezervacie.elfsport.sk/moje-rezervacie';

        // Set up the request parameters to exchange the authorization code for an access token
        const tokenUrl = 'https://ticktick.com/oauth/token';
        const tokenData = new URLSearchParams();
        tokenData.append('code', authorizationCode);
        tokenData.append('grant_type', 'authorization_code');
        tokenData.append('scope', 'tasks:write tasks:read');
        tokenData.append('redirect_uri', redirectUri);

        // Set up the request headers for Basic Auth and content type
        const tokenHeaders = new Headers({
            'Authorization': `Basic ${btoa(`${clientID}:${clientSecret}`)}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        });

        // Make the POST request to exchange the authorization code for an access token
        fetch(tokenUrl, {
            method: 'POST',
            headers: tokenHeaders,
            body: tokenData,
        })
            .then(tokenResponse => tokenResponse.json())
            .then(tokenData => {
                const accessToken = tokenData.access_token;
                console.log(`Access Token: ${accessToken}`);

                allTasks.forEach(task => {

                    //console.log(`${task.date}'T'${task.startTime}:00+0000`)
                    // Now, you have the access token, so you can proceed to create the task
                    const createTaskUrl = 'https://ticktick.com/open/v1/task';
                    const createTaskHeaders = new Headers({
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    });

                    const taskData = {
                        title: task.title,
                        content: "",
                        startDate: `${task.date}T${task.startTime}:00+0000`, //'10-31T12:00:00+0000',
                        dueDate: `${task.date}T${task.endTime}:00+0000`,
                        isAllDay: false
                    };

                    // Make the POST request to create the task
                    fetch(createTaskUrl, {
                        method: 'POST',
                        headers: createTaskHeaders,
                        body: JSON.stringify(taskData),
                    })
                        .then(createTaskResponse => createTaskResponse.json())
                        .then(createTaskData => {
                            console.log('Task created:', createTaskData);
                        })
                        .catch(createTaskError => {
                            console.error('Error creating task:', createTaskError);
                        });
                })
            })
            .catch(tokenError => {
                console.error('Error exchanging authorization code for access token:', tokenError);
            });

        return true;
    }

    else if (message.action === "addSingle"){
        const clientID = '98tJj0kwfv0IvVmSFb';
        const clientSecret = '$C3h&JXT^lY(p0howq$l1^)1TX9v5Jd9';
        const redirectUri = 'https://rezervacie.elfsport.sk/moje-rezervacie';

        // Set up the request parameters to exchange the authorization code for an access token
        const tokenUrl = 'https://ticktick.com/oauth/token';
        const tokenData = new URLSearchParams();
        tokenData.append('code', authorizationCode);
        tokenData.append('grant_type', 'authorization_code');
        tokenData.append('scope', 'tasks:write tasks:read');
        tokenData.append('redirect_uri', redirectUri);

        // Set up the request headers for Basic Auth and content type
        const tokenHeaders = new Headers({
            'Authorization': `Basic ${btoa(`${clientID}:${clientSecret}`)}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        });

        // Make the POST request to exchange the authorization code for an access token
        fetch(tokenUrl, {
            method: 'POST',
            headers: tokenHeaders,
            body: tokenData,
        })
            .then(tokenResponse => tokenResponse.json())
            .then(tokenData => {
                const accessToken = tokenData.access_token;
                console.log(`Access Token: ${accessToken}`);

                allTasks.forEach(task => {

                    //console.log(`${task.date}'T'${task.startTime}:00+0000`)
                    // Now, you have the access token, so you can proceed to create the task
                    const createTaskUrl = 'https://ticktick.com/open/v1/task';
                    const createTaskHeaders = new Headers({
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    });

                    const taskData = {
                        title: task.title,
                        content: "",
                        startDate: `${task.date}T${task.startTime}:00+0000`, //'10-31T12:00:00+0000',
                        dueDate: `${task.date}T${task.endTime}:00+0000`,
                        isAllDay: false
                    };

                    // Make the POST request to create the task
                    fetch(createTaskUrl, {
                        method: 'POST',
                        headers: createTaskHeaders,
                        body: JSON.stringify(taskData),
                    })
                        .then(createTaskResponse => createTaskResponse.json())
                        .then(createTaskData => {
                            console.log('Task created:', createTaskData);
                        })
                        .catch(createTaskError => {
                            console.error('Error creating task:', createTaskError);
                        });
                })
            })
            .catch(tokenError => {
                console.error('Error exchanging authorization code for access token:', tokenError);
            });
    }
});


//
//
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     if (message.action === "createTask") {
//         const accessToken = message.accessToken; // Access token obtained earlier
//
//         // Task details to be sent in the request body
//         const taskData = {
//             title: message.title,
//             content: message.content,
//             startDate: message.startDate,
//             dueDate: message.dueDate,
//         };
//
//         // Set up the request parameters
//         const url = 'https://ticktick.com/open/v1/task';
//         const headers = new Headers({
//             'Authorization': `Bearer ${accessToken}`,
//             'Content-Type': 'application/json',
//         });
//
//         // Make the POST request using fetch
//         fetch(url, {
//             method: 'POST',
//             headers: headers,
//             body: JSON.stringify(taskData),
//         })
//             .then(response => response.json())
//             .then(data => {
//                 console.log('Task created:', data);
//             })
//             .catch(error => {
//                 console.error('Error creating task:', error);
//             });
//
//         return true;
//     }
// });
