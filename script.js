let tasks = [];
let id = 0;

window.onload = function(){load(); taskRendering();};

function save(){
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('id', id);
};

function add(){
    let input = document.getElementById('taskInput');
    let text = input.value.trim();
    if (text === '') return;
    let task = {id: id++, text: text};
    tasks.push(task);
    save(); taskRendering();
    input.value = '';
};

function load(){
    let savedTasks = localStorage.getItem('tasks');
    let savedId = localStorage.getItem('id');
    if (savedTasks){
        tasks = JSON.parse(savedTasks);
    }
    if (savedId){
        id = parseInt(savedId);
    }
};

function taskRendering(){
    let taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    tasks.forEach(task => {
        let li = document.createElement('li');
        li.className = 'task-item';
        li.innerHTML = `
            <span>${task.text}</span>
            <div class="task-buttons">
                <button class="edit-btn" onclick="edit(${task.id})">Edit</button>
                <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
            </div>`;
        taskList.appendChild(li);
    });
};
function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    save(); taskRendering();
};
function edit(id) {
    let newText = prompt("Edit task:");
    if (newText.trim() !== ''){
        let task = tasks.find(t => t.id === id);
        task.text = newText.trim();
        save(); taskRendering();
    }
};