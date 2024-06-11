document.addEventListener('DOMContentLoaded', function () {
    const taskForm = document.getElementById('taskForm');
    const toDoList = document.getElementById('toDoList');
    const inProgressList = document.getElementById('inProgressList');
    const completedList = document.getElementById('completedList');
    let editIndex = null; // To keep track of the task being edited

    // Load tasks from local storage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Function to save tasks to local storage
    const saveTasksToLocalStorage = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    // Function to display tasks
    const displayTasks = () => {
        toDoList.innerHTML = '';
        inProgressList.innerHTML = '';
        completedList.innerHTML = '';

        tasks.forEach((task, index) => {
            const taskItem = document.createElement('div');
            taskItem.className = 'col-md-4';

            let statusClass = '';
            switch (task.status) {
                case 'To Do':
                    statusClass = 'to-do';
                    break;
                case 'In Progress':
                    statusClass = 'in-progress';
                    break;
                case 'Completed':
                    statusClass = 'completed';
                    break;
            }

            taskItem.innerHTML = `
                <div class="card task-card ${statusClass}">
                    <div class="card-body">
                        <h5 class="card-title">Task Name: ${task.name}</h5>
                        <p class="card-text">Description: ${task.description}</p>
                        <p class="card-text">Assigned To: ${task.assignedTo}</p>
                        <p class="card-text">Due Date: ${task.dueDate}</p>
                        <p class="card-text">Status: ${task.status}</p>
                        ${task.image ? `<img src="${task.image}" alt="Task Image" class="img-fluid mb-2">` : ''}
                        ${task.status !== 'Completed' ? `
                            <button class="btn btn-custom-edit btn-sm" onclick="editTask(${index})">Edit</button>
                            <button class="btn btn-custom-delete btn-sm" onclick="deleteTask(${index})">Delete</button>
                        ` : ''}
                    </div>
                </div>
            `;

            // Append to the appropriate container based on status
            if (task.status === 'To Do') {
                toDoList.appendChild(taskItem);
            } else if (task.status === 'In Progress') {
                inProgressList.appendChild(taskItem);
            } else if (task.status === 'Completed') {
                completedList.appendChild(taskItem);
            }
        });
    };

    // Handle form submission to add or update a task
    taskForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // Get image file and convert to base64
        const fileInput = document.getElementById('taskImage');
        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onloadend = function () {
            const newTask = {
                name: taskForm.taskName.value,
                description: taskForm.taskDescription.value,
                assignedTo: taskForm.assignedTo.value,
                dueDate: taskForm.dueDate.value,
                status: taskForm.status.value,
                image: reader.result // base64 image string
            };

            if (editIndex !== null) {
                tasks[editIndex] = newTask;
                editIndex = null;
            } else {
                tasks.push(newTask);
            }

            saveTasksToLocalStorage();
            displayTasks();
            taskForm.reset();
        };

        if (file) {
            reader.readAsDataURL(file);
        } else {
            // Handle case where no image is uploaded
            const newTask = {
                name: taskForm.taskName.value,
                description: taskForm.taskDescription.value,
                assignedTo: taskForm.assignedTo.value,
                dueDate: taskForm.dueDate.value,
                status: taskForm.status.value,
                image: ''
            };

            if (editIndex !== null) {
                tasks[editIndex] = newTask;
                editIndex = null;
            } else {
                tasks.push(newTask);
            }

            saveTasksToLocalStorage();
            displayTasks();
            taskForm.reset();
        }
    });

    // Function to delete a task
    window.deleteTask = (index) => {
        if (tasks[index].status !== 'Completed') {
            tasks.splice(index, 1);
            saveTasksToLocalStorage();
            displayTasks();
        } else {
            alert("Cannot delete a completed task.");
        }
    };

    // Function to edit a task
    window.editTask = (index) => {
        const task = tasks[index];
        if (task.status !== 'Completed') {
            taskForm.taskName.value = task.name;
            taskForm.taskDescription.value = task.description;
            taskForm.assignedTo.value = task.assignedTo;
            taskForm.dueDate.value = task.dueDate;
            taskForm.status.value = task.status;
            editIndex = index;
        } else {
            alert("Cannot edit a completed task.");
        }
    };

    // Initial display of tasks
    displayTasks();
});
