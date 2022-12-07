
const App = {
  init() {
    Board.newMake();
  },
}

const Board = {
  nowTurn: 'player_1',

  // 1. 새 게임 만들기
  // display: flex와 flex-wrap:wrap 속성을 사용하여
  // 부모 넓이에 맞는 9개의 div를 += 더하기 할당 연산자를 이용하여 생성
  // HTML의 <div class="panel_list"></div>에 box를 삽입

  newMake() {

    let box = '';

    for (let i = 0; i < 9; i++) {
      box += `<div class='panel_item' onclick="Board.itemClick(this)"></div>`;
    }
    document.querySelector('.panel_list').innerHTML = box;

  },


  // 2. box 클릭 시 현재 턴인 유저에 따른 표시
  // 각각의 box에 onclick 이벤트를 걸어주고,
  // if 문으로 이미 선택된 경우 선택되지 않게 예외처리
  // player에 따른 O X 지정
  // box 클릭 시 현재 턴인 player의 O X 를 삽입
  
  itemClick(box) {
    if (box.className != "panel_item") {
      return;
    }

    const shape = { player_1: 'O', player_2: 'X' };

    box.innerHTML = `<div>${shape[Board.nowTurn]}</div>`;
    box.className += ` ${Board.nowTurn}`;

    Board.clearChk();
  },

  // 3. 게임판의 가로, 세로, 대각선 빙고 여부 확인
  // step 1. 9개의 box를 모두 불러온다
  // step 2. 빙고 조건 : 가로x3, 세로x3, 대각선x2 
  // 8개의 결과를 담을 box배열을 생성
  // step 3. 
  
  clearChk() {
    const boxstatus = document.querySelectorAll(`.panel_item`);

    const boxArray = new Array(8).fill(true);
        
    // 가로, 세로 체크
    for (let i = 0; i < 3; i++) {
      const keyArr = [
        i, 3 + i, 6 + i, // 세로 Index
        i * 3, i * 3 + 1, i * 3 + 2 // 가로 Index
      ];

      for (let j = 0; j < 6; j++) {
        boxArray[j] = boxArray[j] && Board.itemChk(boxstatus[keyArr[j]]);
      }
    }
    // || :  둘 중 하나 true 이면 true
    // && : 동시에 true 이면 true

    // 대각선 체크
    boxArray[6] = Board.itemChk(boxstatus[0]) && Board.itemChk(boxstatus[4]) && Board.itemChk(boxstatus[8]);
    boxArray[7] = Board.itemChk(boxstatus[2]) && Board.itemChk(boxstatus[4]) && Board.itemChk(boxstatus[6]);


    // .some : 조건을 만족하는 값이 발견되면 
    //         즉시 처리 중단
    const resultBox = boxArray.some(v => v);

    // 결과 체크
    // .every : 조건을 만족하지 않는 값이 발견되면
    //          그 즉시 처리 중단

    if (resultBox || [...boxstatus].every(v => Board.itemChk(v, 'player'))) {
      const $modal = document.querySelector(`.modal`);
      
      $modal.className += ' open';

      // resultbox의 값을 boolean 타입으로
      // true 라면 '승리' 메시지 
      // false 라면 '무승부' 메시지 출력
      $modal.innerHTML = `<h2>${resultBox ? `${Board.nowTurn}님이 이겼습니다.` : '무승부'}</h2>`;

      setTimeout(() => {
        $modal.className = 'modal';
        Board.newMake();
      }, 2000);
      return;
    }

    Board.turnChange();
  },

  // 클래스로 체크 여부 판단함
  itemChk: (box, name) => box.className.includes(name || Board.nowTurn),

  // 턴 체인지
  turnChange() {
    Board.nowTurn = { player_1: 'player_2' }[Board.nowTurn] || 'player_1';
  },
}

window.onload = () => {
  App.init();
}