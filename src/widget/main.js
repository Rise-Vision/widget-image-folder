/* global RiseVision, gadgets */
(function (window, document, gadgets) {
  "use strict";

  var id = new gadgets.Prefs().getString("id");

  window.oncontextmenu = function () {
    return false;
  };

  document.body.onmousedown = function() {
    return false;
  };

  function play() {
    RiseVision.ImageFolder.play();
  }

  function pause() {
    RiseVision.ImageFolder.pause();
  }

  function stop() {
    RiseVision.ImageFolder.stop();
  }

  $(document).ready(function() {
    gadgets.rpc.register("rscmd_play_" + id, play);
    gadgets.rpc.register("rscmd_pause_" + id, pause);
    gadgets.rpc.register("rscmd_stop_" + id, stop);

    window.addEventListener("WebComponentsReady", function() {
      gadgets.rpc.register("rsparam_set_" + id, RiseVision.ImageFolder.setParams);
      gadgets.rpc.call("", "rsparam_get", null, id, ["additionalParams"]);
    });
  });
})(window, document, gadgets);
