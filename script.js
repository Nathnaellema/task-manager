// --- STATE MANAGEMENT ---
// 1. Load existing tasks from localStorage on startup, or initialize an empty array
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

// --- DOM ELEMENTS ---
const taskInput = document.getElementById('taskInput');
const dueDateInput = document.getElementById('dueDateInput');
const dueTimeInput = document.getElementById('dueTimeInput');
const priorityInput = document.getElementById('priorityInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const progressText = document.getElementById('progressText');
const progressBar = document.getElementById('progressBar');
const filterBtns = document.querySelectorAll('.filter-btn');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');

// --- HELPER FUNCTIONS ---
// Save current tasks array to localStorage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Render tasks and update progress bar
function renderTasks() {
  taskList.innerHTML = '';

  // Filter tasks based on selected tab
  const filteredTasks = tasks.filter(task => {
    if (currentFilter === 'active') return !task.completed;
    if (currentFilter === 'completed') return task.completed;
    return true;
  });

  // Render empty state or list items
  if (filteredTasks.length === 0) {
    taskList.innerHTML = `
      <div class="empty-state">
        <span class="empty-icon">🎉</span>
        <p>No tasks found! You're all caught up.</p>
      </div>
    `;
  } else {
    filteredTasks.forEach(task => {
      const li = document.createElement('li');
      li.className = `task-item ${task.completed ? 'completed' : ''}`;
      
      const formattedDate = task.dueDate ? ` 📅 ${task.dueDate}` : '';
      const formattedTime = task.dueTime ? ` ⏰ ${task.dueTime}` : '';

      li.innerHTML = `
        <div class="task-info">
          <input type="checkbox" ${task.completed ? 'checked' : ''} data-id="${task.id}" class="toggle-btn">
          <span class="task-text">${task.text}</span>
          <span class="priority-badge ${task.priority.toLowerCase()}">${task.priority}</span>
          <span class="task-date">${formattedDate}${formattedTime}</span>
        </div>
        <button class="delete-btn" data-id="${task.id}">Delete</button>
      `;
      taskList.appendChild(li);
    });
  }

  updateProgress();
}

// Update progress bar and completed count
function updateProgress() {
  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const percentage = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  if (progressText) {
    progressText.textContent = `${completedCount} of ${totalCount} completed (${percentage}%)`;
  }
  if (progressBar) {
    progressBar.style.width = `${percentage}%`;
  }
}

// --- ACTION HANDLERS ---
// Add new task
function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;

  const newTask = {
    id: Date.now(),
    text: text,
    dueDate: dueDateInput ? dueDateInput.value : '',
    dueTime: dueTimeInput ? dueTimeInput.value : '',
    priority: priorityInput ? priorityInput.value : 'Medium',
    completed: false
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();

  // Reset form inputs
  taskInput.value = '';
  if (dueDateInput) dueDateInput.value = '';
  if (dueTimeInput) dueTimeInput.value = '';
}

// Toggle task completion status
function toggleTask(id) {
  tasks = tasks.map(task => {
    if (task.id === id) {
      return { ...task, completed: !task.completed };
    }
    return task;
  });
  saveTasks();
  renderTasks();
}

// Delete single task
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

// Clear all completed tasks
function clearCompleted() {
  tasks = tasks.filter(task => !task.completed);
  saveTasks();
  renderTasks();
}

// --- EVENT LISTENERS ---
if (addTaskBtn) {
  addTaskBtn.addEventListener('click', addTask);
}

if (taskInput) {
  taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
  });
}

if (taskList) {
  taskList.addEventListener('click', (e) => {
    const id = Number(e.target.dataset.id);
    if (!id) return;

    if (e.target.classList.contains('toggle-btn')) {
      toggleTask(id);
    } else if (e.target.classList.contains('delete-btn')) {
      deleteTask(id);
    }
  });
}

filterBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    filterBtns.forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    currentFilter = e.target.dataset.filter || e.target.textContent.toLowerCase();
    renderTasks();
  });
});

if (clearCompletedBtn) {
  clearCompletedBtn.addEventListener('click', clearCompleted);
}

// --- INITIAL LOAD ---
renderTasks();