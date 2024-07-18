import * as page from './page.js';
import {getCookie} from './data_function.js';

const searchWrapper = document.querySelector('.search-wrapper');
const searchField = document.querySelector('.search-field');
const progressIcon = document.querySelector('.progress-icon');
const searchResult = document.querySelector('.search-result');
const resultList = document.querySelector('.result-list');

const main = document.querySelector('main');
const btn = {
  searchBtn: document.querySelector('.search-btn'),
  closeBtn: document.querySelector('.close-btn'),
  positionBtn: document.querySelector('.location-btn')
};
const loadingSection = document.querySelector('.loading-section');

//check if cookies setted-------------------
if (document.cookie != '') {
  const lat = getCookie('lat');
  const lon = getCookie('lon');
  const name = getCookie('name');

  page.updateMainCard(lat, lon, name);
  page.updateDayForecast(lat, lon);
  page.updateHighlights(lat, lon);
  page.updateHourForecast(lat, lon);
} else {
  const lat = 48.8588897;
  const lon = 2.3200410217200766;
  const name ="Paris";

  page.updateMainCard(lat, lon, name);
  page.updateDayForecast(lat, lon);
  page.updateHighlights(lat, lon);
  page.updateHourForecast(lat, lon);
}

//search animation display on mobile-tablet-------------------
const searchView = document.querySelector('.search-view');

btn.searchBtn.addEventListener('click', () => {
  searchView.classList.add('show-search-view');
});
btn.closeBtn.addEventListener('click', () => {
  searchView.classList.remove('show-search-view');
});


//search result interaction ---------------
let debounceTimeout = 0;

searchField.addEventListener('keydown', () => {
  progressIcon.style.display = 'block';
});
searchField.addEventListener('keyup', () => {
  progressIcon.style.display = 'none';
});
searchField.addEventListener('input', () => {
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(() => {
    const resultListNodes = [...resultList.children];
    const url = `https://api.openweathermap.org/geo/1.0/direct?lang=en&q=${searchField.value}&limit=5&appid=770537c6114a67fd86fe81d5c28f8305`;
    const desktop = window.matchMedia("(min-width: 1200px)");

    if (searchField.value) {
      progressIcon.display = 'none';
      if (searchField.value.length >= 3) {
        console.log('ok')
        fetch(url)
          .then((data) => data.json())
          .then((jsonData) => {
            page.removeNodes(resultListNodes);
            if (jsonData.length != 0) {
              jsonData.forEach((city, index) => {
                const resultItem =
                  `<li class="result-item" id="${index}">
                  <span class="material-symbols-rounded">location_on</span>
                  <div class="result-item-text">
                    <p class="title">${city.name}</p>
                    <p class="subtitle">${city.state}, ${city.country}</p>
                  </div>
                </li>`;
                resultList.insertAdjacentHTML("beforeend", resultItem);
              })
              if (desktop.matches) {
                searchWrapper.style.borderRadius = '35px 35px 0px 0px';
              }
              searchResult.style.display = 'block';
            }
            else {
              if (desktop.matches) {
                searchWrapper.style.borderRadius = '35px';
              }
              searchResult.style.display = 'none';
            }
          })
          .catch((error) => {
            console.log(error);
            if (desktop.matches) {
              searchWrapper.style.borderRadius = '35px';
            }
            searchResult.style.display = 'none';
          });
      }
    }
    else {
      if (desktop.matches) {
        searchWrapper.style.borderRadius = '35px';
      }
      page.removeNodes(resultListNodes);
      searchResult.style.display = 'none';
    }
  }, 200);
});


//button and list result management------------------------
resultList.addEventListener('click', (e) => {
  const url = `https://api.openweathermap.org/geo/1.0/direct?lang=en&q=${searchField.value}&limit=5&appid=770537c6114a67fd86fe81d5c28f8305`;
  let li = e.target.closest('li');
 
  if (activeLocation) {
    btn.positionBtn.classList.remove('location-active');
    activeLocation = false;
  }

  fetch(url)
    .then((data) => data.json())
    .then((jsonData) => jsonData[li.id])
    .then((city) => {
      setTimeout(() => {
        page.updateMainCard(city.lat, city.lon, city.name);
        page.updateDayForecast(city.lat, city.lon);
        page.updateHighlights(city.lat, city.lon);
        page.updateHourForecast(city.lat, city.lon);
      }, 320);
      document.cookie = 'lat=' + city.lat;
      document.cookie = 'lon=' + city.lon;
      document.cookie = 'name=' +  city.name;
    })  
    .catch((err) => {
      console.log(err);
    });
  const desktop = window.matchMedia("(min-width: 1200px)");
  if(desktop.matches) {
    searchWrapper.style.borderRadius = '35px';
  } else {
    searchView.classList.remove('show-search-view');
  }
  searchResult.style.display = 'none';
  loadingSection.classList.remove('animate-on-load');
  void loadingSection.offsetWidth;
  loadingSection.classList.add('animate-on-load');
  searchField.value = '';
})


// remove the search list display if user clicks on the page--------------------------
document.body.addEventListener('click', (e) => {
  const desktop = window.matchMedia("(min-width: 1200px)");
  const ele = e.target.closest('.search-view');
  if(desktop.matches) {
    if (ele != searchView) {
      searchResult.style.display = 'none';
      searchWrapper.style.borderRadius = '35px'; 
    }
  }
})


// location handling - state----------------------------------------
let activeLocation = false;
const locationHandler = () => {
  const success = async (position) => {
    if (activeLocation) {
      btn.positionBtn.classList.remove('location-active');
      activeLocation = false;
      return;
    }
    activeLocation = true;
    const info = position.coords;
    const lat = info.latitude;
    const lon = info.longitude;

    try {
      const url = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=770537c6114a67fd86fe81d5c28f8305`;
      const response = await fetch(url);
      const json = await response.json();
      const cityName = json[0].name;
      setTimeout(() => {
        page.updateMainCard(lat, lon, cityName);
        page.updateDayForecast(lat, lon);
        page.updateHighlights(lat, lon);
        page.updateHourForecast(lat, lon);
      }, 320);
      document.cookie = 'lat=' + lat;
      document.cookie = 'lon=' + lon;
      document.cookie = 'name=' + cityName;
    } catch (error) {
      console.log(error);
    }
    btn.positionBtn.classList.add('location-active');
    loadingSection.classList.remove('animate-on-load');
    void loadingSection.offsetWidth;
    loadingSection.classList.add('animate-on-load');
  };  
  
  const fail = () => {
    alert('Your location is blocked');
  };
  navigator.geolocation.getCurrentPosition(success, fail);
}  
btn.positionBtn.addEventListener('click', locationHandler);
