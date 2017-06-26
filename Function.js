document.addEventListener('DOMContentLoaded', function() {

    var isCredentialCaptured = false;
    var sematicGenURL = "https://localhost";
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
                if(passwordBoxes.length == 0) {
                    //inform semantic generator that authentication was successful
                    var URL = sematicGenURL + "/auth?success=1"
                } else {
                    //inform semantic generator that authentication was unsuccessful (mostly)
                    var URL = sematicGenURL + "/auth?success=0"
                }
                var xmlRequest = new XMLHttpRequest();
                if(window.XMLHttpRequest) {
                    xmlRequest.open("GET", URL, false);
                    try {
                        xmlRequest.send();
                    } catch (e) {
                        alert(e);
                    }
                }
                chrome.storage.local.set({"login_attempt": 0}, function(){
                    console.log("Authentication information sent");
                });
            }
        }
    });

    /* Function to select all the password text boxes on the webpage */
    var getPasswordBoxes = function() {
        var inputTags = document.getElementsByTagName("input");
        var passwordTags = [];
        for (var i = 0; i < inputTags.length; i++) {
            if (inputTags[i].type.toLowerCase() === "password") {
                passwordTags.push(inputTags[i]);
            }
        }
        return passwordTags;
    };

    var getTextBoxes = function() {
        var inputTags = document.getElementsByTagName("input");
        var textTags = [];
        for (var i = 0; i < inputTags.length; i++) {
            if (inputTags[i].type.toLowerCase() == "text" || inputTags[i].type.toLowerCase() == "email") {
                textTags.push(inputTags[i]);
            }
        }
        return textTags;
    };

    function save_options() {
      var setting = document.getElementById('Setting').value;
      chrome.storage.sync.set({
        bestSetting: setting,
      }, function() {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function() {
          status.textContent = '';
        }, 750);
      });
    }

    // Restores select box and checkbox state using the preferences
    // stored in chrome.storage.
    function restore_options() {
      // Use default value color = 'red' and likesColor = true.
      chrome.storage.sync.get({
        bestSetting: 'Low Security',
      }, function(items) {
        document.getElementById('Setting').value = items.bestSetting;
      });
    }
    document.addEventListener('DOMContentLoaded', restore_options);
    document.getElementById('save').addEventListener('click',
        save_options);




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
        if(window.XMLHttpRequest) {
            //get root domain name
            var domain = extractDomain(window.location.href);

            if(activePassword == "") {
                //get from chrome storage
                chrome.storage.local.get("current_password", function(data){
                    if(data.current_password != undefined) {
                        activePassword = data.current_password;
                        var newLength = passwords.push(activePassword);
                    } else {
                        activePassword = "";
                    }
                }
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
      int passwordNumber = passwords.length;
      int repeated=0
      for(var i = 0; i<passwords.length; i++)
      {
        if(passwords[i]==passwords[i-1])
        {
          repeated++
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


}
});
