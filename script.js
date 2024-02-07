const themeBtn = document.querySelector("#theme-btn");
const countryList = document.querySelector(".country-list");
const searchInput = document.querySelector("#search");
const region = document.querySelector("#region");
const countryDetailsContainer = document.querySelector(".country-details");
let countryDetailsCloseBtn;

let countries = [];
let filteredCountries = [];

fetch("./data.json")
  .then((response) => response.json())
  .then((data) => {
    countries = data;
    filteredCountries = [...countries];
    updateCountryList(filteredCountries);
  })
  .catch((error) => console.error("Error fetching data:", error));

function formatPopulation(population) {
  if (population >= 10000000) {
    return (population / 10000000).toFixed(1) + " Crore";
  } else if (population >= 100000) {
    return (population / 100000).toFixed(1) + " Lakh";
  } else if (population >= 10000) {
    return (population / 1000).toFixed(1) + " K";
  } else {
    return population;
  }
}

function updateCountryList(countries) {
  if (countries.length === 0) {
    countryList.innerHTML = `<p class="error">No country found!<p/>`;
    return;
  }

  const countryItems = countries
    .map(
      (country) => `<li class="country-item" data-country='${JSON.stringify(
        country
      )}'>
       <img src="${country.flags.svg}" />
       <div class="country-content">
        <h2>${country.name}</h2>
        <p><strong>Population:</strong> ${formatPopulation(
          country.population
        )}</p>
        <p><strong>Region:</strong> ${country.region}</p>
        <p><strong>Capital:</strong> ${country.capital}</p>
       </div>
    </li>`
    )
    .join(" ");

  countryList.innerHTML = countryItems;
}

function renderCountryDetails(countryData) {
  console.log(countryData);
  countryDetailsContainer.classList.add("active");
  const overlay = document.querySelector(".overlay");
  overlay.classList.add("active");
  const countryDetails = `
     <img src=${countryData.flags.svg} alt=${countryData.name} />
     <div class="country-details-content">
      <strong class="country-details-close">❌</strong>
      <h1>${countryData.name}</h1>
      <div class="country-details-lists">
       <ul class="country-details-list-1">
        <li><strong>Native Name: </strong>${countryData.nativeName}</li>
        <li><strong>Region: </strong>${countryData.region}</li>
        <li><strong>Population: </strong>${formatPopulation(
          countryData.population
        )}</li>
        <li><strong>Sub Region:</strong> ${countryData.subregion}</li>
        <li><strong>Capital: </strong>${countryData.capital}</li>
       </ul>
       <ul class="country-details-list-2">
        <li><strong>Top Level Domain: </strong>${
          countryData.topLevelDomain
            ? countryData.topLevelDomain.join(", ")
            : "No top level domain data available"
        }</li>
        <li><strong>Currencies: </strong>${
          countryData.currencies
            ? countryData.currencies.map((currency) => currency.name).join(" ")
            : "No currenice data avilable"
        }</li>
        <li><strong>Languages: </strong>${
          countryData.languages
            ? countryData.languages.map((language) => language.name).join(", ")
            : "No laguage data available"
        }</li>
       </ul>
      </div>
      <p class="country-details-extra"><strong>Border Countries: </strong>${
        countryData.borders
          ? countryData.borders.join(" ")
          : "No borders data avialable!"
      }
      </p>
     </div>
    `;

  countryDetailsContainer.innerHTML = countryDetails;
  countryDetailsCloseBtn = document.querySelector(".country-details-close");
  countryDetailsCloseBtn.addEventListener("click", () => {
    const countryDetailsContainer = document.querySelector(".country-details");
    countryDetailsContainer.classList.remove("active");
    const overlay = document.querySelector(".overlay");
    overlay.classList.remove("active");
  });
}

function filterCountries() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const regionValue = region.value.trim().toLowerCase();

  filteredCountries = countries.filter(
    (country) =>
      country.name.toLowerCase().includes(searchTerm) &&
      country.region.toLowerCase().includes(regionValue)
  );

  updateCountryList(filteredCountries);
}

function debounce(func, delay) {
  let timer;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}

searchInput.addEventListener("input", debounce(filterCountries, 300));
region.addEventListener("change", filterCountries);

countryList.addEventListener("click", (e) => {
  const countryItem = e.target.closest(".country-item");
  if (!countryItem) return;

  const countryData = JSON.parse(countryItem.dataset.country);
  renderCountryDetails(countryData);
});

themeBtn.addEventListener("click", () => {
  const root = document.documentElement;
  const computedRootStyle = getComputedStyle(root);
  const isLightMode =
    computedRootStyle.getPropertyValue("--clr-background") ===
    "hsl(0, 0%, 95%)";

  if (isLightMode) {
    themeBtn.innerText = "☀️ Light Mode";
    root.style.setProperty("--clr-background", "hsl(207, 26%, 17%)");
    root.style.setProperty("--clr-text", "hsl(0, 0%, 100%)");
    root.style.setProperty("--clr-input", "hsl(0, 0%, 52%)");
    root.style.setProperty("--clr-element", "hsl(209, 23%, 22%)");
  } else {
    themeBtn.innerText = "🌙 Dark Mode";
    root.style.setProperty("--clr-background", "hsl(0, 0%, 95%)");
    root.style.setProperty("--clr-text", "hsl(200, 15%, 8%)");
    root.style.setProperty("--clr-input", "hsl(0, 0%, 52%)");
    root.style.setProperty("--clr-element", "hsl(0, 0%, 100%)");
  }
});
