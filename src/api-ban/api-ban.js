"use strict";

document.addEventListener("DOMContentLoaded", function () {
  // Insère les styles CSS globaux
  const style = document.createElement("style");
  style.textContent = `
    [data-ban-results] {
      display: none;
      position: absolute;
      left: 0%;
      top: 100%;
      z-index: 999;
      overflow: auto;
      width: 100%;
      padding: 0.5rem;
      border-radius: 0.5rem;
      background-color: white;
      box-shadow: var(--ban-box-shadow, 0 2px 5px 0 rgba(0,0,0,0.2));
    }
    .ban-result-item {
      padding: 0.5rem;
      border-radius: 0.2rem;
      transition: all 300ms ease;
      cursor: pointer;
      background-color: transparent;
    }
    .ban-result-item.active,
    .ban-result-item:hover {
      background-color: #eee;
    }
  `;
  document.head.appendChild(style);

  const logMessage = (shouldLog, ...args) => {
    if (shouldLog) console.log(...args);
  };

  const debounce = (fn, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(...args), delay);
    };
  };

  const fetchSuggestions = async (query, shouldLog) => {
    const apiUrl = `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(
      query
    )}&limit=5&type=housenumber&autocomplete=1`;
    logMessage(shouldLog, "Suggestions de recherche pour :", query);
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      return data.features || [];
    } catch (e) {
      return [];
    }
  };

  const highlightItems = (items, currentFocus) => {
    items.forEach((item, index) => {
      item.classList.remove("active");
      if (index === currentFocus) item.classList.add("active");
    });
  };

  const handleSelection = (
    { name, postcode, city },
    inputField,
    zipcodeField,
    cityField,
    resultsContainer,
    shouldLog
  ) => {
    let selectedAddress = "";
    if (inputField) {
      if (inputField.getAttribute("data-ban-input") === "split") {
        inputField.value = name || "";
        selectedAddress = inputField.value;
      } else {
        inputField.value = `${name || ""}, ${postcode || ""} ${city || ""}`;
        selectedAddress = inputField.value;
      }
    }
    if (zipcodeField) {
      zipcodeField.value = postcode || "";
      logMessage(shouldLog, "Zipcode field updated:", zipcodeField.value);
    }
    if (cityField) {
      cityField.value = city || "";
      logMessage(shouldLog, "Ville sélectionnée:", cityField.value);
    }
    logMessage(shouldLog, "Adresse sélectionnée:", selectedAddress);
    resultsContainer.style.display = "none";
  };

  const showSuggestions = (
    suggestions,
    query,
    resultsContainer,
    handleClick
  ) => {
    resultsContainer.innerHTML = "";
    if (suggestions.length === 0) {
      resultsContainer.style.display = "none";
      return;
    }
    const queryRegex = new RegExp(`(${query})`, "gi");
    suggestions.forEach(({ properties }) => {
      const resultItem = document.createElement("div");
      resultItem.className = "ban-result-item";
      const highlightedLabel = properties.label.replace(
        queryRegex,
        "<strong>$1</strong>"
      );
      resultItem.innerHTML = highlightedLabel;
      resultItem.addEventListener("click", () => handleClick(properties));
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

    const performSearch = debounce(async (query) => {
      if (query.length > 2) {
        const suggestions = await fetchSuggestions(query, shouldLog);
        showSuggestions(suggestions, query, resultsContainer, (props) =>
          handleSelection(
            props,
            inputField,
            zipcodeField,
            cityField,
            resultsContainer,
            shouldLog
          )
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
      const items = resultsContainer.querySelectorAll(".ban-result-item");
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
