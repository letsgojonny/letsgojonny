const todoInputElem = document.querySelector('.todo-input');
const todoListElem = document.querySelector('.todo-list');
const completeAllBtnElem = document.querySelector('.complete-all-btn');
const leftItemsElem = document.querySelector('.left-items')
// All 버튼
const showAllBtnElem = document.querySelector('.show-all-btn');
// Active 버튼
const showActiveBtnElem = document.querySelector('.show-active-btn');
// Completed 버튼
const showCompletedBtnElem = document.querySelector('.show-completed-btn');
// Clear Completed 버튼
const clearCompletedBtnElem = document.querySelector('.clear-completed-btn');


let id = 0;
const setId = (newId) => {id = newId};
// 전체 todos 체크 여부
let isAllCompleted = false; 
const setIsAllCompleted = (bool) => { isAllCompleted = bool};
// all  | active | complete
let currentShowType = 'all'; 
const setCurrentShowType = (newShowType) => currentShowType = newShowType

let todos = [];
const setTodos = (newTodos) => {
    todos = newTodos;
}

const getAllTodos = () => {
    return todos;
}
const getCompletedTodos = () => {
    return todos.filter(todo => todo.isCompleted === true );
}
// 현재 완료되지 않은 할일 리스트를 반환
const getActiveTodos = () => {
    return todos.filter(todo => todo.isCompleted === false);
}

const setLeftItems = () => {
    const leftTodos = getActiveTodos()
    leftItemsElem.innerHTML = `${leftTodos.length} items left`
}

const completeAll = () => {
    completeAllBtnElem.classList.add('checked');
    const newTodos = getAllTodos().map(todo => ({...todo, isCompleted: true }) )
    setTodos(newTodos)
}

const incompleteAll = () => {
    completeAllBtnElem.classList.remove('checked');
    const newTodos =  getAllTodos().map(todo => ({...todo, isCompleted: false }) );
    setTodos(newTodos)
}

// 전체 todos의 IsCompleted 여부를 체크하여
// 현재 todos 배열의 길이와 완료된 todos 배열의 길이를 비교
const checkIsAllCompleted = () => {
    if(getAllTodos().length === getCompletedTodos().length ){
        setIsAllCompleted(true);
        completeAllBtnElem.classList.add('checked');
    }else {
        setIsAllCompleted(false);
        completeAllBtnElem.classList.remove('checked');
    }
}

const onClickCompleteAll = () => {
    // todos배열의 길이가 0이면 return;
    if(!getAllTodos().length) return; 
    // isAllCompleted가 true이면 todos를 전체 미완료 처리 
    if(isAllCompleted) incompleteAll(); 
    // isAllCompleted가 false이면 todos를 전체 완료 처리 
    else completeAll(); 
    // isAllCompleted 토글
    setIsAllCompleted(!isAllCompleted); 
    // 새로운 todos를 렌더링
    paintTodos(); 
    // 남은 할일 개수 표시
    setLeftItems()
}

// 할 일 추가하기
const appendTodos = (text) => {
    const newId = id + 1; // 기존에 i++ 로 작성했던 부분을 setId()를 통해 id값을 갱신하였다.
    setId(newId)
    const newTodos = getAllTodos().concat({id: newId, isCompleted: false, content: text })
    setTodos(newTodos)
    // 남은 할 일 개수 표시
    setLeftItems()
    // 전체 완료 처리 확인
    checkIsAllCompleted();
    paintTodos();
}

const deleteTodo = (todoId) => {
    const newTodos = getAllTodos().filter(todo => todo.id !== todoId );
    setTodos(newTodos);
    setLeftItems()
    paintTodos()
}

const completeTodo = (todoId) => {
    const newTodos = getAllTodos().map(todo => todo.id === todoId ? {...todo,  isCompleted: !todo.isCompleted} : todo )
    setTodos(newTodos);
    paintTodos();
    setLeftItems()
    // 전체 todos의 완료 상태를 파악하여
    // 전체 완료 처리 버튼 CSS 반영
    checkIsAllCompleted();
}

const updateTodo = (text, todoId) => {
    const currentTodos = getAllTodos();
    const newTodos = currentTodos.map(todo => todo.id === todoId ? ({...todo, content: text}) : todo);
    setTodos(newTodos);
    paintTodos();
}

