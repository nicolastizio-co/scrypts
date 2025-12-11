"use strict";
document.addEventListener("DOMContentLoaded", function () {
  const style = document.createElement("style");
  style.textContent = `
    [data-email-results]:not([data-email-results="no-css"]) {
      display: none;
      position: absolute;
      left: 0;
      top: 100%;
      z-index: 999;
      overflow: auto;
      width: 100%;
      max-height: 15rem;
      padding: 0.5rem;
      border-radius: 0.5rem;
      background-color: white;
      box-shadow: var(--email-box-shadow, 0 2px 5px 0 rgba(0,0,0,0.2));
    }
    [data-email-item]:not([data-email-item="no-css"]) {
      padding: 0.5rem;
      border-radius: 0.2rem;
      transition: all 300ms ease;
      cursor: pointer;
      background-color: transparent;
      scroll-margin: 0.5rem;
    }
    [data-email-item]:not([data-email-item="no-css"]).active,
    [data-email-item]:not([data-email-item="no-css"]):hover {
      background-color: #eee;
    }
  `;
  document.head.appendChild(style);

  const defDomains = ["gmail.com", "hotmail.com", "icloud.com", "outlook.com", "yahoo.com"];

  const getSugg = (local, doms) => !local || !local.trim() ? [] : doms.map(d => `${local}@${d}`);

  const hlItems = (items, focus) => {
    items.forEach((item, i) => {
      item.classList.toggle("active", i === focus);
      if (i === focus) item.scrollIntoView({ block: "nearest", behavior: "smooth" });
    });
  };

  const hideResults = (rc) => rc.style.display = "none";

  const showSugg = (sugg, rc, onClick, setFocus) => {
    const tpl = rc.querySelector("[data-email-item]");
    const cls = tpl ? tpl.className : "";
    const attr = tpl ? tpl.getAttribute("data-email-item") : "";

    rc.innerHTML = "";

    if (!sugg.length) return hideResults(rc);

    sugg.forEach((email) => {
      const item = document.createElement("div");
      item.setAttribute("data-email-item", attr);
      if (cls) item.className = cls;

      const [local, domain] = email.split("@");
      item.innerHTML = domain ? `${local}<strong>@${domain}</strong>` : email;
      item.addEventListener("click", () => onClick(email));
      rc.appendChild(item);
    });

    if (sugg.length === 1) {
      rc.lastChild.classList.add("active");
      setFocus(0);
    }
    rc.style.display = "block";
  };

  const validateEmail = (email, doms) => {
    if (!email.includes("@")) return false;
    const domain = email.split("@")[1];
    return doms.some(d => domain.toLowerCase() === d.toLowerCase());
  };

  document.querySelectorAll("[data-email-results]").forEach((rc) => {
    const shadow = rc.getAttribute("data-email-results");
    if (shadow && shadow !== "no-css") rc.style.setProperty("--email-box-shadow", shadow);
  });

  document.querySelectorAll("[data-email-wrapper]").forEach((wrap) => {
    wrap.style.position = "relative";

    const inp = wrap.querySelector("[data-email-input]");
    const rc = wrap.querySelector("[data-email-results]");

    let focus = -1;

    if (!inp || !rc) return;

    const customDoms = inp.getAttribute("data-email-domains");
    const doms = customDoms ? customDoms.split(",").map(d => d.trim()).filter(d => d) : defDomains;
    const validate = inp.hasAttribute("data-email-validate");
    const errTxt = inp.getAttribute("data-email-error") || "Please use an authorized email domain: ";

    inp.addEventListener("input", () => {
      const q = inp.value.trim();

      if (!q.includes("@")) return hideResults(rc);

      const [local, domPart] = q.split("@");

      if (!local || domPart === undefined) return hideResults(rc);

      const filtered = domPart ? doms.filter(d => d.toLowerCase().startsWith(domPart.toLowerCase())) : doms;
      const sugg = getSugg(local, filtered);

      showSugg(sugg, rc, (email) => {
        inp.value = email;
        hideResults(rc);
      }, (i) => focus = i);
    });

    if (validate) {
      const form = inp.closest("form");
      if (form) {
        const checkEmail = (e) => {
          const email = inp.value.trim();
          const valid = validateEmail(email, doms);
          inp.setCustomValidity(valid ? "" : errTxt + doms.join(", "));
          if (!valid && e.type === "submit") {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            inp.reportValidity();
            return false;
          }
          return true;
        };

        form.addEventListener("submit", checkEmail, true);
        form.addEventListener("submit", checkEmail);
        inp.addEventListener("input", () => inp.setCustomValidity(""));
        inp.addEventListener("blur", checkEmail);
      }
    }

    inp.addEventListener("keydown", (e) => {
      const items = rc.querySelectorAll("[data-email-item]");

      if (e.key === "Escape") {
        e.preventDefault();
        hideResults(rc);
        focus = -1;
        return;
      }

      if (!items.length) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        focus = (focus + 1) % items.length;
        hlItems(items, focus);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        focus = (focus - 1 + items.length) % items.length;
        hlItems(items, focus);
      } else if (e.key === "Enter" && rc.style.display !== "none" && items.length) {
        e.preventDefault();
        items[focus > -1 ? focus : 0]?.click();
      }
    });

    document.addEventListener("click", (e) => {
      if (!wrap.contains(e.target)) hideResults(rc);
    });
  });
});
