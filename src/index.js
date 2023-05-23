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
        Notiflix.Notify.failure("Error occurred. Please try again later.");
        console.error(error);
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

  const flagImg = document.createElement("img");
  flagImg.src = country.flags.svg;
  flagImg.alt = `${country.name.official} flag`;
  flagImg.classList.add("flag");

  const countryName = document.createElement("h2");
  countryName.textContent = country.name.official;

  const capital = document.createElement("p");
  capital.textContent = `Capital: ${country.capital}`;

  const population = document.createElement("p");
  population.textContent = `Population: ${country.population}`;

  const languages = document.createElement("p");
  if (Array.isArray(country.languages)) {
    languages.textContent = `Languages: ${country.languages.join(", ")}`;
  } else {
    languages.textContent = "Languages: N/A";
  }

  countryInfo.appendChild(flagImg);
  countryInfo.appendChild(countryName);
  countryInfo.appendChild(capital);
  countryInfo.appendChild(population);
  countryInfo.appendChild(languages);

  countryList.appendChild(countryInfo);
}
