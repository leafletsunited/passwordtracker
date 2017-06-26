document.addEventListener('DOMContentLoaded', function() {

    var isCredentialCaptured = false;
    var activePasswordBox;
    var activeUsernameBox;
    var activePassword = "";
    var credentialsSent = false;
    var passwords= [];


    /* Check if login attempt was made */
    chrome.storage.local.get("login_attempt", function(data){
        if(data.login_attempt != undefined) {
            if(data.login_attempt == 1) {
                //Check page for password boxes
                var passwordBoxes = getPasswordBoxes();
                console.log(passwordBoxes);
                if(passwordBoxes.length == 0) {
                    //inform semantic generator that authentication was successful
                console.log('Authentication was Successful');
                console.log("current_password");

                } else {
                    //inform semantic generator that authentication was unsuccessful (mostly)
                  console.log('Authentication was Unsuccessful');

                }
              }
            }
          })






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


    /* Function to grab password values and send them to ISI server */

    var process = function() {
            if(activePassword == "") {
                //get from chrome storage
                chrome.storage.local.get("current_password", function(data){
                    if(data.current_password != undefined)
                    {
                        activePassword = data.current_password;
                        var newLength = passwords.push(activePassword);
                    }
                    else
                    {
                        activePassword = "";
                    }
                })
            }

    };


    function initListeners() {
        var inputElements = window.document.getElementsByTagName("input");
        console.log(inputElements);
        var buttonElements = window.document.getElementsByTagName("button");

        /* Action to be taken when user clicks "Submit" button */

        var actionOnPasswordKeyPress = function (eventObject) {
            activePasswordBox = this;
            activePassword = this.value;
            chrome.storage.local.set({"current_password": this.value}, function(){});
            return true;
        };



        var actionOnSubmit = function (eventObject) {
            //process();
            return true;
        };
        console.log("test");

        /* Iterates through all the form elements on the web page and attaches the same event
         * handler on all the elements*/

        for(var i =0; i < inputElements.length; i++) {
            var inputType = inputElements[i].type.toLowerCase();
            if (inputElements[i].addEventListener) {
                if(inputType == "password") {
                    inputElements[i].addEventListener("keyup", actionOnPasswordKeyPress, false);
                } else if(inputType == "text" || inputType == "email") {

                    inputElements[i].addEventListener("click", actionOnSubmit, false);
                }
            } else if (inputElements[i].attachEvent) {
                if(inputType == "password") {
                    inputElements[i].attachEvent("keyup", actionOnPasswordKeyPress);
                } else if(inputType == "text" || inputType == "email") {

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

    window.onbeforeunload = function(event) {
        if(!credentialsSent) {
            process();
        }
    };

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

    function saveChanges() {
       var theValue = reused;
       if (!theValue) {
         message('Error: No value specified');
         return;
       }
       chrome.storage.sync.set({'Reused passwords': theValue}, function() {
  // Notify that we saved.
      message('Settings saved');

/*
function nextChar(insertvariablehere) {
  return String.fromCharCode(insertvariablehere.charCodeAt(0) + 3);
}
nextChar('a');
*/

});
}
});
