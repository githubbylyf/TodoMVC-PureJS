let totalTodo = document.getElementById('todoall');
let todoStore = [];
let state;
//储存
function store() {
    localStorage.setItem('todoStore',JSON.stringify(todoStore));
    localStorage.setItem('state',state);
}
//删除空格
function deleteblank(value){
    value = value.replace(/\s{2,}/g,' ');
    value = value.replace(/(^\s)|(\s$)/g,'');
    return value;
}

//创建todo列表项
function creatDiv(value){
    let newInput = document.createElement('input');
    newInput.type = 'checkbox';
    newInput.className = 'check';

    let newLabel = document.createElement('label');
    newLabel.setAttribute('class','content');
    newLabel.setAttribute('data-time',Date.now());
    newLabel.textContent = value;

    let newButton = document.createElement('button'),
        newImg = document.createElement('img');
    newImg.setAttribute('src','icon/delete.svg');
    newButton.appendChild(newImg);

    let newDiv = document.createElement('div');
    newDiv.appendChild(newInput);
    newDiv.appendChild(newLabel);
    newDiv.appendChild(newButton);
    
    totalTodo.appendChild(newDiv);
}

//列表内容存在时显示筛选功能
function appearHide(){
    if(todoStore.length != 0){
        chooseAll.parentNode.removeAttribute('class');
        for(var i=0; i<footList.length; ++i) {
            footList[i].removeAttribute('class');
        }
        filter.removeAttribute('class');
    }else{
        chooseAll.parentNode.setAttribute('class','hidden');
        for(var i=0; i<footList.length; ++i) {
            footList[i].setAttribute('class','hidden');
        }
        filter.setAttribute('class','hidden');
    }
}

//刷新列表项/Dom节点
let labelList = document.getElementsByClassName('content');

function refresh(){
    while (totalTodo.firstChild){
        totalTodo.removeChild(totalTodo.firstChild);
    }

    if(localStorage.getItem('todoStore')){
        todoStore = JSON.parse(localStorage.getItem('todoStore'));
        state = localStorage.getItem('state');
        for(var i=0; i<todoStore.length; ++i) {
            creatDiv(todoStore[i].content);
            labelList[i].dataset.time = todoStore[i].time;
            if(todoStore[i].completed){
                labelList[i].previousSibling.checked = true;
            }
        }
    }
    appearHide();
}

//输入todo
const todoContent = document.getElementById('todo');
todoContent.addEventListener('keyup', todoList);

function todoList(e) {
    if(e.code === 'Enter' && deleteblank(e.target.value)) {
        var  todoItem = {
            content: deleteblank(e.target.value),
            completed: false,
            time: Date.now()
        }

        const count = todoStore.push(todoItem);
        
        creatDiv(deleteblank(e.target.value));

        e.target.value = '';

        appearHide();

        if(todoStore.some(x=>x.completed==false)){
            chooseAll.setAttribute('src','icon/allunchoose.svg');
        }else{
            chooseAll.setAttribute('src','icon/allchoose.svg');
        }

        store();
        todoCount();
        refreshPage();
    }
}

//修改todo
totalTodo.addEventListener('dblclick',modify);

function modify(ee){
    ee.target.setAttribute('contenteditable','true');
    ee.target.focus();

    let valueOld = ee.target.textContent;

    function blur(){
        if(deleteblank(ee.target.textContent)){
            ee.target.textContent = deleteblank(ee.target.textContent);
        } else {
            return ee.target.textContent=valueOld;
        }

        let index = todoStore.findIndex(x => 
            (ee.target.dataset.time - x.time)>=0
            && (ee.target.dataset.time - x.time)<=1);

        todoStore[index].content = ee.target.textContent;

        ee.target.removeAttribute('contenteditable');
        store();
    }
    
    ee.target.onblur = blur;
    
    ee.target.onkeydown = function(evt){
        if(evt.code ==='Enter'){
            ee.target.blur();
        }
    }
}

//点击复选框同步localstorage
function clickCheck(cc) {
    let index = todoStore.findIndex(x => 
        (cc.target.nextSibling.dataset.time - x.time)>=0
        && (cc.target.nextSibling.dataset.time - x.time)<=1);

    todoStore[index].completed = !todoStore[index].completed;
}

//删除列表项
function deleteTodo(dt){
    let index = todoStore.findIndex(x => 
        (dt.target.parentNode.previousSibling.dataset.time - x.time)>=0
        && (dt.target.parentNode.previousSibling.dataset.time - x.time)<=1);

    todoStore.splice(index, 1);
}

