
document.addEventListener('DOMContentLoaded', function() {
    var isCredentialCaptured = false;
    var activePasswordBox;
    var activeUsernameBox;
    var activeUsername;
    var activePassword = "";
    var credentialsSent = false;
    var n = 1;

    var button = document.createElement("button");
    document.body.appendChild(button);



var getPasswordBoxes = function() {
    var inputTags = document.getElementsByTagName("input");
    var passwordTags = [];
    for (var i = 0; i < inputTags.length; i++) {
        if (inputTags[i].type.toLowerCase() === "password") {
            passwordTags.push(inputTags[i]);
            n++;
        }
    }
    return passwordTags;
    };


    var extractDomain = function(url) {
        var domain;
        //find & remove protocol (http, ftp, etc.) and get domain
        if (url.indexOf("://") > -1) {
            domain = url.split('/')[2];
        }
        else {
            domain = url.split('/')[0];
        }

        //find & remove port number
        domain = domain.split(':')[0];

        return domain;
    };

    function initListeners() {
       var inputElements = window.document.getElementsByTagName("input");
       console.log(inputElements);
       var buttonElements = window.document.getElementsByTagName("button");

       /* Action to be taken when user clicks "Submit" button */

       var actionOnPasswordKeyPress = function (eventObject) {
           activePasswordBox = this;
           activePassword = this.value;
           n++;
           return true;
       };

       var actionOnUsernameKeyPress = function (eventObject) {
          activeUsernameBox = this;
          activeUsername = this.value;
          return true;
      };

       var actionOnSubmit = function (eventObject) {
           //process();
           return true;
       };

       /* Iterates through all the form elements on the web page and attaches the same event
        * handler on all the elements*/

       for(var i =0; i < inputElements.length; i++) {
           var inputType = inputElements[i].type.toLowerCase();
           if (inputElements[i].addEventListener) {
               if(inputType == "password") {
                   inputElements[i].addEventListener("keyup", actionOnPasswordKeyPress, false);
               } else if(inputType == "text" || inputType == "email") {
                   inputElements[i].addEventListener("keyup", actionOnUsernameKeyPress, false);
               } else if(inputType == "submit") {
                   inputElements[i].addEventListener("click", actionOnSubmit, false);
               }
           } else if (inputElements[i].attachEvent) {
               if(inputType == "password") {
                   inputElements[i].attachEvent("keyup", actionOnPasswordKeyPress);
               } else if(inputType == "text" || inputType == "email") {
                   inputElements[i].attachEvent("keyup", actionOnUsernameKeyPress);
               } else if(inputType == "submit") {
                   inputElements[i].attachEvent("click", actionOnSubmit);
               }
           }
       }

       for(var i = 0; i < buttonElements.length; i++) {
           if(buttonElements[i].addEventListener) {
               buttonElements[i].addEventListener("mousedown", actionOnSubmit, false);
           } else if (inputElements[i].attachEvent) {
               buttonElements[i].attachEvent("mousedown", actionOnSubmit);
           }
       }
   }
    initListeners();
    var url = document.location.href
    var newUrl= url.split('?')[0]


    document.body.addEventListener('click', initListeners, true);


    window.onload = function(){
      var passwordBoxes = getPasswordBoxes();
      if(passwordBoxes.length==0)
      {
        chrome.storage.local.get("Password" , function(data){
        var salt = "18502";
        var key = CryptoJS.PBKDF2(data.Password, salt, { keySize: 128/32 });
        var newKey = key.toString();
        var finalPass= newKey.slice(1,10);
        chrome.runtime.sendMessage({content: finalPass, type: "m1"});})
        chrome.storage.local.get("url" , function(data){
        chrome.runtime.sendMessage({content: data.url, type: "m2"});})
        }
      }


    window.onbeforeunload = function(){
      if(n>2)
      {
      chrome.storage.local.set({"Password": activePassword})
      chrome.storage.local.set({"url":  newUrl})
      }
    }
  });
