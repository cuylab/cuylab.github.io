/*
  cookie-consent banner + analytics loader.

  reads window.LAB_ANALYTICS (set in _includes/analytics.html from
  _config.yaml). google analytics 4 and microsoft clarity are only
  loaded once the visitor clicks "accept". the choice is remembered in
  the "lab-consent" cookie for a year. window.showCookieSettings()
  re-opens the banner so a visitor can change their mind.
*/

{
  const COOKIE = "lab-consent";
  const config = window.LAB_ANALYTICS;

  // read/write the consent cookie
  const getConsent = () => {
    const match = document.cookie.match(/(?:^|;\s*)lab-consent=(granted|denied)/);
    return match ? match[1] : null;
  };
  const setConsent = (value) => {
    const year = 60 * 60 * 24 * 365;
    document.cookie = `${COOKIE}=${value};path=/;max-age=${year};samesite=lax`;
  };

  let loaded = false;

  // inject the GA4 and Clarity tags
  const loadAnalytics = () => {
    if (loaded || !config) return;
    loaded = true;

    if (config.ga) {
      const s = document.createElement("script");
      s.async = true;
      s.src = "https://www.googletagmanager.com/gtag/js?id=" + config.ga;
      document.head.appendChild(s);
      window.dataLayer = window.dataLayer || [];
      const gtag =
        window.gtag ||
        function () {
          window.dataLayer.push(arguments);
        };
      window.gtag = gtag;
      gtag("consent", "update", { analytics_storage: "granted" });
      gtag("js", new Date());
      gtag("config", config.ga, { anonymize_ip: true });
    }

    if (config.clarity) {
      (function (c, l, a, r, i, t, y) {
        c[a] =
          c[a] ||
          function () {
            (c[a].q = c[a].q || []).push(arguments);
          };
        t = l.createElement(r);
        t.async = 1;
        t.src = "https://www.clarity.ms/tag/" + i;
        y = l.getElementsByTagName(r)[0];
        y.parentNode.insertBefore(t, y);
      })(window, document, "clarity", "script", config.clarity);
    }
  };

  // build the banner element
  const buildBanner = () => {
    const banner = document.createElement("div");
    banner.className = "consent-banner";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-label", "cookie consent");
    banner.innerHTML = `
      <p class="consent-text">
        We use Google Analytics and Microsoft Clarity to understand how
        visitors use this site. No data is collected until you accept.
      </p>
      <div class="consent-buttons">
        <button type="button" class="consent-accept">Accept</button>
        <button type="button" class="consent-decline">Decline</button>
      </div>
    `;
    banner.querySelector(".consent-accept").addEventListener("click", () => {
      setConsent("granted");
      loadAnalytics();
      banner.remove();
    });
    banner.querySelector(".consent-decline").addEventListener("click", () => {
      setConsent("denied");
      banner.remove();
    });
    return banner;
  };

  const showBanner = () => {
    if (document.querySelector(".consent-banner")) return;
    document.body.appendChild(buildBanner());
  };

  // let a footer link re-open the banner
  window.showCookieSettings = showBanner;

  const onLoad = () => {
    if (!config) return;
    const consent = getConsent();
    if (consent === "granted") loadAnalytics();
    else if (consent === null) showBanner();
  };

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", onLoad);
  else onLoad();
}
