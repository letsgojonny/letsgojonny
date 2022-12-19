"use strict"

var baseDate = document.querySelector("#base_date");
var nx = document.querySelector("#nx");
var ny = document.querySelector("#ny");

var tempvalue = document.querySelector('tempvalue');

var ta = document.querySelector("#ta");



// const tempElement = document.querySelector(".temperature-value p");
// const descElement = document.querySelector(".temperature-description p");

// App data
const weather = {};

weather.temperature = {
  unit: "celsius"
}

// DISPLAY WEATHER TO UI
// function displayWeather() {
//   tempvalue.innerHTML = `${t1h}°<span>C</span>`;
// }


document.querySelector("#btn1").onclick = () => {
  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = () => {
    console.log('readyState=', xhr.readyState);
    if (xhr.readyState == 4) {
      var respdata = JSON.parse(xhr.responseText);
      console.log(respdata);
      
      // ta.value = JSON.stringify(makeResponse(respdata));
      makeResponse(respdata);
    } // 응답 완료 시 텍스트 출력
  };
  xhr.open(
    "GET",
    "http://localhost:3000/weather?base_date=" + base_date.value + "&nx=" + nx.value + "&ny=" + ny.value,
    true);
  xhr.send();
  // ta.value = xhr.responseText;
};


function makeResponse(respdata, callback) {
  var pty, rn1, sky, t1h, reh, uuu, vvv, vec, wsd;
  respdata.response.body.items.item.forEach((obs) => {
    if (obs.category == 'T1H') t1h = obs.obsrValue; // 기온
    else if (obs.category == 'SKY') sky = obs.obsrValue; // 하늘상태
    else if (obs.category == 'RN1') rn1 = obs.obsrValue; // 1시간 강수량  
    else if (obs.category == 'UUU') uuu = obs.obsrValue; // 동서바람성분
    else if (obs.category == 'VVV') vvv = obs.obsrValue; // 남북바람성분
    else if (obs.category == 'REH') reh = obs.obsrValue; // 습도
    else if (obs.category == 'PTY') pty = obs.obsrValue; // 강수형태
    else if (obs.category == 'VEC') vec = obs.obsrValue; // 풍향
    else if (obs.category == 'WSD') wsd = obs.obsrValue; // 풍속
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

  // const tempvalue = document.querySelector('tempvalue');
  // tempvalue.classList.add('tempvalue');


  // const temperature = document.innerHTML('')
  // temperature-value.innerHTML('${t1h}');

  tempvalue.innerHTML = `<small>${t1h}</small>`;

  return makeResponse();
}


