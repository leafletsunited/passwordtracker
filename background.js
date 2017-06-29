chrome.browserAction.onClicked.addListener(function() {
chrome.tabs.create({url: 'https://passwords.google.com'});
});
var x = "";

chrome.runtime.onMessage.addListener(function(response, sender, sendResponse) {
   x = response;
})

chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
    chrome.tabs.sendMessage(tabs[0].id, {action: x}, function(response) {});
});
