let tasks = [];
let id = 0;

window.onload = function(){load(); taskRendering();};

function save(){
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('id', id);
}

function add(){
    let input = document.getElementById('taskInput');
    let category = document.getElementById('categorySelect').value;
    let priority = document.getElementById('prioritySelect').value;
    let text = input.value.trim();
    if (text === '') return;
    let task = {id: id++, text: text, category: category, priority: priority, completed: false};
    tasks.push(task);
    save(); taskRendering();
    input.value = '';
}

function load(){
    let savedTasks = localStorage.getItem('tasks');
    let savedId = localStorage.getItem('id');
    if (savedTasks){
        tasks = JSON.parse(savedTasks);
    }
    if (savedId){
        id = parseInt(savedId);
    }
}

function taskRendering(){
    let taskList = document.getElementById('taskList');
    let categoryFilter = document.getElementById('categoryFilter').value;
    let statusFilter = document.getElementById('statusFilter').value;
    
    let filteredTasks = tasks.filter(task => {
        let categoryMatch = categoryFilter === 'All' || task.category === categoryFilter;
        let statusMatch = statusFilter === 'All' || 
                         (statusFilter === 'Completed' && task.completed) ||
                         (statusFilter === 'Pending' && !task.completed);
        return categoryMatch && statusMatch;
    });
    
    // Sort by priority: High > Medium > Low
    filteredTasks.sort((a, b) => {
        const priorityOrder = {High: 3, Medium: 2, Low: 1};
        return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
    
    taskList.innerHTML = '';
    filteredTasks.forEach(task => {
        let li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''} priority-${task.priority.toLowerCase()}`;
        li.innerHTML = `
            <div class="task-content">
                <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleComplete(${task.id})">
                <span class="task-text">${task.text}</span>
                <span class="task-meta">${task.category} | ${task.priority}</span>
            </div>
            <div class="task-buttons">
                <button class="edit-btn" onclick="edit(${task.id})">Edit</button>
                <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
            </div>`;
        taskList.appendChild(li);
    });
}

function toggleComplete(id) {
    let task = tasks.find(t => t.id === id);
    task.completed = !task.completed;
    save(); taskRendering();
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    save(); taskRendering();
}

function edit(id) {
    let task = tasks.find(t => t.id === id);
    let newText = prompt("Edit task:", task.text);
    if (newText && newText.trim() !== ''){
        task.text = newText.trim();
        save(); taskRendering();
    }
}

function filterTasks() {
    taskRendering();
}