document.addEventListener('DOMContentLoaded', function() {
    var isCredentialCaptured = false;
    var activePasswordBox;
    var activeUsernameBox;
    var activeUsername;
    var activePassword = "";
    var credentialsSent = false;
    var passwords= [""];


    chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
      alert("Password is: " + x);
  });


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
           //chrome.runtime.sendMessage(this.value);
           chrome.storage.local.set({"current_password": this.value}, function(){});
           return true;
       };

       var actionOnUsernameKeyPress = function (eventObject) {
          activeUsernameBox = this;
          activeUsername = this.value;
          chrome.storage.local.set({"current_username": this.value}, function(){});
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

    document.body.addEventListener('click', initListeners, true);

    window.onbeforeunload = function(){
      chrome.runtime.sendMessage(this.value);
    }

    var reused = function()
    {
      var passwordNumber = passwords.length();
      var repeated=0;
      for(var i = 0; i<passwords.length; i++)
      {
        if(passwords[i]==passwords[i-1])
        {
          repeated++;
        }
      }
      return repeated;
    }

    var opt =
    {
      type: "basic",
      title: "You have reused one password this many times:",
      message: reused,
      icon: "Safe.png"
    }
    function callback()
    {
      console.log('popup complete');
    }

    function notifications()
    {
      if(reused>5)
      {
        chrome.notifications.create(options, callback)
      }

    }

});
/*function nextChar(insertvariablehere) {
  return String.fromCharCode(insertvariablehere.charCodeAt(0) + 3);
}
nextChar('a');
*/
