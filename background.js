chrome.browserAction.onClicked.addListener(function(activeTab){
  var newURL = "http://passwords.google.com/";
  chrome.tabs.create({ url: newURL });
});
