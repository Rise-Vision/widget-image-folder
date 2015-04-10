var system = require("system");
var e2ePort = system.env.E2E_PORT || 8099;
var url = "http://localhost:"+e2ePort+"/src/widget-e2e.html";

casper.options.waitTimeout = 10000;

casper.on("remote.message", function(message) {
  this.echo(message);
});

casper.test.begin("Image Folder Widget - e2e Testing", {
  test: function(test) {
    casper.start();

    casper.thenOpen(url, function () {
      test.assertTitle("Image Folder Widget", "Test page has loaded");
    });

    casper.then(function () {
      casper.evaluate(function (){
        var evt = document.createEvent("CustomEvent");

        evt.initCustomEvent("polymer-ready", false, false);
        window.dispatchEvent(evt);
      });

      casper.waitFor(function waitForUI() {
        return this.evaluate(function loadSlides() {
          return document.querySelector(".tp-revslider-mainul .tp-revslider-slidesli:nth-child(1)").style.visibility = "inherit";
        });
      },
      function then() {
        test.assertEquals(this.getElementAttribute(".tp-bgimg", "data-bgfit"), "contain", "Scale to fit");
        test.assertEquals(this.getElementAttribute(".tp-bgimg", "data-bgposition"), "left top", "Alignment");

        test.comment("URLs");
        test.assertElementCount(".tp-revslider-mainul .tp-revslider-slidesli", 3, "Total number of slides");
        test.assertEquals(this.getElementAttribute(".tp-revslider-mainul .tp-revslider-slidesli:nth-child(1) .tp-bgimg", "src"),
          "https://www.googleapis.com/storage/v1/b/risemedialibrary-b428b4e8-c8b9-41d5-8a10-b4193c789443/o/Widgets%2Fapple.png?alt=media", "First image URL");
        test.assertEquals(this.getElementAttribute(".tp-revslider-mainul .tp-revslider-slidesli:nth-child(2) .tp-bgimg", "src"),
          "https://www.googleapis.com/storage/v1/b/risemedialibrary-b428b4e8-c8b9-41d5-8a10-b4193c789443/o/Widgets%2Fduck.bmp?alt=media", "Second image URL");
        test.assertEquals(this.getElementAttribute(".tp-revslider-mainul .tp-revslider-slidesli:nth-child(3) .tp-bgimg", "src"),
          "https://www.googleapis.com/storage/v1/b/risemedialibrary-b428b4e8-c8b9-41d5-8a10-b4193c789443/o/Widgets%2Fmoon.jpg?alt=media", "Third image URL");

        test.comment("Arrows");
        test.assertExists(".tp-leftarrow", "Left arrow");
        test.assertExists(".tp-rightarrow", "Right arrow");

        this.evaluate(function refreshSlider() {
          RiseVision.ImageFolder.refreshSlider(["https://url.to.slide1.png", "https://url.to.slide2.gif"]);
        });

        // Wait for slider to be rebuilt with only 2 slides.
        casper.waitFor(function waitForUI() {
          return this.evaluate(function loadSlides() {
            // Note: Not sure why, but this doesn't run locally for me. Runs just fine in CirceCI.
            return document.querySelectorAll(".tp-revslider-mainul .tp-revslider-slidesli").length === 2;
          });
        },
        function then() {
          test.comment("Refresh with new images");
          test.assertEquals(this.getElementAttribute(".tp-bgimg", "data-bgfit"), "contain", "Scale to fit");
          test.assertEquals(this.getElementAttribute(".tp-bgimg", "data-bgposition"), "left top", "Alignment");

          test.assertElementCount(".tp-revslider-mainul .tp-revslider-slidesli", 2, "Total number of slides");
          test.assertEquals(this.getElementAttribute(".tp-revslider-mainul .tp-revslider-slidesli:nth-child(1) .tp-bgimg", "src"),
            "https://url.to.slide1.png", "First image URL");
          test.assertEquals(this.getElementAttribute(".tp-revslider-mainul .tp-revslider-slidesli:nth-child(2) .tp-bgimg", "src"),
            "https://url.to.slide2.gif", "Second image URL");

          test.assertExists(".tp-leftarrow", "Left arrow");
          test.assertExists(".tp-rightarrow", "Right arrow");
        });
      });
    });

    casper.run(function runTest() {
      test.done();
    });
  }
});
