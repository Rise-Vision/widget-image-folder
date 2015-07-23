angular.module("risevision.widget.imageFolder.settings")
  .controller("imageFolderSettingsController", ["$scope", "commonSettings",
    function ($scope, commonSettings) {
      $scope.isFolder = true;

      function isFolderSelected(url) {
        var params = url.split("?"),
          pair;

        $scope.isFolder = false;

        for (var i = 0; i < params.length; i++) {
          pair = params[i].split("=");

          if (pair[0] === "prefix" && pair[1] !== undefined && pair[1] !== "") {
            $scope.isFolder = true;
            break;
          }
        }

        $scope.settingsForm.$setValidity("urlField", $scope.isFolder);

        return $scope.isFolder;
      }

      $scope.$watch("settings.additionalParams.url", function (url) {
        if (url !== undefined && url !== "") {
          if ($scope.settingsForm.urlField.$valid) {
            if (isFolderSelected(url)) {
              $scope.settings.additionalParams.storage = commonSettings.getStorageUrlData(url);
            }
            else {
              $scope.settings.additionalParams.storage = {};
            }
          }
          else {
            $scope.isFolder = true;
            $scope.settings.additionalParams.storage = {};
          }
        }
      });
    }])
  .value("defaultSettings", {
    "params": {},
    "additionalParams": {
      "url": "",
      "storage": {},
      "scaleToFit": true,
      "position": "top-left",
      "duration": 10,
      "pause": 10,
      "autoHide": false
    }
  });
