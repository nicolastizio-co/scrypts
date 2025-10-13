"use strict";
document.addEventListener("DOMContentLoaded", function () {
  const style = document.createElement("style");
  style.textContent = `
    [data-ban-results]:not([data-ban-results="no-css"]) {
      display: none;
      position: absolute;
      left: 0%;
      top: 100%;
      z-index: 999;
      overflow: auto;
      width: 100%;
      max-height: 15rem;
      padding: 0.5rem;
      border-radius: 0.5rem;
      background-color: white;
      box-shadow: var(--ban-box-shadow, 0 2px 5px 0 rgba(0,0,0,0.2));
    }
    [data-ban-item]:not([data-ban-item="no-css"]) {
      padding: 0.5rem;
      border-radius: 0.2rem;
      transition: all 300ms ease;
      cursor: pointer;
      background-color: transparent;
      scroll-margin: 0.5rem;
    }
    [data-ban-item]:not([data-ban-item="no-css"]).active,
    [data-ban-item]:not([data-ban-item="no-css"]):hover {
      background-color: #eee;
    }
  `;
  document.head.appendChild(style);

  const hasLogWrapper = document.querySelector('[data-ban-wrapper="log"]');

  const logMessage = (shouldLog, ...args) => {
    if (shouldLog) console.log(...args);
  };

  if (hasLogWrapper) {
    console.log("API BAN 🇫🇷 | Made by nicolastizio.co");
  }

  const debounce = (fn, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(...args), delay);
    };
  };

  const fetchSuggestions = async (query, shouldLog, maxResults = 5) => {
    const apiUrl = `https://data.geopf.fr/geocodage/completion/?text=${encodeURIComponent(
      query
    )}&maximumResponses=${maxResults}&type=StreetAddress`;
    logMessage(shouldLog, "🔎 :", query);
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      return data.results || [];
    } catch (e) {
      return [];
    }
  };

  const highlightItems = (items, currentFocus) => {
    items.forEach((item, index) => {
      item.classList.remove("active");
      if (index === currentFocus) {
        item.classList.add("active");
        // Scroll automatique pour garder l'élément visible
        item.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    });
  };

  const handleSelection = (
    { street, zipcode, city, fulltext },
    inputField,
    zipcodeField,
    cityField,
    resultsContainer,
    shouldLog
  ) => {
    let selectedAddress = "";
    if (inputField) {
      if (inputField.getAttribute("data-ban-input") === "split") {
        const addressPart = fulltext.split(",")[0];
        inputField.value = addressPart || street || "";
        selectedAddress = inputField.value;
      } else {
        inputField.value =
          fulltext || `${street || ""}, ${zipcode || ""} ${city || ""}`;
        selectedAddress = inputField.value;
      }
    }
    if (zipcodeField) {
      zipcodeField.value = zipcode || "";
      logMessage(shouldLog, "📮 :", zipcodeField.value);
    }
    if (cityField) {
      cityField.value = city || "";
      logMessage(shouldLog, "🏙️ :", cityField.value);
    }
    logMessage(shouldLog, "📍 :", selectedAddress);
    resultsContainer.style.display = "none";
  };

  const showSuggestions = (
    suggestions,
    query,
    resultsContainer,
    handleClick,
    resetFocus
  ) => {
    // Récupérer la classe et l'attribut data-ban-item d'origine s'ils existent
    const existingItem = resultsContainer.querySelector("[data-ban-item]");
    const originalClass = existingItem ? existingItem.className : "";
    const originalDataBanItem = existingItem ? existingItem.getAttribute("data-ban-item") : "";

    resultsContainer.innerHTML = "";
    resetFocus();
    if (suggestions.length === 0) {
      resultsContainer.style.display = "none";
      return;
    }
    const queryRegex = new RegExp(`(${query})`, "gi");
    suggestions.forEach((result) => {
      const resultItem = document.createElement("div");
      resultItem.setAttribute("data-ban-item", originalDataBanItem);
      if (originalClass) {
        resultItem.className = originalClass;
      }
      const highlightedLabel = result.fulltext.replace(
        queryRegex,
        "<strong>$1</strong>"
      );
      resultItem.innerHTML = highlightedLabel;
      resultItem.addEventListener("click", () => handleClick(result));
      resultsContainer.appendChild(resultItem);
    });
    resultsContainer.style.display = "block";
  };

  document
    .querySelectorAll("[data-ban-results]")
    .forEach((resultsContainer) => {
      const customBoxShadow = resultsContainer.getAttribute("data-ban-results");
      if (customBoxShadow) {
        resultsContainer.style.setProperty("--ban-box-shadow", customBoxShadow);
      }
    });

  document.querySelectorAll("[data-ban-wrapper]").forEach((wrapper) => {
    const shouldLog = wrapper.getAttribute("data-ban-wrapper") === "log";
    wrapper.style.position = "relative";

    const inputField = wrapper.querySelector("[data-ban-input]");
    const resultsContainer = wrapper.querySelector("[data-ban-results]");
    const cityField = wrapper.querySelector("[data-ban-city]");
    const zipcodeField = wrapper.querySelector("[data-ban-zipcode]");
    let currentFocus = -1;

    if (!inputField || !resultsContainer) return;

    const maxResultsAttr = resultsContainer.getAttribute(
      "data-ban-results-count"
    );
    const maxResults =
      maxResultsAttr && !isNaN(maxResultsAttr)
        ? Math.min(Math.max(parseInt(maxResultsAttr), 1), 15)
        : 5;
    logMessage(
      shouldLog,
      "Max résultats :",
      maxResults
    );

    const resetFocus = () => {
      currentFocus = -1;
    };

    const performSearch = debounce(async (query) => {
      if (query.length > 2) {
        const suggestions = await fetchSuggestions(
          query,
          shouldLog,
          maxResults
        );
        showSuggestions(
          suggestions,
          query,
          resultsContainer,
          (result) =>
            handleSelection(
              result,
              inputField,
              zipcodeField,
              cityField,
              resultsContainer,
              shouldLog
            ),
          resetFocus
        );
      } else {
        resultsContainer.style.display = "none";
      }
    }, 300);

    inputField.addEventListener("input", () => {
      const query = inputField.value.trim();
      performSearch(query);
    });

    inputField.addEventListener("keydown", (e) => {
      const items = resultsContainer.querySelectorAll("[data-ban-item]");
      if (e.key === "Escape") {
        e.preventDefault();
        resultsContainer.style.display = "none";
        currentFocus = -1;
        return;
      }
      if (!items.length) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        currentFocus = (currentFocus + 1) % items.length;
        highlightItems(items, currentFocus);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        currentFocus = (currentFocus - 1 + items.length) % items.length;
        highlightItems(items, currentFocus);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (currentFocus > -1 && items[currentFocus]) {
          items[currentFocus].click();
        }
      }
    });

    document.addEventListener("click", (e) => {
      if (!wrapper.contains(e.target)) {
        resultsContainer.style.display = "none";
      }
    });
  });
});