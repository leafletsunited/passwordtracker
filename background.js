chrome.browserAction.onClicked.addListener(function() {
chrome.tabs.create({url: 'https://passwords.google.com'});
});
