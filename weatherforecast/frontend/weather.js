"use strict"

var baseDate = document.querySelector("#base_date");
var nx = document.querySelector("#nx");
var ny = document.querySelector("#ny");

var temp = document.querySelector('temperature-value');

var ta = document.querySelector("#ta");



// SELECT ELEMENTS
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");

// App data
const weather = {};

weather.temperature = {
  unit: "celsius"
}



// GET WEATHER FROM API PROVIDER
function getWeather(latitude, longitude) {
  let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;

  fetch(api)
    .then(function (response) {
      let data = response.json();
      return data;
    })
    .then(function (data) {
      weather.temperature.value = Math.floor(data.main.temp - KELVIN);
      weather.description = data.weather[0].description;
      weather.iconId = data.weather[0].icon;
      weather.city = data.name;
      weather.country = data.sys.country;
    })
    .then(function () {
      displayWeather();
    });
}


// DISPLAY WEATHER TO UI
function displayWeather() {
  iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
  tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
  descElement.innerHTML = weather.description;
  locationElement.innerHTML = `${weather.city}, ${weather.country}`;
}


document.querySelector("#btn1").onclick = () => {
  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = () => {
    // console.log('readyState=', xhr.readyState);
    if (xhr.readyState == 4) {
      var ret = JSON.parse(xhr.responseText);
      console.log(ret);
      // ta.value = JSON.stringify(makeResponse(ret));
      makeResponse(ret);
    } // 응답 완료 시 텍스트 출력
  };

  xhr.open(
    "GET",
    "http://localhost:3000/weather?base_date=" + base_date.value + "&nx=" + nx.value + "&ny=" + ny.value,
    true);
  xhr.send();
  ta.value = xhr.responseText;
};


function makeResponse(ret, callback) {
  let pty, rn1, sky, t1h, reh, uuu, vvv, vec, wsd;
  ret.response.body.items.item.forEach((it) => {
    if (it.category == 'T1H') t1h = it.ncstValue; // 기온
    else if (it.category == 'SKY') sky = it.fcstValue; // 하늘상태
    else if (it.category == 'RN1') rn1 = it.ncstValue; // 1시간 강수량  
    else if (it.category == 'UUU') uuu = it.ncstValue; // 동서바람성분
    else if (it.category == 'VVV') vvv = it.ncstValue; // 남북바람성분
    else if (it.category == 'REH') reh = it.ncstValue; // 습도
    else if (it.category == 'PTY') pty = it.ncstValue; // 강수형태
    else if (it.category == 'VEC') vec = it.ncstValue; // 풍향
    else if (it.category == 'WSD') wsd = it.ncstValue; // 풍속
  });

  // 맑음(1), 구름많음(3), 흐림(4)
  if (sky == 1) {
    sky = '맑음';
  } else if (sky == 3) {
    sky = '구름많음';
  } else if (sky == 4) {
    sky = '흐림';
  }

  //없음(0), 비(1), 비/눈(2), 눈(3), 빗방울(5), 빗방울눈날림(6), 눈날림(7)
  if (pty == 0) {
    pty = '없음';
  } else if (pty == 1) {
    pty = '비';
  } else if (pty == 2) {
    pty = '비/눈';
  } else if (pty == 3) {
    pty = '눈';
  } else if (pty == 5) {
    pty = '빗방울';
  } else if (pty == 6) {
    pty = '빗방울눈날림';
  } else if (pty == 7) {
    pty = '눈날림';
  }


  //약(4미만), 약강(4이상 9미만), 강(9이상 14미만), 매우강(14이상)
  if (wsd < 4) {
    wsd = '바람 약함';
  } else if (4 <= wsd < 9) {
    wsd = '바람 약간 강함';
  } else if (9 <= wsd < 14) {
    wsd = '바람 강함';
  } else if (14 < wsd) {
    wsd = '바람 매우 강함';
  }

  // const temperature = document.innerHTML('')
  // temperature-value.innerHTML('${t1h}');



  // let obj = {
  //   sky: sky,
  //   humidity: reh,
  //   temp: t1h,
  //   wind: wsd,
  //   pty: pty,
  // }
}
