console.log("Javascript is running");
// Select form elements
const newTaskForm = document.getElementById('taskForm');
const newTaskNameInput = document.getElementById('newTaskNameInput');
const newTaskDescriptionInput = document.getElementById('newTaskDescriptionInput');
const newTaskAssignedToInput = document.getElementById('newTaskAssignedToInput');
const newTaskDueDateInput = document.getElementById('newTaskDueDateInput');
const newTaskStatusInput = document.getElementById('newTaskStatusInput');
const errorMessage = document.getElementById('errorMessage');
const taskList = document.getElementById('taskList');

// Form validation function
function validFormFieldInput() {
    if (!newTaskNameInput.value || !newTaskDescriptionInput.value || 
        !newTaskAssignedToInput.value || !newTaskDueDateInput.value || 
        !newTaskStatusInput.value) {
        return false;
    }
    return true;
}

// Add task function
function addTask(name, description, assignedTo, dueDate, status) {
    const taskHtml = `
        <div class="list-group-item">
            <h5>${name}</h5>
            <p>${description}</p>
            <p>Assigned To: ${assignedTo}</p>
            <p>Due Date: ${dueDate}</p>
            <p>Status: ${status}</p>
        </div>
    `;
    taskList.insertAdjacentHTML('beforeend', taskHtml);
}

// Handle form submission
newTaskForm.addEventListener('submit', (event) => {
    event.preventDefault();
    
    if (validFormFieldInput()) {
        addTask(
            newTaskNameInput.value,
            newTaskDescriptionInput.value,
            newTaskAssignedToInput.value,
            newTaskDueDateInput.value,
            newTaskStatusInput.value
        );
        // Clear the form
        newTaskForm.reset();
        errorMessage.style.display = 'none';
    } else {
        errorMessage.innerHTML = 'Please fill in all fields.';
        errorMessage.style.display = 'block';
    }
});


$('.navbar-toggler').on('click', function() {
    $('.navbar').toggleClass('collapsed');
  });