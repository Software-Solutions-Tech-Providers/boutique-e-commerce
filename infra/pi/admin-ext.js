/*
 * raisfast admin extensions (injected by nginx into /admin HTML; same-origin,
 * so it satisfies raisfast's CSP `script-src 'self'`).
 *  1. Login page: "Tenant" field (empty => default) + "Continue with Google".
 *  2. Sidebar: tenant switcher dropdown (All + every tenant).
 * Tenant selection is stored where the admin UI keeps it:
 *   localStorage["tenant-storage"] = {state:{currentTenantId}, version:0}
 */
(function () {
  "use strict";
  var TS_KEY = "tenant-storage";
  var AUTH_KEY = "auth-storage";
  var PENDING = "ext-pending-tenant";

  function readJSON(k) { try { return JSON.parse(localStorage.getItem(k) || "null"); } catch (e) { return null; } }
  function currentTenant() { var s = readJSON(TS_KEY); return (s && s.state && s.state.currentTenantId) || null; }
  function setTenant(t) { localStorage.setItem(TS_KEY, JSON.stringify({ state: { currentTenantId: t || null }, version: 0 })); }
  function accessToken() { var a = readJSON(AUTH_KEY); return (a && a.state && a.state.accessToken) || null; }
  function isLoginPath() { return /^\/admin\/auth\/(login|user-login)\/?$/.test(location.pathname); }
  // Tenant row "Default" stores its data under tenant id "default".
  function tenantIdOf(name) { return String(name).toLowerCase() === "default" ? "default" : String(name); }

  function el(tag, attrs, text) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (text) n.textContent = text;
    return n;
  }

  function fetchTenants() {
    var tok = accessToken();
    if (!tok) return Promise.resolve(null);
    return fetch("/api/v1/admin/tenants?page=1&page_size=100", { headers: { Authorization: "Bearer " + tok } })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) {
        var items = j && j.data && (j.data.items || j.data);
        return Array.isArray(items) ? items.map(function (t) { return tenantIdOf(t.name); }) : null;
      })
      .catch(function () { return null; });
  }

  /* ---------------- 1. login page ---------------- */
  function tenantInputValue() {
    var i = document.getElementById("ext-tenant");
    return i ? i.value.trim() : "";
  }
  function rememberChosenTenant() {
    var t = tenantInputValue() || "default";
    setTenant(t);
    sessionStorage.setItem(PENDING, t);
  }

  function enhanceLogin() {
    if (!isLoginPath()) return;
    var pw = document.querySelector('input[type="password"]');
    var form = pw && pw.closest("form");
    if (!form) return;

    if (!document.getElementById("ext-tenant")) {
      var wrap = el("div", { id: "ext-tenant-wrap", style: "display:flex;flex-direction:column;gap:6px;margin-bottom:12px" });
      var lab = el("label", { for: "ext-tenant", style: "font-size:14px;font-weight:500" }, "Tenant");
      var inp = el("input", {
        id: "ext-tenant", type: "text", autocomplete: "organization", placeholder: "default",
        style: "height:36px;border:1px solid #d4d4d8;border-radius:6px;padding:0 12px;font-size:14px;background:transparent;color:inherit"
      });
      inp.value = sessionStorage.getItem("ext-last-tenant") || "";
      var hint = el("span", { style: "font-size:12px;opacity:.65" }, "Shop to open after login (e.g. shop1). Leave empty for default.");
      wrap.appendChild(lab); wrap.appendChild(inp); wrap.appendChild(hint);
      form.insertBefore(wrap, form.firstChild);
      inp.addEventListener("input", function () { sessionStorage.setItem("ext-last-tenant", inp.value.trim()); });
      // capture phase: runs before React's submit handler
      form.addEventListener("submit", rememberChosenTenant, true);
    }

    // Google button only where raisfast doesn't already render one
    var hasNative = !!document.querySelector('a[href*="/auth/oauth/google"]:not(#ext-google)');
    if (!hasNative && !document.getElementById("ext-google") && window.__extGoogle) {
      var a = el("a", {
        id: "ext-google", href: "/api/v1/auth/oauth/google",
        style: "display:flex;align-items:center;justify-content:center;gap:8px;height:38px;border:1px solid #d4d4d8;border-radius:6px;font-size:14px;font-weight:500;text-decoration:none;color:inherit;margin-bottom:14px"
      });
      a.innerHTML = '<svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.3-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.2-.1-2.3-.4-3.5z"/></svg><span>Continue with Google</span>';
      a.addEventListener("click", rememberChosenTenant);
      var sep = el("div", { id: "ext-google-sep", style: "text-align:center;font-size:12px;opacity:.6;margin:-6px 0 12px" }, "or");
      form.parentNode.insertBefore(a, form);
      form.parentNode.insertBefore(sep, form);
    }
    // native Google link (user-login page) should honour the tenant field too
    var native = document.querySelector('a[href*="/auth/oauth/google"]:not(#ext-google)');
    if (native && !native.__extHooked) { native.__extHooked = true; native.addEventListener("click", rememberChosenTenant); }
  }

  /* After login the SPA navigates without reloading, so its in-memory tenant
   * store still holds the old value: validate the chosen tenant, then reload
   * once so the admin UI picks it up. */
  function afterLogin() {
    var pending = sessionStorage.getItem(PENDING);
    if (!pending || isLoginPath() || !accessToken()) return;
    sessionStorage.removeItem(PENDING);
    fetchTenants().then(function (list) {
      if (list && list.indexOf(pending) === -1) {
        alert('Tenant "' + pending + '" not found. Opening default instead.');
        setTenant("default");
      }
      location.reload();
    });
  }

  /* ---------------- 2. sidebar tenant switcher ---------------- */
  var tenantsCache = null, loadingTenants = false;
  function enhanceSidebar() {
    if (isLoginPath() || document.getElementById("ext-tenant-switch")) return;
    var label = Array.prototype.find.call(document.querySelectorAll("span"), function (s) {
      return s.textContent.trim() === "Tenant" && /uppercase/.test(s.className);
    });
    if (!label) return;
    var row = label.parentElement;
    if (!tenantsCache) {
      if (!loadingTenants) {
        loadingTenants = true;
        fetchTenants().then(function (l) { tenantsCache = l; loadingTenants = false; schedule(); });
      }
      return;
    }
    var cur = currentTenant();
    var sel = el("select", {
      id: "ext-tenant-switch", title: "Switch tenant",
      style: "margin:0 16px 8px;height:30px;border:1px solid #d4d4d8;border-radius:6px;padding:0 8px;font-size:13px;background:transparent;color:inherit;width:calc(100% - 32px)"
    });
    var names = tenantsCache.slice();
    if (names.indexOf("default") === -1) names.unshift("default");
    // No "All tenants": always work inside one concrete tenant.
    names.forEach(function (n) {
      var op = el("option", { value: n }, n === "default" ? "default (platform)" : n);
      if ((cur || "default") === n) op.selected = true;
      sel.appendChild(op);
    });
    if (cur && names.indexOf(cur) === -1) { var x = el("option", { value: cur }, cur + " (unknown)"); x.selected = true; sel.appendChild(x); }
    sel.addEventListener("change", function () { setTenant(sel.value || "default"); location.reload(); });
    row.parentNode.insertBefore(sel, row.nextSibling);
  }

  /* No "All tenants" mode: if the selection is empty (first visit, or the
   * native clear button was used), pin it to "default" and reload once so
   * the admin UI's in-memory store picks it up. */
  function ensureConcreteTenant() {
    if (isLoginPath() || !accessToken() || currentTenant()) return;
    if (sessionStorage.getItem("ext-pinning")) return;
    sessionStorage.setItem("ext-pinning", "1");
    setTenant("default");
    location.reload();
  }

  /* Tenant management lives only in the platform tenant ("default"). */
  function gateTenantsMenu() {
    var inDefault = (currentTenant() || "default") === "default";
    Array.prototype.forEach.call(document.querySelectorAll('a[href="/admin/tenants"],a[href$="/tenants"]'), function (a) {
      if (!/\/admin\/tenants\/?$/.test(a.getAttribute("href") || "") && a.getAttribute("href") !== "/tenants") return;
      a.style.display = inDefault ? "" : "none";
    });
    if (!inDefault && /^\/admin\/tenants\/?$/.test(location.pathname)) {
      var c = document.querySelector("main") || document.body;
      if (!document.getElementById("ext-tenants-note") && c) {
        var n = el("div", { id: "ext-tenants-note", style: "margin:16px;padding:12px;border:1px solid #f59e0b;border-radius:6px;font-size:14px" },
          "Tenants can only be managed from the default (platform) tenant. Switch to \"default\" in the sidebar.");
        c.insertBefore(n, c.firstChild);
      }
    }
  }

  /* ---------------- wiring ---------------- */
  var timer = null;
  function run() {
    timer = null;
    try {
      if (currentTenant()) sessionStorage.removeItem("ext-pinning");
      enhanceLogin(); afterLogin(); ensureConcreteTenant(); enhanceSidebar(); gateTenantsMenu();
    } catch (e) { /* never break the admin UI */ }
  }
  function schedule() { if (!timer) timer = setTimeout(run, 150); }

  fetch("/api/v1/auth/oauth/providers")
    .then(function (r) { return r.json(); })
    .then(function (j) {
      window.__extGoogle = !!(j && Array.isArray(j.data) && j.data.some(function (p) { return p.name === "google" && p.configured; }));
      schedule();
    })
    .catch(function () {});

  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
  window.addEventListener("popstate", schedule);
  schedule();
})();
