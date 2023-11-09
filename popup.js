// // Define the URL for the token exchange
// const tokenExchangeUrl = 'https://ticktick.com/oauth/token';
//
// // Define the parameters you need to send
// const requestBody = new URLSearchParams();
// requestBody.append('client_id', '98tJj0kwfv0IvVmSFb');
// requestBody.append('client_secret', '$C3h&JXT^lY(p0howq$l1^)1TX9v5Jd9');
// requestBody.append('code', 'NifotF');
// requestBody.append('grant_type', 'authorization_code');
// requestBody.append('scope', 'tasks:read tasks:write');
// requestBody.append('redirect_uri', 'https://rezervacie.elfsport.sk/moje-rezervacie');
//
// // Make the POST request
// fetch(tokenExchangeUrl, {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//     },
//     body: requestBody.toString(),
// })
//     .then(response => response.json())
//     .then(data => {
//         // Handle the response data, which may contain the access token
//         console.log('Access Token:', data.access_token);
//     })
//     .catch(error => {
//         // Handle any errors that occur during the request
//         console.error('Error:', error);
//     });
//
//
