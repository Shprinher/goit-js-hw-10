import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries.js';

const searchBox = document.querySelector("#search-box");
const countryList = document.querySelector(".country-list");

searchBox.addEventListener(
  "input",
  debounce((event) => {
    const searchTerm = event.target.value.trim();

    if (searchTerm === "") {
      clearCountryList();
      return;
    }

    fetchCountries(searchTerm)
      .then((countries) => {
        console.log(countries);
        if (countries.length === 0) {
          Notiflix.Notify.failure("Oops, there is no country with that name.");
        } else if (countries.length > 10) {
          Notiflix.Notify.info(
            "Too many matches found. Please enter a more specific name."
          );
        } else if (countries.length >= 2 && countries.length <= 10) {
          renderCountryList(countries);
        } else {
          renderCountryInfo(countries[0]);
        }
      })
      .catch((error) => {
        if(error.message==="404"){
                Notiflix.Notify.failure("Error occurred. Please try again later.");
                console.error(error);
        } else {
            Notiflix.Notify.failure(error.message);
        }
              });
  }, 300)
);

function clearCountryList() {
  countryList.innerHTML = "";
}

function renderCountryList(countries) {
  clearCountryList();

  countries.forEach((country) => {
    const listItem = document.createElement("li");
    const flagImg = document.createElement("img");
    const countryName = document.createElement("span");

    flagImg.src = country.flags.svg;
    flagImg.alt = `${country.name.official} flag`;
    flagImg.classList.add("flag");

    countryName.textContent = country.name.official;

    listItem.appendChild(flagImg);
    listItem.appendChild(countryName);
    countryList.appendChild(listItem);
  });
}

function renderCountryInfo(country) {
  console.log(country);
  clearCountryList();

  const countryInfo = document.createElement("div");
  countryInfo.classList.add("country-info");

  const languages = Array.isArray(country.languages)
    ? country.languages.join(", ")
    : typeof country.languages === "object"
    ? Object.values(country.languages).join(", ")
    : "N/A";

  countryInfo.innerHTML = `
    <img src="${country.flags.svg}" alt="${country.name.official} flag" class="flag">
    <h2>${country.name.official}</h2>
    <p>Capital: ${country.capital}</p>
    <p>Population: ${country.population}</p>
    <p>Languages: ${languages}</p>
  `;

  countryList.appendChild(countryInfo);
}