//列表项的点击事件，选择和删除
totalTodo.addEventListener('click',select);
function select(ce) {
    switch(ce.target.nodeName){
        case 'INPUT':
            clickCheck(ce);
            store();
            if(todoStore.some(x=>x.completed==false)){
                chooseAll.setAttribute('src','icon/allunchoose.svg');
            }else{
                chooseAll.setAttribute('src','icon/allchoose.svg');
            }
            if(todoStore.some(x=>x.completed == true)){
                footList[5].setAttribute('data-hide','visible');
            }else{
                footList[5].setAttribute('data-hide','unvisible');
            }
            todoCount();
            refreshPage();
            break;
        case 'IMG':
            deleteTodo(ce);
            store();
            todoCount();
            refreshPage();
            break;
        default:
            break;
        
    }
}

//全选
let chooseAll = document.getElementById('select');
chooseAll.addEventListener('click',allChoose);
function allChoose(){
    if(todoStore.some(x=>x.completed==false)){
        for(let i=0; i<todoStore.length; ++i){
            if(!todoStore[i].completed){
                todoStore[i].completed = !todoStore[i].completed;
            }
            chooseAll.setAttribute('src','icon/allchoose.svg');
        }
    }else{
        for(let i=0; i<todoStore.length; ++i){
            todoStore[i].completed = !todoStore[i].completed;
        }
        chooseAll.setAttribute('src','icon/allunchoose.svg');
    }
    if(todoStore.some(x=>x.completed == true)){
        footList[5].setAttribute('data-hide','visible');
    }else{
        footList[5].setAttribute('data-hide','unvisible');
    }
    store();
    refreshPage();
}

//筛选
var inputCollection = document.getElementsByClassName('check'),
    filter = document.getElementById('foot'),
    footList = filter.getElementsByTagName('div');

filter.addEventListener('click',filtrate);
//显示未完成项
function clickActive(){
    for(let i=0; i<todoStore.length; ++i){
        if(todoStore[i].completed){
            inputCollection[i].parentNode.setAttribute('class','hidden')
        }
    }
    footList[2].setAttribute('data-bord','noclick');
    footList[3].setAttribute('data-bord','click');
    footList[4].setAttribute('data-bord','noclick');
}
//显示已完成项
function clickCompleted(){
    for(let i=0; i<todoStore.length; ++i){
        if(!todoStore[i].completed){
            inputCollection[i].parentNode.setAttribute('class','hidden')
        }
    }
    footList[2].setAttribute('data-bord','noclick');
    footList[3].setAttribute('data-bord','noclick');
    footList[4].setAttribute('data-bord','click');
}
//底部的点击事件
function filtrate(fe){
    switch(fe.target.textContent){
        case 'All':
            refresh();
            state = 0;
            footList[2].setAttribute('data-bord','click');
            footList[3].setAttribute('data-bord','noclick');
            footList[4].setAttribute('data-bord','noclick');
            store();
            break;
        case 'Active':
            refresh();
            clickActive();
            state = 1;
            store();
            break;
        case 'Completed':
            refresh();
            clickCompleted();
            state = 2;
            store();
            break;
        case 'Clear completed':
            var arr = [];
            for(let i=0; i<todoStore.length; ++i){
                if(!todoStore[i].completed){
                    arr.push(todoStore[i]);
                }
            }
            todoStore = arr;
            store();
            refreshPage();
            break;
        default:
            break;
    }
}

//计算未完成项
function todoCount(){
    for(var i=0, n=0, m=0; i<todoStore.length; ++i){
        if(todoStore[i].completed){
            m = ++n;
        }
    }
    var result = todoStore.length - m;
    if(result == 1){
        countTodo = `${result} item left`;
    }else{
        countTodo = `${result} items left`;
    }
    footList[0].textContent = countTodo;
}

//刷新页面
function refreshPage(){
    refresh();
    todoCount();
    switch(state){
        case '0':
            footList[2].setAttribute('data-bord','click');
            footList[3].setAttribute('data-bord','noclick');
            footList[4].setAttribute('data-bord','noclick');
            break;
        case '1':
            clickActive();
            break;
        case '2':
            clickCompleted();
            break;
    }
    if(todoStore.some(x=>x.completed==false)){
        chooseAll.setAttribute('src','icon/allunchoose.svg');
    }else{
        chooseAll.setAttribute('src','icon/allchoose.svg');
    }
    if(todoStore.some(x=>x.completed == true)){
        footList[5].setAttribute('data-hide','visible');
    }else{
        footList[5].setAttribute('data-hide','unvisible');
    }
}
refreshPage();