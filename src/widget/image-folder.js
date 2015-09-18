/* global gadgets */
var RiseVision = RiseVision || {};
RiseVision.ImageFolder = {};

RiseVision.ImageFolder = (function (gadgets) {
  "use strict";

  var params,
    storage = null,
    slider = null,
    message = null,
    prefs = new gadgets.Prefs();

  /*
   *  Private Methods
   */
  function init() {
    params.width = prefs.getInt("rsW");
    params.height = prefs.getInt("rsH");

    message = new RiseVision.ImageFolder.Message();
    // show wait message while Storage initializes
    message.show("Please wait while your image is downloaded.");

    storage = new RiseVision.ImageFolder.Storage(params);
    storage.init();
  }

  /*
   *  Public Methods
   */
  function setParams(names, values) {
    if (Array.isArray(names) && names.length > 0 && names[0] === "additionalParams") {
      if (Array.isArray(values) && values.length > 0) {
        params = JSON.parse(values[0]);

        document.getElementById("container").style.height = prefs.getInt("rsH") + "px";
        document.getElementById("messageContainer").style.height = prefs.getInt("rsH") + "px";
        init();
      }
    }
  }

  function initSlider(urls) {
    // in case a message previously shown because of empty folder or folder didn't exist
    message.hide();

    if (slider === null) {
      slider = new RiseVision.ImageFolder.Slider(params);
      slider.init(urls);
    }
  }

  function refreshSlider(urls) {
    // in case a message previously shown because of empty folder or folder didn't exist
    message.hide();

    if (slider !== null) {
      slider.refresh(urls);
    }
  }

  function noFiles(type) {
    if (type === "empty") {
      message.show("The selected folder does not contain any images.");
    } else if (type === "noexist") {
      message.show("The selected folder does not exist.");
    }
  }

  function ready() {
    gadgets.rpc.call("", "rsevent_ready", null, prefs.getString("id"), true,
      true, true, true, true);
  }

  function done() {
    gadgets.rpc.call("", "rsevent_done", null, prefs.getString("id"));
  }

  function play() {
    slider.play();
  }

  function pause() {
    slider.pause();
  }

  function stop() {
    pause();
  }

  return {
    "ready": ready,
    "done": done,
    "play": play,
    "pause": pause,
    "stop": stop,
    "setParams": setParams,
    "initSlider": initSlider,
    "refreshSlider": refreshSlider,
    "noFiles": noFiles
  };
})(gadgets);
