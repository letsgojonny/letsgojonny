// express 라이브러리 로딩하기
const { json } = require('express');
const express = require('express');

// HTTP 요청을 다루는 라이브러리 로딩하기
const request = require('request');

// POST 요청으로 보낸 payload를 분석하는 라이브러리 로딩하기
// const bodyParser = require('body-parser');

const port = 3000; // 웹서버 포트 번호

// express()를 호출하여 웹서버를 준비한다.
const app = express();

// POST 요청으로 보낸 payload 데이터를 분석할 객체를 지정하기
// => Content-type: application/x-www-form-urlencoded 형식으로 된 payload 처리
//    예) name=hong&age=20


// let options = new Object();
// options.extended = true;
// app.use(express.urlencoded(options));
// 실무에선 아래처럼 사용!!
app.use(express.urlencoded({extended:true}));
 
  // 클라이언트 요청을 다른 서버에게 보낸다.
  // 클라이언트 요청에 대해 호출될 메서드를 등록
app.get(
  '/weather', // 요청 URL
  (req, res) => { // GET 요청이 들어 왔을 때 호출될 메서드 지정
  res.set('Access-Control-Allow-Origin', '*'); // CORS 문제 해결
  // json데이터 --> application/json
  res.set('Content-Type', 'application/json; charset=UTF-8');

  let openApiUrl = "http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?" + 
  "serviceKey=T%2FS1Kb9qCb4Gj98Ra4AQ%2FG2AMB1Xm7d1Wyma5CX6x3sH%2FrHA5wUms7XqO2bgx5WcMCEKZJweioTy1pE%2FsbkiYA%3D%3D" +
  "&pageNo=1" +
  "&numOfRows=1000" +
  "&dataType=JSON" +
  "&base_date=" + req.query.base_date +
  "&base_time=0600" +
  "&nx=" + req.query.nx +
  "&ny=" + req.query.ny;


  request.get({
    uri: openApiUrl
  }, (error, reponse, body) => {
    res.send(body);
  });
});



// 웹서버 실행하기
app.listen(
  3000, // 포트 번호 지정
  () => {
    console.log(`${port}번 포트에서 서버 시작했음!"`);
  } // 서버가 시작되었을 때 호출될 함수 = 리스너 = 이벤트 핸들러
);



