var x = "";
var url = "";
var passwords = [];
chrome.storage.local.get({"thePasswords": []}, function(result){
      passwords = result.thePasswords;
    })


var urls = []

  chrome.storage.local.get({"theUrls": []}, function(result){
    urls = result.theUrls;
    })
var t = 0;


function saveTextAsFile( a,  b , c)
{
    var textToSave = "Urls:  " + a + "\n" + "\n" + "Passwords:  " + b + "\n" + "\n" + "Frequency: " + c;
    var textToSaveAsBlob = new Blob([textToSave], {type:"text/plain"});
    var textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);
    var fileNameToSaveAs = "Passwords";

    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    downloadLink.href = textToSaveAsURL;
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);

    downloadLink.click();
}



var repeat = 1;


chrome.runtime.onMessage.addListener(function(message) {
  if(message.type == "m1") {
    if(message != "")
    {
      x = message.content;
    }
  }
  if(message.type == "m2") {
    url = message.content;
    url = url.split('?')[0]
    if(urls.includes(url))
    {
      console.log("We already have data from this url")
    }
    else
    {
      urls.push(url);
      passwords.push(x);
      console.log("new url pushed")
      console.log("new pass pushed")
      chrome.storage.local.set({"thePasswords": passwords}, function(){})
      chrome.storage.local.set({"theUrls": urls}, function(){})
    }
}
    console.log(passwords)
    console.log(urls)

  })


function download(){

  var map = passwords.reduce(function(prev, cur) {
  prev[cur] = (prev[cur] || 0) + 1;
  return prev;
  }, {});
  var final =JSON.stringify(map)
  saveTextAsFile(urls,passwords,final)
}

for(var i = 0; i<31; i++)
{
  setInterval(function track(){
    console.log(i);
    if(i>30)
    {
        alert("It has been one month since you changed your passwords, we reccomend clicking the Passtracker Icon in the top right corner for a detailed summary of your password use")
        i=0;
    }

  }, 86400000)
}

chrome.browserAction.onClicked.addListener(function() {
chrome.tabs.create({url: 'https://passwords.google.com'});
if(confirm("Would you like to download your password data analysis?"))
  {
  download();
  }
});




/*chrome.runtime.onMessage.addListener(function(response, sender, sendResponse) {
   if(response != "" )
   {
   x = response;
   passwords.push(response);
   console.log("Password Pushed" )
   i++;
  }


function reused()
{
  var reused = 1;
  var length = passwords.length-1; //Because of index starting at 0
  for(var x = length; x >=0 ; x--)
    {
      for(var i = x-1; i>=0; i-- )
        {
          if(passwords[i]=passwords[x])
            {
              repeat++;
            }
        }
      }
    }
    url = message.content;
    url = url.split('?')[0]
    rawUrls.push(url)
    finalUrls = rawUrls.filter(function(elem, index, self) {
    return index == self.indexOf(elem);
    */
