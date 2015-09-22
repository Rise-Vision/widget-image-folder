/* global gadgets */
var RiseVision = RiseVision || {};
RiseVision.ImageFolder = {};

RiseVision.ImageFolder = (function (gadgets) {
  "use strict";

  var params,
    storage = null,
    slider = null,
    message = null,
    noFilesTimer = null,
    noFilesFlag = false,
    prefs = new gadgets.Prefs();

  var viewerPaused = true;

  /*
   *  Private Methods
   */
  function clearNoFilesTimer() {
    clearTimeout(noFilesTimer);
    noFilesTimer = null;
  }

  function init() {
    params.width = prefs.getInt("rsW");
    params.height = prefs.getInt("rsH");

    message = new RiseVision.Common.Message(document.getElementById("container"),
      document.getElementById("messageContainer"));

    // show wait message while Storage initializes
    message.show("Please wait while your image is downloaded.");

    storage = new RiseVision.ImageFolder.Storage(params);
    storage.init();

    ready();
  }

  function startNoFilesTimer() {
    clearNoFilesTimer();

    noFilesTimer = setTimeout(function () {
      // notify Viewer widget is done
      done();
    }, 5000);
  }

  /*
   *  Public Methods
   */
  function setParams(names, values) {
    if (Array.isArray(names) && names.length > 0 && names[0] === "additionalParams") {
      if (Array.isArray(values) && values.length > 0) {
        params = JSON.parse(values[0]);

        document.getElementById("container").style.height = prefs.getInt("rsH") + "px";
        init();
      }
    }
  }

  function initSlider(urls) {
    if (slider === null) {
      slider = new RiseVision.ImageFolder.Slider(params);
      slider.init(urls);
    }
  }

  function refreshSlider(urls) {
    if (slider !== null) {
      slider.refresh(urls);
    }
  }

  function sliderReady() {
    message.hide();

    if (!viewerPaused) {
      slider.play();
    }
  }

  function noFiles(type) {
    noFilesFlag = true;

    if (type === "empty") {
      message.show("The selected folder does not contain any images.");
    } else if (type === "noexist") {
      message.show("The selected folder does not exist.");
    }

    // destroy slider if it exists and previously notified ready
    if (slider && slider.isReady()) {
      slider.destroy();
    }

    // if Widget is playing right now, run the timer
    if (!viewerPaused) {
      startNoFilesTimer();
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
    viewerPaused = false;

    if (noFilesFlag) {
      startNoFilesTimer();
    } else {
      if (slider && slider.isReady()) {
        slider.play();
      }
    }
  }

  function pause() {
    viewerPaused = true;

    if (noFilesFlag) {
      clearNoFilesTimer();
    } else {
      if (slider && slider.isReady()) {
        slider.pause();
      }
    }
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
    "sliderReady": sliderReady,
    "noFiles": noFiles
  };
})(gadgets);
