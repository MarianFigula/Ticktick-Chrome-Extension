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
ulNavBar.appendChild(newNavItem);


ticktickLink.addEventListener('click', () => {
    console.log("link clicked")
    port1.postMessage({ action: "authRequest"}, response => {
        if (response) {
            console.log("response got");
        }
    })
})

const data = [];

function getAuthCode(){
    const currentUrl = window.location.href;
    let isCookieSet = false;

    if (!currentUrl.includes('?')) return;


    chrome.storage.local.get('authorizationCode', function (data) {
        if (data.authorizationCode) {
            console.log("got from cookies")
            isCookieSet = true;
        }
    });

    if (isCookieSet) return;

    const paramString = currentUrl.substring(currentUrl.indexOf('?') + 1);
    const urlSearchParams = new URLSearchParams(paramString);
    const authorizationCode = urlSearchParams.get('code');

    if (!authorizationCode) return;

    chrome.storage.local.set({authorizationCode: authorizationCode}, function () {
        console.log('Authorization code saved.');
    });

    port1.postMessage({ action: "authorizationCode"}, response => {
        console.log(response)
    })
}

getAuthCode()


