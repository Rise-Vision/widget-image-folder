var RiseVision = RiseVision || {};
RiseVision.ImageFolder = RiseVision.ImageFolder || {};

RiseVision.ImageFolder.Message = function () {
  "use strict";

  var _active = false;

  /*
   *  Public Methods
   */
  function hide() {
    var messageContainer = document.getElementById("messageContainer");

    if (_active) {
      // clear content of message container
      while (messageContainer.firstChild) {
        messageContainer.removeChild(messageContainer.firstChild);
      }

      // hide message container
      messageContainer.style.display = "none";

      // show main container (slider)
      document.getElementById("container").style.visibility = "visible";

      _active = false;
    }
  }

  function show(message) {
    var messageContainer = document.getElementById("messageContainer"),
      fragment = document.createDocumentFragment(),
      p;

    if (!_active) {
      // hide main container (slider)
      document.getElementById("container").style.visibility = "hidden";

      messageContainer.style.display = "block";

      // create message element
      p = document.createElement("p");
      p.innerHTML = message;
      p.setAttribute("class", "message");
      p.style.lineHeight = messageContainer.style.height;

      fragment.appendChild(p);
      messageContainer.appendChild(fragment);

      _active = true;
    } else {
      // message already being shown, update message text
      p = messageContainer.querySelector(".message");
      p.innerHTML = message;
    }
  }

  return {
    "hide": hide,
    "show": show
  };
};
