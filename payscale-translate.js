/* Reliable Google Translate Websites workflow for PayScale pages.
   Uses Google's current Websites interface; does not rely on the legacy proxy URL. */
(function () {
  "use strict";

  function copyPageUrl(url) {
    if (navigator.clipboard && window.isSecureContext && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(url);
    }
    return new Promise(function (resolve, reject) {
      var field = document.createElement("textarea");
      field.value = url;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.left = "-9999px";
      document.body.appendChild(field);
      field.select();
      var copied = false;
      try { copied = document.execCommand("copy"); } catch (error) { copied = false; }
      document.body.removeChild(field);
      if (copied) resolve(); else reject(new Error("Clipboard unavailable"));
    });
  }

  function initTranslateLauncher() {
    var select = document.getElementById("rt-translate-language");
    var button = document.getElementById("rt-translate-open");
    var status = document.getElementById("rt-translate-status");
    if (!select || !button || button.dataset.translateReady === "true") return;
    button.dataset.translateReady = "true";

    button.addEventListener("click", function () {
      var language = select.value;
      if (!/^[a-z]{2,3}(?:-[A-Z]{2})?$/.test(language)) {
        if (status) status.textContent = "Please choose a language.";
        return;
      }

      /* Open synchronously during the click to avoid popup blockers. */
      var translateUrl = "https://translate.google.com/?op=websites&sl=auto&tl=" +
        encodeURIComponent(language);
      var translateTab = window.open(translateUrl, "_blank");

      copyPageUrl(window.location.href).then(function () {
        if (status) {
          status.textContent = "Page address copied. In the Google Translate tab, choose Websites, paste the address, then select Translate.";
        }
      }).catch(function () {
        if (status) {
          status.textContent = "Google Translate is open. Copy this page address and paste it into the Websites field: " + window.location.href;
        }
        if (!translateTab) {
          window.location.href = translateUrl;
        }
      });

      if (!translateTab && status) {
        status.textContent = "Your browser blocked the new tab. Allow pop-ups for this site, or open Google Translate manually.";
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTranslateLauncher, { once: true });
  } else {
    initTranslateLauncher();
  }
})();
