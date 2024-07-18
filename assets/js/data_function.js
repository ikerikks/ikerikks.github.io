// GET AVERAGES VALUES
function averageTemp(list) {
  let sum = 0;
  let len = list.length;
  for (let num in list) {
    sum += list[num];
  }
  return Math.round(sum/len);
}

function averageDescription(list) {
  let totalCount = 0;
  let result = 0;
  
  list.forEach((ele, index) =>  {
    let currCount = 0;
    for (let i=index; i < list.length; i++) {
      if (ele.id == list[i].id) {
        currCount ++;
      }
    }
    if (currCount > totalCount) {
      totalCount = currCount;
      result = ele;
    }
    let checkIcon = result.icon.split('');
    if (checkIcon.includes('n')) {
      const index = checkIcon.indexOf('n');
      checkIcon[index] = 'd';
      result.icon = checkIcon.join('');
    }
  })
  return result;
}


// GET DATA
export function getDayTemperature(jsonData) {
  let list = jsonData.list;
  let forecastDays = [];
  let temperatures = [];
  let currDay = new Date(list[0].dt *1000).getDate();
  
  list.forEach((forecast) => {
    let date = new Date(forecast.dt *1000);
    if(currDay != date.getDate()) {
      forecastDays.push(averageTemp(temperatures));
      temperatures = [];
    }
    temperatures.push(forecast.main.temp);
    currDay = date.getDate();
  });
  return forecastDays;
}

export function getDescription(jsonData) {
  let list = jsonData.list;
  let forecastDays = [];
  let description = [];
  let currDay = new Date(list[0].dt *1000).getDate();

  list.forEach((forecast) => {
    const dayNames = [
      'Sunday', 'Monday', 'Tuesday', 'Wednesday', 
      'Thursday', 'Friday', 'Saturday'
    ];
    let date = new Date(forecast.dt *1000);

    if(currDay != date.getDate()) {
      forecastDays.push(averageDescription(description));
      description = [];
    }
    forecast.weather[0].dt = { 
      num: date.getDay(), 
      day: dayNames[date.getDay()] 
    };
    description.push(forecast.weather[0]);
    currDay = date.getDate();
  })
  return forecastDays;
}

export function getCookie(key) {
  let cookie = document.cookie.split(';')
    .map((ele) => (ele.trim().split('='))
  );
  for (let tab in cookie) {
    if (cookie[tab].includes(key)) {
      return cookie[tab][1];
    }
  }
  return null;
}