const onDbclickTodo = (e, todoId) => {
    const todoElem = e.target;
    const inputText = e.target.innerText;
    const todoItemElem = todoElem.parentNode;
    const inputElem = document.createElement('input');
    inputElem.value = inputText;
    inputElem.classList.add('edit-input');
    inputElem.addEventListener('keypress', (e)=>{
        if(e.key === 'Enter') {
            // todo 수정
            updateTodo(e.target.value, todoId);
            // 이벤트 리스너 제거
            document.body.removeEventListener('click', onClickBody );
        }
    })
    // todoItemElem 요소를 제외한 영역 클릭 시, 수정모드 종료
    const onClickBody = (e) => {
        if(e.target !== inputElem)  {
            todoItemElem.removeChild(inputElem);
            document.body.removeEventListener('click', onClickBody );
        }
    }
    
    document.body.addEventListener('click', onClickBody)
    // todoItemElem 요소에 자식 요소로 'inputElem' 요소 추가
    todoItemElem.appendChild(inputElem);
}

const clearCompletedTodos = () => {
    const newTodos = getActiveTodos()
    setTodos(newTodos)
    paintTodos();
}

// 할 일이 추가될 때마다
// HTML에 추가된 할 일 그리기
const paintTodo = (todo) => {
    const todoItemElem = document.createElement('li');
    todoItemElem.classList.add('todo-item');

    todoItemElem.setAttribute('data-id', todo.id );

    const checkboxElem = document.createElement('div');
    checkboxElem.classList.add('checkbox');
    checkboxElem.addEventListener('click', () => completeTodo(todo.id))

    const todoElem = document.createElement('div');
    todoElem.classList.add('todo');
    // 더블 클릭에 대한 이벤트 리스너(todo 수정)
    todoElem.addEventListener('dblclick', (event) => onDbclickTodo(event, todo.id))
    todoElem.innerText = todo.content;

    const delBtnElem = document.createElement('button');
    delBtnElem.classList.add('delBtn');
    // 'click' 이벤트 발생 시, 해당 할일 삭제
    delBtnElem.addEventListener('click', () =>  deleteTodo(todo.id))
    delBtnElem.innerHTML = 'X';

    if(todo.isCompleted) {
        todoItemElem.classList.add('checked');
        checkboxElem.innerText = '✔';
    }

    todoItemElem.appendChild(checkboxElem);
    todoItemElem.appendChild(todoElem);
    todoItemElem.appendChild(delBtnElem);

    todoListElem.appendChild(todoItemElem);
}

const paintTodos = () => {
    todoListElem.innerHTML = null;  // todoListElem 요소 안의 HTML 초기화

    switch (currentShowType) {
        case 'all':
            const allTodos = getAllTodos(); // todos 배열 가져오기
            // "todo-item"에 해당하는 HTML을 그려서 "todo-list"에 추가하기
            allTodos.forEach(todo => { paintTodo(todo);});
            break;
        case 'active': 
            const activeTodos = getActiveTodos();
            activeTodos.forEach(todo => { paintTodo(todo);});
            break;
        case 'completed': 
            const completedTodos = getCompletedTodos();
            completedTodos.forEach(todo => { paintTodo(todo);});
            break;
        default:
            break;
    }
}

const onClickShowTodosType = (e) => {
    const currentBtnElem = e.target;
    const newShowType = currentBtnElem.dataset.type;

    if ( currentShowType === newShowType ) return;

    const preBtnElem = document.querySelector(`.show-${currentShowType}-btn`);
    preBtnElem.classList.remove('selected');

    currentBtnElem.classList.add('selected')
    setCurrentShowType(newShowType)
    paintTodos();
}

// 입력에 대한 이벤트 리스너 등록
const init = () => {
    todoInputElem.addEventListener('keypress', (e) =>{
        if( e.key === 'Enter' ){
            appendTodos(e.target.value); todoInputElem.value ='';
        }
    })
    // 전체 완료 처리 버튼에 대한 이벤트 리스너
    completeAllBtnElem.addEventListener('click', onClickCompleteAll);
    showAllBtnElem.addEventListener('click', onClickShowTodosType);
    showActiveBtnElem.addEventListener('click',onClickShowTodosType);
    showCompletedBtnElem.addEventListener('click',onClickShowTodosType);
    clearCompletedBtnElem.addEventListener('click', clearCompletedTodos);
    setLeftItems()
}

init()