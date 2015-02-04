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

  gadgets.rpc.register("rsparam_set_" + id, RiseVision.ImageFolder.getAdditionalParams);
  gadgets.rpc.call("", "rsparam_get", null, id, ["additionalParams"]);
})(window, document, gadgets);
