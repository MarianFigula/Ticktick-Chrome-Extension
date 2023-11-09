
console.log("A")
chrome.storage.local.get('authorizationCode', function(data) {
    console.log("AAA")
    console.log("authcod: " + data.authorizationCode)
    if (!data.authorizationCode) {

        // Define the URL and parameters
        const authorizationUrl = `https://ticktick.com/oauth/authorize?` +
            `client_id=98tJj0kwfv0IvVmSFb` +
            `&scope=tasks:write tasks:read` +
            `&state=https://ticktick.com/oauth/authorize` +
            `&redirect_uri=https://rezervacie.elfsport.sk/moje-rezervacie` +
            `&response_type=code`;

// Open a new tab or window to the authorization URL
        window.open(authorizationUrl, '_blank');
    }
});

