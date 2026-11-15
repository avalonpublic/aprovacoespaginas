/* GTM-PC856CFK — consent first, then page_view, scroll and lead. */
(function () {
  var KEY = "iki.cookie_consent";
  var QUEUE = "iki.pending_events";
  var fired = { page_view: false, scroll_mid: false, scroll_footer: false };
  var armed = false;
  var tagsLoaded = false;
  var waiters = [];

  function read() {
    try {
      return localStorage.getItem(KEY);
    } catch (e) {
      return null;
    }
  }

  function granted() {
    return read() === "accepted";
  }

  function push(name, params) {
    window.dataLayer = window.dataLayer || [];
    var payload = { event: name };
    if (params) {
      for (var k in params) payload[k] = params[k];
    }
    window.dataLayer.push(payload);
  }

  function queue(name, params) {
    if (read() === "rejected") return;
    var list = [];
    try {
      list = JSON.parse(sessionStorage.getItem(QUEUE) || "[]");
    } catch (e) {
      list = [];
    }
    list.push({ name: name, params: params || {} });
    try {
      sessionStorage.setItem(QUEUE, JSON.stringify(list));
    } catch (e) {}
  }

  function flush() {
    var list = [];
    try {
      list = JSON.parse(sessionStorage.getItem(QUEUE) || "[]");
      sessionStorage.removeItem(QUEUE);
    } catch (e) {
      list = [];
    }
    list.forEach(function (item) {
      deliver(item.name, item.params);
    });
  }

  function loadTags() {
    if (tagsLoaded) return;
    tagsLoaded = true;
    gtag("js", new Date());
    var gtm = document.createElement("script");
    gtm.async = true;
    gtm.src = "https://www.googletagmanager.com/gtm.js?id=GTM-PC856CFK";
    document.head.appendChild(gtm);
    if (!window.fbq) {
      var fbq = function () {
        fbq.callMethod ? fbq.callMethod.apply(fbq, arguments) : fbq.queue.push(arguments);
      };
      window.fbq = fbq;
      if (!window._fbq) window._fbq = fbq;
      fbq.push = fbq;
      fbq.loaded = true;
      fbq.version = "2.0";
      fbq.queue = [];
      var pixel = document.createElement("script");
      pixel.async = true;
      pixel.src = "https://connect.facebook.net/en_US/fbevents.js";
      document.head.appendChild(pixel);
    }
    window.fbq("init", "1546551013869737");
  }

  function deliver(name, params) {
    push(name, params);
    if (name === "lead" && typeof fbq === "function") fbq("track", "Lead");
  }

  window.ikiTrack = function (name, params) {
    if (!granted()) {
      queue(name, params);
      return false;
    }
    deliver(name, params);
    return true;
  };

  window.ikiWhenGranted = function (fn) {
    if (read() === "rejected") return;
    if (granted()) {
      fn();
      return;
    }
    waiters.push(fn);
  };

  function pageView() {
    if (fired.page_view || !granted()) return;
    fired.page_view = true;
    push("page_view", {
      page_location: location.href,
      page_title: document.title,
    });
    if (typeof fbq === "function") fbq("track", "PageView");
  }

  function markFooter() {
    if (fired.scroll_footer || !granted()) return;
    fired.scroll_footer = true;
    push("scroll_footer", { percent: 100 });
  }

  function onScroll() {
    if (!granted()) return;
    var doc = document.documentElement;
    var seen = window.scrollY + window.innerHeight;
    var height = Math.max(doc.scrollHeight, 1);
    if (height <= window.innerHeight + 8) return;
    if (!fired.scroll_mid && seen >= height * 0.5) {
      fired.scroll_mid = true;
      push("scroll_mid", { percent: 50 });
    }
    if (seen >= height - 8) markFooter();
  }

  function arm() {
    if (armed) return;
    armed = true;
    pageView();
    flush();
    var footer = document.querySelector("footer");
    if (footer && "IntersectionObserver" in window) {
      var watch = new IntersectionObserver(function (entries) {
        if (entries.some(function (entry) { return entry.isIntersecting; })) {
          markFooter();
          watch.disconnect();
        }
      }, { threshold: 0.15 });
      watch.observe(footer);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function grant() {
    try {
      localStorage.setItem(KEY, "accepted");
    } catch (e) {}
    if (typeof gtag === "function") {
      gtag("consent", "update", {
        ad_storage: "granted",
        ad_user_data: "granted",
        ad_personalization: "granted",
        analytics_storage: "granted",
      });
    }
    loadTags();
    arm();
    var pending = waiters;
    waiters = [];
    pending.forEach(function (fn) {
      try {
        fn();
      } catch (e) {}
    });
  }

  function deny() {
    try {
      localStorage.setItem(KEY, "rejected");
      sessionStorage.removeItem(QUEUE);
    } catch (e) {}
    waiters = [];
  }

  function copy() {
    var pt = (document.documentElement.lang || "").toLowerCase().indexOf("pt") === 0;
    if (pt) {
      return {
        text: "Usamos cookies para medir visitas e melhorar o IkiApp.",
        accept: "Aceitar",
        reject: "Recusar",
      };
    }
    return {
      text: "We use cookies to measure visits and improve IkiApp.",
      accept: "Accept",
      reject: "Decline",
    };
  }

  function mountBanner() {
    var c = copy();
    var bar = document.createElement("div");
    bar.className = "cookie-bar";
    bar.setAttribute("role", "dialog");
    bar.setAttribute("aria-label", c.accept);
    bar.innerHTML =
      '<p class="cookie-bar__text"></p>' +
      '<div class="cookie-bar__actions">' +
      '<button type="button" class="btn btn--ghost cookie-bar__reject"></button>' +
      '<button type="button" class="btn btn--cyan cookie-bar__accept"></button>' +
      "</div>";
    bar.querySelector(".cookie-bar__text").textContent = c.text;
    bar.querySelector(".cookie-bar__reject").textContent = c.reject;
    bar.querySelector(".cookie-bar__accept").textContent = c.accept;
    bar.querySelector(".cookie-bar__accept").addEventListener("click", function () {
      bar.remove();
      grant();
    });
    bar.querySelector(".cookie-bar__reject").addEventListener("click", function () {
      deny();
      bar.remove();
    });
    document.body.appendChild(bar);
  }

  function start() {
    if (granted()) {
      grant();
      return;
    }
    if (read() === "rejected") {
      deny();
      return;
    }
    mountBanner();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
