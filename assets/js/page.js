import * as dataFunc from './data_function.js';

export const removeNodes = (list) => {
  list.map((ele) => ele.remove());
};

export async function updateMainCard(lat, lon, cityName) {
  const currentData = {
    temp: document.querySelector('.main-card [data-current-temp]'),
    img: document.querySelector('.main-card [data-current-img]'),
    tag: document.querySelector('.main-card [data-current-tag]'),
    date: document.querySelector('.main-card [data-current-date]'),
    location: document.querySelector('.main-card [data-current-location]')
  };
  const dayNames = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 
    'Thursday', 'Friday', 'Saturday'
  ];
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 
    'May', 'Jun', 'Jul', 'Aug', 
    'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=770537c6114a67fd86fe81d5c28f8305`;
    const response = await fetch(url);
    const json = await response.json();

    const temp = Math.round(json.main.temp) + '°';
    const tag = 
      json.weather[0].description.split('')
      .map((l, i) => i!=0? l: l.toUpperCase()).join('');
    const img = json.weather[0].icon;
    const src = './assets/images/weather_icons/' + img + '.png';
    const date = new Date();
    const day = { 
      name: dayNames[date.getDay()],
      num: date.getDate(),
      month: months[date.getMonth()]
    };
    const location = cityName + ', ' + json.sys.country;
    
    currentData.temp.textContent = temp;
    currentData.img.setAttribute('src', src);
    currentData.tag.textContent = tag;
    currentData.date.textContent = day.name + ' ' + day.num + ', ' + day.month
    currentData.location.textContent = location;
  } catch (error) {
    console.log(error);
  }
}


export async function updateDayForecast(lat, lon) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=770537c6114a67fd86fe81d5c28f8305`;
    const response = await fetch(url);
    const json = await response.json();
    let daysTemp = dataFunc.getDayTemperature(json);
    let daysDes = dataFunc.getDescription(json);
    const forecastList = document.querySelector('.forecast-list');
    const forecastListNodes = [...forecastList.children];

    if (forecastListNodes.length > 0) {
      removeNodes(forecastListNodes);
    }
    for (let i = 0; i < 5; i++) {
      const forecastItem =
        `<li class="day">
        <div class="date">
          <p data-dforecast-day>
            ${daysDes[i].dt.num == new Date().getDay()? 'Today': daysDes[i].dt.day}
          </p>
        </div>
        <div class="info">
          <img src="./assets/images/weather_icons/${daysDes[i].icon}.png"
            alt="" data-dforecast-img />
          <p class="d-tag" data-dforecast-tag>${daysDes[i].main}</p>
        </div>
        <div class="d-data">
          <p data-dforecast-temp>${daysTemp[i]}°</p>
        </div>
      </li>`;
      forecastList.insertAdjacentHTML("beforeend", forecastItem);
    }
  } catch (error) {
    console.log(error);
  }
}


export async function updateHighlights(lat, lon) {
  const highlights = {
    airCard: {
      airIndex: {
        dom: document.querySelector('.highlights [data-highlights-ai]'),
        infos: {
          1: {info: 'Good', bg: '#89E589'},
          2: {info: 'Fair', bg: '#E5DD89'},
          3: {info: 'Moderate', bg: '#E5C089'},
          4: {info: 'Poor', bg: '#E58989'},
          5: {info: 'Very Poor', bg: '#E589B7'}
        }
      },
      airSpeed: document.querySelector('.highlights [data-highlights-aspeed]')
    },
    sunriseSunsetCard: {
      sunriseT: document.querySelector('.highlights [data-highlights-sunriseT]'),
      sunsetT: document.querySelector('.highlights [data-highlights-sunsetT]')
    },
    feelsLikeCard: {
      feelsLike: document.querySelector('.highlights [data-highlights-feels-like]')
    },
    humidityCard: {
      humidity: document.querySelector('.highlights [data-highlights-humidity]')
    },
    visibilityCard: {
      visibility: document.querySelector('.highlights [data-highlights-visibility]')
    }
  };
  try {
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=770537c6114a67fd86fe81d5c28f8305`;
    const airUrl = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=770537c6114a67fd86fe81d5c28f8305`;
    const currResponse = await fetch(currentUrl);
    const currJSON = await currResponse.json();

    //air card
    const airIndexResponse = await fetch(airUrl);
    const airIndexJSON = await airIndexResponse.json();
    const airData = airIndexJSON.list[0].main.aqi;
    const airI = highlights.airCard.airIndex;

    airI.dom.textContent = airI.infos[airData].info;
    airI.dom.style.backgroundColor = airI.infos[airData].bg;
    highlights.airCard.airSpeed.textContent = (Math.round(currJSON.wind.speed) *3.6) + 'km/h';

    //sunrise - sunset
    const sunrise = new Date(currJSON.sys.sunrise * 1000);
    const sunset = new Date(currJSON.sys.sunset * 1000);

    const sunriseHour = sunrise.getHours() < 10? 
      (sunrise.getHours() !== 0? '0' + sunrise.getHours(): '00')
      :sunrise.getHours();
    const sunriseMin = sunrise.getMinutes() < 10? 
      (sunrise.getMinutes() !== 0? '0' + sunrise.getMinutes(): '00')
      :sunrise.getMinutes();
    
    const sunsetHour = sunset.getHours() < 10? 
      (sunset.getHours() !== 0? '0' + sunset.getHours(): '00')
      :sunset.getHours();
    const sunsetMin = sunset.getMinutes() < 10? 
      (sunset.getMinutes() !== 0? '0' + sunset.getMinutes(): '00')
      :sunset.getMinutes();
    
    const sunriseText = sunriseHour + ':' + sunriseMin + 'h';
    const sunsetText = sunsetHour + ':' + sunsetMin + 'h';
      
    highlights.sunriseSunsetCard.sunriseT.textContent = sunriseText;
    highlights.sunriseSunsetCard.sunsetT.textContent = sunsetText;

    //feels like - humidity - visibbility
    highlights.feelsLikeCard.feelsLike.textContent = Math.round(currJSON.main.feels_like) + '°';
    highlights.humidityCard.humidity.textContent = currJSON.main.humidity + '%';
    highlights.visibilityCard.visibility.textContent = (currJSON.visibility / 1000) + 'km';
  } catch (error) {
    console.log(error);
  }
}

export async function updateHourForecast(lat, lon) {
  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=770537c6114a67fd86fe81d5c28f8305`;
    const hourList = document.querySelector('.hour-list');
    const hourListNodes = [...hourList.children];
    const response = await fetch(url);
    const json = await response.json();

    removeNodes(hourListNodes);

    for (let i=0; i < 8; i++) {
      const forecast = json.list[i];
      const date = new Date(forecast.dt * 1000);
      const text = date.getHours() > 12? (date.getHours() - 12) + ' PM':
        date.getHours() + ' AM' ;
      const img = forecast.weather[0].icon;
      const temp = forecast.main.temp;
      const hourItem = 
        `<li class="hour">
          <div class="info">
            <p>${text}</p>
            <img src="./assets/images/weather_icons/${img}.png" alt="" data-hforecast-img />
            <p data-hforecast-temp>${Math.round(temp)}°</p>
          </div>
        </li>`;
      hourList.insertAdjacentHTML("beforeend", hourItem);
    }
  } catch (error) {
    console.log(error);
  }
}
