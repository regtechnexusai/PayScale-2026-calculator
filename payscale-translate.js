/* PayScale translation helper. Google Translate Websites requires the user
   to paste a website URL; never claim that the URL was copied unless confirmed. */
(function () {
  "use strict";

  function initTranslateControls() {
    var language = document.getElementById("rt-translate-language");
    var urlField = document.getElementById("rt-translate-page-url");
    var copyButton = document.getElementById("rt-translate-copy");
    var openLink = document.getElementById("rt-translate-open");
    var status = document.getElementById("rt-translate-status");
    if (!language || !urlField || !copyButton || !openLink || copyButton.dataset.ready === "true") return;

    copyButton.dataset.ready = "true";
    urlField.value = window.location.href;

    language.addEventListener("change", function () {
      var target = language.value;
      if (!/^[a-z]{2,3}(?:-[A-Z]{2})?$/.test(target)) return;
      openLink.href = "https://translate.google.com/?sl=auto&tl=" + encodeURIComponent(target);
    });

    copyButton.addEventListener("click", function () {
      var pageUrl = window.location.href;
      urlField.value = pageUrl;

      function showManualCopy() {
        urlField.focus();
        urlField.select();
        urlField.setSelectionRange(0, urlField.value.length);
        status.textContent = "Automatic copy was blocked. The address is selected above; press Ctrl+C (or Cmd+C on Mac), then paste it into Google Translate → Websites.";
      }

      if (navigator.clipboard && window.isSecureContext && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(pageUrl).then(function () {
          status.textContent = "Page address copied successfully. Open Google Translate → Websites, paste the address, choose your language, and select Translate.";
        }).catch(showManualCopy);
      } else {
        showManualCopy();
      }
    });

    openLink.href = "https://translate.google.com/?sl=auto&tl=" + encodeURIComponent(language.value);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTranslateControls, { once: true });
  } else {
    initTranslateControls();
  }
})();
