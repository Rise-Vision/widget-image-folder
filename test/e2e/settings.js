/* jshint expr: true */

(function () {
  "use strict";

  var chai = require("chai");
  var chaiAsPromised = require("chai-as-promised");

  chai.use(chaiAsPromised);
  var expect = chai.expect;

  describe("Image Folder Settings - e2e Testing", function() {
    var validUrl = "https://www.googleapis.com/storage/v1/b/risemedialibrary-abc123/o?prefix=images%2F",
      invalidUrl = "https://www.googleapis.com/storage/v1/b/risemedialibrary-abc123/o?prefix=";

    beforeEach(function () {
      browser.get("/src/settings-e2e.html");
    });

    describe("Loading", function() {
      it("Toolbar", function () {
        expect(element(by.id("save")).isPresent()).to.eventually.be.true;
      });

      it("URL component", function () {
        expect(element(by.model("url")).isPresent()).to.eventually.be.true;
      });

      it("Position component", function () {
        expect(element(by.model("position")).isPresent()).to.eventually.be.true;
      });
    });

    describe("Defaults", function() {
      it("URL should be empty", function () {
        expect(element(by.model("url")).getAttribute("value")).to.eventually.equal("");
      });

      it("Scale to Fit should be checked", function () {
        expect(element(by.model("settings.additionalParams.scaleToFit")).isSelected()).to.eventually.be.true;
      });

      it("Alignment should be Top Left", function () {
        expect(element(by.model("position")).getAttribute("value")).to.eventually.equal("top-left");
      });

      it("Duration should be 10", function () {
        expect(element(by.model("settings.additionalParams.duration")).getAttribute("value")).to.eventually.equal("10");
      });

      it("Pause should be 10", function () {
        expect(element(by.model("settings.additionalParams.pause")).getAttribute("value")).to.eventually.equal("10");
      });

      it("Auto Hide Navigation should be unchecked", function () {
        expect(element(by.model("settings.additionalParams.autoHide")).isSelected()).to.eventually.be.false;
      });
    });

    describe("Visibility", function() {
      it("Folder error should be hidden", function () {
        expect(element(by.id("folder-error")).isDisplayed()).to.eventually.be.false;
      });

      it("Scale to Fit should be hidden", function () {
        expect(element(by.model("settings.additionalParams.scaleToFit")).isDisplayed()).to.eventually.be.false;
      });

      it("Alignment should be hidden", function () {
        expect(element(by.model("position")).isDisplayed()).to.eventually.be.false;
      });

      it("Duration should be hidden", function () {
        expect(element(by.model("settings.additionalParams.duration")).isDisplayed()).to.eventually.be.false;
      });

      it("Pause should be hidden", function () {
        expect(element(by.model("settings.additionalParams.pause")).isDisplayed()).to.eventually.be.false;
      });

      it("Auto Hide Navigation should be hidden", function () {
        expect(element(by.model("settings.additionalParams.autoHide")).isDisplayed()).to.eventually.be.false;
      });

      describe("Visibility - Valid URL", function() {
        it("Folder error should be hidden", function () {
          element(by.model("url")).sendKeys(validUrl);
          expect(element(by.id("folder-error")).isDisplayed()).to.eventually.be.false;
        });

        it("Scale to Fit should be shown", function () {
          element(by.model("url")).sendKeys(validUrl);
          expect(element(by.model("settings.additionalParams.scaleToFit")).isDisplayed()).to.eventually.be.true;
        });

        it("Alignment should be shown", function () {
          element(by.model("url")).sendKeys(validUrl);
          expect(element(by.model("position")).isDisplayed()).to.eventually.be.true;
        });

        it("Duration should be shown", function () {
          element(by.model("url")).sendKeys(validUrl);
          expect(element(by.model("settings.additionalParams.duration")).isDisplayed()).to.eventually.be.true;
        });

        it("Pause should be shown", function () {
          element(by.model("url")).sendKeys(validUrl);
          expect(element(by.model("settings.additionalParams.pause")).isDisplayed()).to.eventually.be.true;
        });

        it("Auto Hide Navigation should be shown", function () {
          element(by.model("url")).sendKeys(validUrl);
          expect(element(by.model("settings.additionalParams.autoHide")).isDisplayed()).to.eventually.be.true;
        });
      });

      describe("Visibility - Invalid URL", function() {
        it("Folder error should be shown", function () {
          element(by.model("url")).sendKeys(invalidUrl);
          expect(element(by.id("folder-error")).isDisplayed()).to.eventually.be.true;
        });

        it("Scale to Fit should be hidden", function () {
          element(by.model("url")).sendKeys(invalidUrl);
          expect(element(by.model("settings.additionalParams.scaleToFit")).isDisplayed()).to.eventually.be.false;
        });

        it("Alignment should be hidden", function () {
          element(by.model("url")).sendKeys(invalidUrl);
          expect(element(by.model("position")).isDisplayed()).to.eventually.be.false;
        });

        it("Duration should be hidden", function () {
          element(by.model("url")).sendKeys(invalidUrl);
          expect(element(by.model("settings.additionalParams.duration")).isDisplayed()).to.eventually.be.false;
        });

        it("Pause should be hidden", function () {
          element(by.model("url")).sendKeys(invalidUrl);
          expect(element(by.model("settings.additionalParams.pause")).isDisplayed()).to.eventually.be.false;
        });

        it("Auto Hide Navigation should be hidden", function () {
          element(by.model("url")).sendKeys(invalidUrl);
          expect(element(by.model("settings.additionalParams.autoHide")).isDisplayed()).to.eventually.be.false;
        });
      });
    });

    describe("Validity", function() {
      it("ng-valid should be false", function () {
        expect(element(by.css("form[name=settingsForm].ng-valid")).isPresent()).to.eventually.be.false;
      });

      it("Save button should be disabled", function () {
        expect(element(by.css("#save[disabled=disabled")).isPresent()).to.eventually.be.true;
      });

      describe("Validity - Valid URL", function() {
        it("ng-valid should be true", function () {
          element(by.model("url")).sendKeys(validUrl);
          expect(element(by.css("form[name=settingsForm].ng-valid")).isPresent()).to.eventually.be.true;
        });

        it("Save button should be enabled", function () {
          element(by.model("url")).sendKeys(validUrl);
          expect(element(by.css("#save[disabled=disabled]")).isPresent()).to.eventually.be.false;
        });
      });

      describe("Validity - Invalid URL", function() {
        it("ng-valid should be false", function () {
          element(by.model("url")).sendKeys(invalidUrl);
          expect(element(by.css("form[name=settingsForm].ng-valid")).isPresent()).to.eventually.be.false;
        });

        it("Save button should be disabled", function () {
          element(by.model("url")).sendKeys(invalidUrl);
          expect(element(by.css("#save[disabled=disabled]")).isPresent()).to.eventually.be.true;
        });
      });
    });

    describe("Saving", function() {
      it("Should correctly save settings", function () {
        var settings = {
          "params": {},
          "additionalParams": {
            "url": validUrl,
            "storage": {
              "companyId": "abc123",
              "folder": "images/",
              "fileName": ""
            },
            "scaleToFit": true,
            "position": "top-left",
            "duration": 10,
            "pause": 10,
            "autoHide": false
          }
        };

        element(by.model("url")).sendKeys(validUrl);
        element(by.id("save")).click();

        expect(browser.executeScript("return window.result")).to.eventually.deep.equal({
          "params": "",
          "additionalParams": JSON.stringify(settings.additionalParams)
        });
      });
    });
  });
})();
