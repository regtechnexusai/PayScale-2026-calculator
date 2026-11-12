/* Google Translate page launcher for the PayScale calculator and pension page.
   The retired embedded Website Translator widget is intentionally not used. */
(function () {
  "use strict";
  function initTranslateLauncher() {
    var select = document.getElementById("rt-translate-language");
    var button = document.getElementById("rt-translate-open");
    if (!select || !button || button.dataset.translateReady === "true") return;
    button.dataset.translateReady = "true";
    button.addEventListener("click", function () {
      var language = select.value;
      if (!/^[a-z]{2,3}(?:-[A-Z]{2})?$/.test(language)) return;
      var target = "https://translate.google.com/translate?sl=auto&tl=" +
        encodeURIComponent(language) + "&u=" + encodeURIComponent(window.location.href);
      window.open(target, "_blank", "noopener,noreferrer");
    });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTranslateLauncher, { once: true });
  } else {
    initTranslateLauncher();
  }
})();
