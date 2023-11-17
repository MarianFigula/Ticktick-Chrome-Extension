// background.js

// TODO: disconnected port, na konci je #

console.log("BACKGROUND")


function requestAuth() {

    const authorizationUrl = `https://ticktick.com/oauth/authorize?` +
        `client_id=98tJj0kwfv0IvVmSFb` +
        `&scope=tasks:write tasks:read` +
        `&state=https://ticktick.com/oauth/authorize` +
        `&redirect_uri=https://rezervacie.elfsport.sk/moje-rezervacie` +
        `&response_type=code`;

    // Open a new tab or window to the authorization URL
    //window.open(authorizationUrl, '_blank');
    chrome.tabs.create({ url: authorizationUrl });
}

async function exchangeAuthforAccess() {
    //console.log(message.jsonArray)

    //const allTasks = message.jsonArray
    const clientID = '98tJj0kwfv0IvVmSFb';
    const clientSecret = '$C3h&JXT^lY(p0howq$l1^)1TX9v5Jd9';
    const redirectUri = 'https://rezervacie.elfsport.sk/moje-rezervacie';

    // Set up the request parameters to exchange the authorization code for an access token
    const tokenUrl = 'https://ticktick.com/oauth/token';
    const tokenData = new URLSearchParams();
    console.log("authcode befor post request: " + authorizationCode)
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
    await fetch(tokenUrl, {
        method: 'POST',
        headers: tokenHeaders,
        body: tokenData,
    })
        .then(tokenResponse => tokenResponse.json())
        .then(tokenData => {
            console.log(tokenData)
            accessToken = tokenData.access_token;
            console.log(`Access Token: ${accessToken}`);

            // allTasks.forEach(task => {
            //
            //     //console.log(`${task.date}'T'${task.startTime}:00+0000`)
            //     // Now, you have the access token, so you can proceed to create the task
            //     const createTaskUrl = 'https://ticktick.com/open/v1/task';
            //     const createTaskHeaders = new Headers({
            //         'Authorization': `Bearer ${accessToken}`,
            //         'Content-Type': 'application/json',
            //     });
            //
            //     const taskData = {
            //         title: task.title,
            //         content: "",
            //         startDate: `${task.date}T${task.startTime}:00+0000`, //'10-31T12:00:00+0000',
            //         dueDate: `${task.date}T${task.endTime}:00+0000`,
            //         isAllDay: false
            //     };
            //
            //     // Make the POST request to create the task
            //     fetch(createTaskUrl, {
            //         method: 'POST',
            //         headers: createTaskHeaders,
            //         body: JSON.stringify(taskData),
            //     })
            //         .then(createTaskResponse => createTaskResponse.json())
            //         .then(createTaskData => {
            //             console.log('Task created:', createTaskData);
            //         })
            //         .catch(createTaskError => {
            //             console.error('Error creating task:', createTaskError);
            //         });
            // })
        })
        .catch(tokenError => {
            console.error('Error exchanging authorization code for access token:', tokenError);
        });
}

var authorizationCode = null
let accessToken = null;
//
chrome.runtime.onConnect.addListener((port, sender, sendResponse) => {

    if (port.name === "getcode") {
// Retrieve the authorization code from local storage

        port.onMessage.addListener((message) => {
            if (message.action === "authRequest") {
                requestAuth();
            } else if (message.action === "authorizationCode") {
                console.log("Received message from Content Script 1:", message);
                chrome.storage.local.get('authorizationCode', async function (data) {
                    if (data.authorizationCode) {
                        authorizationCode = data.authorizationCode;
                        console.log('Authorization code: ' + authorizationCode);
                        await exchangeAuthforAccess()
                        chrome.storage.local.set({accessToken: accessToken}, function () {
                            console.log('accessToken saved.');
                        });
                        // You can use the authorization code as needed
                    } else {
                        console.log('Authorization code not found in local storage.');
                    }
                });
                return true;
            }
        })

    } else if (port.name === "addOrRemoveTask") {

        console.log("RECIEVED MESSAGE - ACCES TOKEN: " + accessToken)
        port.onMessage.addListener((message) => {
            if (message.action === "createTask") {
                if (accessToken === null){
                    port.postMessage({response: "no access token"});
                    return
                }

                const newTask = message.taskJson;

                console.log("TASK:")
                console.log(newTask)

                console.log(`${newTask.date}T${newTask.startTime}:00+0000`)
                console.log(newTask.startTime)
                console.log(newTask.endTime)
                //console.log(`${task.date}'T'${task.startTime}:00+0000`)
                // Now, you have the access token, so you can proceed to create the task
                const createTaskUrl = 'https://ticktick.com/open/v1/task';
                const createTaskHeaders = new Headers({
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                });


                const taskData = {
                    "title": newTask.title,
                    "content": "",
                    "startDate" : `${newTask.date}T${newTask.startTime}:00+0000`, //'10-31T12:00:00+0000'
                    "dueDate": `${newTask.date}T${newTask.endTime}:00+0000`,
                    "isAllDay": false
                };

                console.log("taskData:")
                console.log(taskData)

                //console.log('Request Body:', JSON.stringify(taskData, null, 2));
                // Make the POST request to create the task
                fetch(createTaskUrl, {
                    method: 'POST',
                    headers: createTaskHeaders,
                    body: JSON.stringify(taskData),
                })
                    .then(createTaskResponse => createTaskResponse.json())
                    .then(createTaskData => {
                        console.log('Task created:', createTaskData);
                        port.postMessage({response: "created"});
                    })
                    .catch(createTaskError => {
                        console.error('Error creating task:', createTaskError);
                        port.postMessage({response: "error create"});
                    })
                console.log("PRESLO:")
            } else if (message.action === "deleteTask") {
                //TODO: delete task - will not work - dont know where to find taskID/projectID


                port.postMessage({response: "deleted"});
            }
        })
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
