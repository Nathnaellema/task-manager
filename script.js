
// Select elements from the HTML page
const taskInput = document.getElementById('taskinput');
const addBtn = document.getElementById('addbtn');
const taskList = document.getElementById('task-list');

// Function to add a new task with a delete button
function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText !== "") {
        // 1. Create list item
        const newLi = document.createElement('li');
        newLi.textContent = taskText + " ";

        // 2. Create delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '❌';
        
        // 3. Attach delete function to the button
        deleteBtn.addEventListener('click', function() {
            taskList.removeChild(newLi);
        });

        // 4. Put button inside list item, and list item inside the list
        newLi.appendChild(deleteBtn);
        taskList.appendChild(newLi);

        // 5. Clear input field
        taskInput.value = "";
    }
}

// Trigger task creation when the button is clicked
addBtn.addEventListener('click', addTask);