/* Google Website Translator integration shared by PayScale pages.
   Mirrors the embedded TranslateElement used by the RegTech Nexus AI FinTech Hub. */
(function () {
  "use strict";

  window.googleTranslateElementInit = function () {
    var host = document.getElementById("google_translate_element");
    if (!host || !window.google || !window.google.translate) return;

    new window.google.translate.TranslateElement({
      pageLanguage: "en",
      includedLanguages: "en,bn,zh-CN,ko,ja,es,fr,ar,hi,pt,id,ur",
      autoDisplay: false
    }, "google_translate_element");
  };

  function initLanguagePreferences() {
    var status = document.getElementById("rt-language-status");
    var boxes = document.querySelectorAll(".rt-language-options input");
    if (!status || !boxes.length) return;

    boxes.forEach(function (box) {
      box.addEventListener("change", function () {
        var selected = Array.from(document.querySelectorAll(".rt-language-options input:checked"))
          .map(function (item) { return item.parentElement.textContent.trim(); });
        status.textContent = selected.length
          ? "Preferred languages: " + selected.join(", ") + ". Use the translation menu above to switch the page language."
          : "No preferred languages selected.";
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initLanguagePreferences, { once: true });
  } else {
    initLanguagePreferences();
  }
})();
