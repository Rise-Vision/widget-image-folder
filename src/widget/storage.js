/* global config, _ */
var RiseVision = RiseVision || {};
RiseVision.ImageFolder = RiseVision.ImageFolder || {};

RiseVision.ImageFolder.Storage = function (params) {
  "use strict";

  var isLoading = true,
    files = [],
    timer = null;

  /*
   *  Public Methods
   */
  function init() {
    var storage = document.querySelector("rise-storage");

    storage.addEventListener("rise-storage-response", handleResponse);
    storage.setAttribute("companyId", params.storage.companyId);
    storage.setAttribute("folder", params.storage.folder);
    storage.setAttribute("env", config.STORAGE_ENV);
    storage.go();
  }

  function handleResponse(e) {
    processUrl(e);

    if (isLoading) {
      // Need to wait for at least 2 images to load before initializing the slider.
      // Otherwise, the revolution.slide.onchange event will never fire, and this event is used
      // to check whether or not the slider should refresh.
      if (files.length > 1) {
        isLoading = false;

        clearTimeout(timer);
        RiseVision.ImageFolder.initSlider(files);
      }
      // Set a timeout in case there is only one image in the folder.
      else {
        timer = setTimeout(function() {
          isLoading = false;
          RiseVision.ImageFolder.initSlider(files);
        }, 5000);
      }
    }
    else {
      RiseVision.ImageFolder.refreshSlider(files);
    }
  }

  function processUrl(e) {
    var file;

    if (e.detail) {
      // Image has been added.
      if (e.detail.hasOwnProperty("added") && e.detail.added) {
        files.push({
          "name": e.detail.name,
          "url": e.detail.url
        });
      }
      // Image has been changed.
      else if (e.detail.hasOwnProperty("changed") && e.detail.changed) {
        file = _.find(files, function(file) {
          return file.name === e.detail.name;
        });

        file.url = e.detail.url;
      }
      // Image has been deleted.
      else if (e.detail.hasOwnProperty("deleted") && e.detail.deleted) {
        files = _.reject(files, function(file) {
          return file.name === e.detail.name;
        });
      }
    }

    files = _.sortBy(files, function(file) {
      return file.name.toLowerCase();
    });
  }

  return {
    "init": init
  };
};
