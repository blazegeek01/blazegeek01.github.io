(function () {
  "use strict";
  var KEY = "blazeGeeksCookieConsent";
  var saved = null;
  try { saved = window.localStorage.getItem(KEY); } catch (error) {}
  if (saved === "all" || saved === "essential") return;

  var style = document.createElement("style");
  style.textContent = [
    "#blaze-cookie-consent{position:fixed;z-index:99999;left:24px;right:24px;bottom:24px;width:min(720px,calc(100% - 48px));margin:0 auto;padding:22px 24px;border:1px solid rgba(255,255,255,.16);border-radius:18px;background:linear-gradient(135deg,rgba(25,17,21,.97),rgba(9,9,13,.97));box-shadow:0 24px 80px rgba(0,0,0,.48),0 0 36px rgba(240,68,50,.12);backdrop-filter:blur(22px);-webkit-backdrop-filter:blur(22px);color:#f7f2ef;font-family:Inter,Manrope,Arial,sans-serif;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:20px;align-items:center;animation:blazeCookieIn .45s cubic-bezier(.2,.7,.2,1) both}",
    "#blaze-cookie-consent *{box-sizing:border-box}",
    "#blaze-cookie-consent .blaze-cookie-kicker{display:block;margin:0 0 7px;color:#ff9a70;font-size:10px;font-weight:800;letter-spacing:.18em;text-transform:uppercase}",
    "#blaze-cookie-consent h2{margin:0 0 7px;color:#fff;font-size:19px;line-height:1.2;letter-spacing:-.025em}",
    "#blaze-cookie-consent p{margin:0;color:#c7bdc0;font-size:12px;line-height:1.7}",
    "#blaze-cookie-consent .blaze-cookie-actions{display:flex;flex-direction:column;gap:9px;min-width:154px}",
    "#blaze-cookie-consent button{min-height:40px;padding:10px 14px;border-radius:8px;border:1px solid transparent;font:800 11px/1.2 Inter,Manrope,Arial,sans-serif;cursor:pointer;transition:transform .18s ease,filter .18s ease}",
    "#blaze-cookie-consent button:hover{transform:translateY(-1px);filter:brightness(1.08)}",
    "#blaze-cookie-consent .blaze-cookie-accept{background:linear-gradient(105deg,#f04432,#ff8a45);color:#170d0c;box-shadow:0 7px 22px rgba(240,68,50,.2)}",
    "#blaze-cookie-consent .blaze-cookie-essential{background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.18);color:#eee6e5}",
    "@keyframes blazeCookieIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}",
    "@media(max-width:600px){#blaze-cookie-consent{left:12px;right:12px;bottom:12px;width:auto;padding:18px;border-radius:15px;grid-template-columns:1fr;gap:15px}#blaze-cookie-consent h2{font-size:17px}#blaze-cookie-consent .blaze-cookie-actions{display:grid;grid-template-columns:1fr 1fr;min-width:0}#blaze-cookie-consent button{padding:10px 8px;font-size:10px}}",
    "@media(prefers-reduced-motion:reduce){#blaze-cookie-consent{animation:none}}"
  ].join("");
  document.head.appendChild(style);

  var panel = document.createElement("section");
  panel.id = "blaze-cookie-consent";
  panel.setAttribute("role", "region");
  panel.setAttribute("aria-label", "Cookie preferences");
  panel.innerHTML =
    '<div class="blaze-cookie-copy">' +
      '<span class="blaze-cookie-kicker">YOUR PRIVACY, YOUR CHOICE</span>' +
      '<h2>We value your privacy.</h2>' +
      '<p>We use essential cookies and similar storage to keep this website working smoothly. You can choose whether to allow optional cookies. Your preference is saved on this device.</p>' +
    '</div>' +
    '<div class="blaze-cookie-actions">' +
      '<button type="button" class="blaze-cookie-accept">Allow all cookies</button>' +
      '<button type="button" class="blaze-cookie-essential">Essential only</button>' +
    '</div>';
  document.body.appendChild(panel);

  function choose(value) {
    try { window.localStorage.setItem(KEY, value); } catch (error) {}
    panel.remove();
    style.remove();
    window.dispatchEvent(new CustomEvent("blaze-cookie-consent", { detail: { choice: value } }));
  }
  panel.querySelector(".blaze-cookie-accept").addEventListener("click", function () { choose("all"); });
  panel.querySelector(".blaze-cookie-essential").addEventListener("click", function () { choose("essential"); });
})();