/* ANEEMA app package - launcher.
   Loads the live ANEEMA app inside a full-viewport frame and gets out of its way.
   If the frame cannot load, it hands over a plain button that opens the same app. */

(function () {
  "use strict";

  var cfg = window.ANEEMA_CONFIG || {};
  var APP_URL = cfg.APP_URL || "";
  var PAGE_URL = cfg.PAGE_URL || APP_URL;

  var frame = document.getElementById("frameEl");
  var shell = document.getElementById("shellEl");
  var spin = document.getElementById("spinEl");
  var msg = document.getElementById("msgEl");
  var fallback = document.getElementById("fallbackEl");
  var installBox = document.getElementById("installEl");
  var installBtn = document.getElementById("installBtn");
  var installHint = document.getElementById("installHintEl");
  var escapeBtn = document.getElementById("escapeBtn");
  var subEl = document.getElementById("subEl");

  var live = false;
  var settled = false;
  var deferred = null;

  var standalone =
    (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) ||
    window.navigator.standalone === true;
  var ios =
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (/Macintosh/.test(navigator.userAgent) && (navigator.maxTouchPoints || 0) > 1);

  if (cfg.APP_SUB && subEl) subEl.textContent = cfg.APP_SUB;

  function external(url) {
    var win = null;
    try {
      win = window.open(url, "_blank", "noopener");
    } catch (err) {
      win = null;
    }
    if (!win) window.location.href = url;
  }

  function goLive() {
    if (live) return;
    live = true;
    settled = true;
    frame.classList.add("is-live");
    shell.classList.add("is-done");
    escapeBtn.classList.add("is-on");
  }

  function showFallback(text) {
    if (live || settled) return;
    settled = true;
    frame.style.display = "none";
    spin.hidden = true;
    msg.textContent = text;
    fallback.hidden = false;
    escapeBtn.classList.add("is-on");
  }

  /* The app posts this the moment it boots, so we know it really rendered
     instead of trusting the frame's (unreliable) load event. */
  window.addEventListener("message", function (event) {
    var data = event.data;
    if (!data || typeof data !== "object") return;
    if (data.type !== "aneema:ready") return;
    if (frame.contentWindow && event.source && event.source !== frame.contentWindow) return;
    goLive();
  });

  /* The ready message is the fast, exact signal. The load event is the backup:
     it fires for any frame that actually committed a document, so an older copy
     of ANEEMA (or one served without the handshake) still opens - a network
     failure is the only thing that leaves us stuck on the card. */
  frame.addEventListener("load", function () {
    if (settled) return;
    msg.textContent = "Connecting to ANEEMA...";
    setTimeout(function () {
      if (!settled) goLive();
    }, 700);
  });

  frame.addEventListener("error", function () {
    showFallback("ANEEMA could not be loaded here.");
  });

  setTimeout(function () {
    showFallback("This frame took too long to load ANEEMA.");
  }, 20000);

  function ping() {
    if (!frame.contentWindow) return;
    try {
      frame.contentWindow.postMessage({ type: "aneema:ping" }, "*");
    } catch (err) {
      /* cross-origin postMessage always works; nothing to do if the frame is gone */
    }
  }

  var launchBtn = document.getElementById("launchBtn");
  if (launchBtn) {
    launchBtn.addEventListener("click", function () {
      if (standalone) window.location.href = APP_URL;
      else external(APP_URL);
    });
  }
  var pageBtn = document.getElementById("pageBtn");
  if (pageBtn) {
    pageBtn.addEventListener("click", function () {
      external(PAGE_URL);
    });
  }

  escapeBtn.addEventListener("click", function () {
    if (!live) {
      ping();
      return;
    }
    external(APP_URL);
  });

  window.addEventListener("beforeinstallprompt", function (event) {
    event.preventDefault();
    deferred = event;
    installBox.hidden = false;
    installHint.textContent = "No app store, no download - it installs straight from this page.";
  });

  window.addEventListener("appinstalled", function () {
    deferred = null;
    installBox.hidden = true;
    if (msg) msg.textContent = "Installed. Launch it from your home screen.";
  });

  installBtn.addEventListener("click", function () {
    if (deferred) {
      var prompt = deferred;
      deferred = null;
      installBox.hidden = true;
      prompt.prompt();
      return;
    }
    installHint.textContent = ios
      ? "Tap the Share button, then Add to Home Screen."
      : "Open the browser menu (the three dots) and choose Install app / Add to Home Screen.";
  });

  function offerInstall() {
    if (standalone) return;
    installBox.hidden = false;
    installHint.textContent = ios
      ? "Install it from Safari: Share button, then Add to Home Screen."
      : "Open the browser menu (the three dots) and choose Install app / Add to Home Screen.";
  }

  if (standalone) {
    msg.textContent = "Welcome back.";
  } else {
    setTimeout(function () {
      if (!live) offerInstall();
    }, 2500);
  }

  if (frame && APP_URL) {
    frame.src = APP_URL;
  } else {
    showFallback("No app URL is configured in config.js.");
  }

  document.addEventListener("visibilitychange", function () {
    if (!document.hidden && !live) ping();
  });

  if ("serviceWorker" in navigator && location.protocol === "https:") {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("sw.js").catch(function (err) {
        console.warn("[ANEEMA] service worker not registered:", err && err.message);
      });
    });
  }
})();
