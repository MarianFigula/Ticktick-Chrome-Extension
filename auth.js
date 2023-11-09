// // Define the URL for the token exchange
// const tokenExchangeUrl = 'https://ticktick.com/oauth/token';
//
// // Define the parameters you need to send
// const requestBody = new URLSearchParams();
// requestBody.append('client_id', 'your-client-id');
// requestBody.append('client_secret', 'your-client-secret');
// requestBody.append('code', 'authorization-code-obtained');
// requestBody.append('grant_type', 'authorization_code');
// requestBody.append('scope', 'tasks:read tasks:write');
// requestBody.append('redirect_uri', 'your-redirect-uri');
//
// // Make the POST request
// fetch(tokenExchangeUrl, {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//     },
//     body: requestBody.toString(),
// })
//     .then(response => response.json()) // Assuming the response is in JSON format
//     .then(data => {
//         // Handle the response data, which may contain the access token
//         console.log('Access Token:', data.access_token);
//     })
//     .catch(error => {
//         // Handle any errors that occur during the request
//         console.error('Error:', error);
//     });