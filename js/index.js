document.addEventListener('DOMContentLoaded', () => {
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
            taskItem.className = 'col-md-12'; // Adjust to full width of the column

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
                    <div class="card-header" onclick="toggleTaskDetails(${index})">
                        <h5 class="card-title">Task Name: ${task.name}</h5>
                    </div>
                    <div class="card-body task-details" id="task-details-${index}" style="display: none;">
                        <p class="card-text">Description: ${task.description}</p>
                        <p class="card-text">Assigned To: ${task.assignedTo}</p>
                        <p class="card-text">Due Date: ${task.dueDate}</p>
                        <p class="card-text">Status: ${task.status}</p>
                        ${task.image ? `<img src="${task.image}" alt="Task Image" class="img-fluid mb-2">` : ''}
                        ${task.status !== 'Completed' ? `
                            <button class="btn btn-custom-edit btn-sm" onclick="editTask(${index})">Edit</button>
                            <button class="btn btn-custom-delete btn-sm" onclick="deleteTask(${index})">Delete</button>
                        ` : ''}
                        ${task.status === 'Completed' ? `
                            <button class="btn btn-custom-delete btn-sm" onclick="deleteTask(${index})">Delete</button>
                        ` : ''}
                        <div class="comment-section mt-3">
                            <h6>Comments</h6>
                            <ul class="list-group" id="commentList-${index}"></ul>
                            <form class="comment-form" id="commentForm-${index}">
                                <div class="form-group">
                                    <textarea class="form-control" rows="3" placeholder="Add comment" id="comment-${index}"></textarea>
                                </div>
                                <button type="submit" class="btn btn-primary btn-sm">Add Comment</button>
                            </form>
                        </div>
                    </div>
                </div>
            `;

            // Prepend to the appropriate container based on status
            if (task.status === 'To Do') {
                toDoList.prepend(taskItem);
            } else if (task.status === 'In Progress') {
                inProgressList.prepend(taskItem);
            } else if (task.status === 'Completed') {
                completedList.prepend(taskItem);
            }
        });
    };

    // Function to toggle task details visibility
    window.toggleTaskDetails = (index) => {
        const details = document.getElementById(`task-details-${index}`);
        if (details.style.display === 'none') {
            details.style.display = 'block';
        } else {
            details.style.display = 'none';
        }
    };

    // Handle form submission to add or update a task
    taskForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const taskName = taskForm.taskName.value;
        const dueDate = taskForm.dueDate.value;
        const status = taskForm.status.value;

        // Validate task name (only allow text)
        if (!/^[a-zA-Z\s]+$/.test(taskName)) {
            alert("Task name should contain only letters and spaces.");
            return;
        }

        // Prevent past due date if the task status is "To Do"
        if (status === 'To Do' && new Date(dueDate) < new Date()) {
            alert("Due date cannot be in the past for 'To Do' tasks.");
            return;
        }

        // Get image file and convert to base64
        const fileInput = document.getElementById('taskImage');
        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onloadend = function () {
            const newTask = {
                name: taskName,
                description: taskForm.taskDescription.value,
                assignedTo: taskForm.assignedTo.value,
                dueDate: dueDate,
                status: status,
                image: reader.result // base64 image string
            };

            if (editIndex !== null) {
                tasks[editIndex] = newTask;
                editIndex = null;
            } else {
                tasks.unshift(newTask); // Add new task to the beginning of the array
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
                name: taskName,
                description: taskForm.taskDescription.value,
                assignedTo: taskForm.assignedTo.value,
                dueDate: dueDate,
                status: status,
                image: ''
            };

            if (editIndex !== null) {
                tasks[editIndex] = newTask;
                editIndex = null;
            } else {
                tasks.unshift(newTask); // Add new task to the beginning of the array
            }

            saveTasksToLocalStorage();
            displayTasks();
            taskForm.reset();
        }
    });

    // Function to delete a task
    window.deleteTask = (index) => {
        const confirmDelete = confirm("Are you sure you want to delete this task permanently?");
        if (confirmDelete) {
            tasks.splice(index, 1);
            saveTasksToLocalStorage();
            displayTasks();
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


// Function to search tasks
const searchTask = () => {
    const searchInput = document.getElementById('searchInput').value.toLowerCase(); // Get search input value
    const searchResults = tasks.filter(task => {
        // Search for tasks whose name, description, or assignedTo field contains the search input
        return task.name.toLowerCase().includes(searchInput) ||
               task.description.toLowerCase().includes(searchInput) ||
               task.assignedTo.toLowerCase().includes(searchInput);
    });

    // Display search results in dropdown menu
    const searchResultsDropdown = document.getElementById('searchResults');
    searchResultsDropdown.innerHTML = ''; // Clear previous search results

    if (searchInput.trim() === '') {
        searchResultsDropdown.innerHTML = '<p>Please enter a search term.</p>';
    } else if (searchResults.length === 0) {
        searchResultsDropdown.innerHTML = '<p>No matching tasks found.</p>';
    } else {
        searchResults.forEach(task => {
            const resultItem = document.createElement('a');
            resultItem.classList.add('dropdown-item');
            resultItem.textContent = task.name; // Display task name (you can customize this)
            resultItem.href = '#'; // Add a link to enable click handling
            resultItem.onclick = () => highlightTask(task); // Highlight the clicked task
            searchResultsDropdown.appendChild(resultItem);
        });
    }
};

// Function to highlight the selected task card
const highlightTask = (task) => {
    // Find the index of the task in the tasks array
    const index = tasks.indexOf(task);
    if (index !== -1) {
        // Scroll to the task card
        const taskCard = document.querySelector(`#task-details-${index}`);
        taskCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Highlight the task card (you can customize the highlighting style)
        taskCard.classList.add('highlight');
        // Remove highlight after a short delay (optional)
        setTimeout(() => {
            taskCard.classList.remove('highlight');
        }, 3000);
    }
};

    // Initial display of tasks
    displayTasks();
    searchTask();
});
