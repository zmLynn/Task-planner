document.addEventListener('DOMContentLoaded', function () {
    const taskForm = document.getElementById('taskForm');
    const taskList = document.getElementById('taskList');
    let editIndex = null; // To keep track of the task being edited

    // Example tasks JSON data
let tasks = [
    {
        name: "Sample Task 1",
        description: "This is a description of sample task 1.",
        assignedTo: "John Doe",
        dueDate: "2024-06-01",
        status: "To Do",
        image: ""
    },
    {
        name: "Sample Task 2",
        description: "This is a description of sample task 2.",
        assignedTo: "Jane Smith",
        dueDate: "2024-06-02",
        status: "In Progress",
        image: ""
    },
    {
        name: "Sample Task 3",
        description: "This is a description of sample task 3.",
        assignedTo: "Bob Johnson",
        dueDate: "2024-06-03",
        status: "Completed",
        image: ""
    },
    {
        name: "Sample Task 4",
        description: "This is a description of sample task 4.",
        assignedTo: "Alice Brown",
        dueDate: "2024-06-04",
        status: "To Do",
        image: ""
    },
    {
        name: "Sample Task 5",
        description: "This is a description of sample task 5.",
        assignedTo: "Charlie Davis",
        dueDate: "2024-06-05",
        status: "In Progress",
        image: ""
    }
];

// Function to display tasks
const displayTasks = () => {
    taskList.innerHTML = '';
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
                    <button class="btn btn-custom-edit btn-sm" onclick="editTask(${index})">Edit</button>
                    ${task.status !== 'Completed' ? `<button class="btn btn-custom-delete btn-sm" onclick="deleteTask(${index})">Delete</button>` : ''}
                </div>
            </div>
        `;
        taskList.appendChild(taskItem);
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

        displayTasks();
        taskForm.reset();
    }
});

// Function to delete a task
window.deleteTask = (index) => {
    if (tasks[index].status !== 'Completed') {
        tasks.splice(index, 1);
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
