document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm');
    const taskList = document.getElementById('taskList');
    const commentForm = document.getElementById('commentForm');
    const commentList = document.getElementById('commentList');

    // Load tasks and comments from local storage
    loadTasks();
    loadComments();

    taskForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const taskName = document.getElementById('taskName').value;
        const taskDescription = document.getElementById('taskDescription').value;
        const assignedTo = document.getElementById('assignedTo').value;
        const dueDate = document.getElementById('dueDate').value;
        const status = document.getElementById('status').value;
        const taskImage = document.getElementById('taskImage').files[0];

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

        const taskCard = createTaskCard(taskName, taskDescription, assignedTo, dueDate, status, taskImage);
        taskList.appendChild(taskCard);
        saveTask(taskName, taskDescription, assignedTo, dueDate, status, taskImage);

        taskForm.reset();
    });

    commentForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const commentText = document.getElementById('commentText').value;

        const commentCard = createCommentCard(commentText);
        commentList.appendChild(commentCard);
        saveComment(commentText);

        commentForm.reset();
    });

    function createTaskCard(taskName, taskDescription, assignedTo, dueDate, status, taskImage, taskId = Date.now()) {
        const taskCard = document.createElement('div');
        taskCard.classList.add('card', 'task-card', status.toLowerCase().replace(' ', '-'));
        taskCard.style.width = '100%';
        taskCard.dataset.id = taskId;

        const taskCardBody = document.createElement('div');
        taskCardBody.classList.add('card-body');

        const taskTitle = document.createElement('h5');
        taskTitle.classList.add('card-title');
        taskTitle.innerText = taskName;

        const taskText = document.createElement('p');
        taskText.classList.add('card-text');
        taskText.innerText = `${taskDescription}\nAssigned To: ${assignedTo}\nDue Date: ${dueDate}\nStatus: ${status}`;

        const taskActions = document.createElement('div');

        if (status !== 'Completed') {
            const editButton = document.createElement('button');
            editButton.classList.add('btn', 'btn-custom-edit', 'mr-2');
            editButton.innerText = 'Edit';
            editButton.addEventListener('click', () => {
                editTask(taskCard, taskName, taskDescription, assignedTo, dueDate, status, taskId);
            });

            const deleteButton = document.createElement('button');
            deleteButton.classList.add('btn', 'btn-custom-delete');
            deleteButton.innerText = 'Delete';
            deleteButton.addEventListener('click', () => {
                deleteTask(taskCard, taskId);
            });

            taskActions.appendChild(editButton);
            taskActions.appendChild(deleteButton);
        }

        if (taskImage) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.classList.add('card-img-top');
                taskCard.insertBefore(img, taskCardBody);
            };
            reader.readAsDataURL(taskImage);
        }

        taskCardBody.appendChild(taskTitle);
        taskCardBody.appendChild(taskText);
        taskCardBody.appendChild(taskActions);
        taskCard.appendChild(taskCardBody);

        return taskCard;
    }

    function createCommentCard(commentText, commentId = Date.now()) {
        const commentCard = document.createElement('div');
        commentCard.classList.add('card', 'task-card');
        commentCard.style.width = '100%';
        commentCard.dataset.id = commentId;

        const commentCardBody = document.createElement('div');
        commentCardBody.classList.add('card-body');

        const commentContent = document.createElement('p');
        commentContent.classList.add('card-text');
        commentContent.innerText = commentText;

        commentCardBody.appendChild(commentContent);
        commentCard.appendChild(commentCardBody);

        return commentCard;
    }

    function saveTask(taskName, taskDescription, assignedTo, dueDate, status, taskImage, taskId = Date.now()) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const newTask = { taskId, taskName, taskDescription, assignedTo, dueDate, status, taskImage: taskImage ? URL.createObjectURL(taskImage) : null };
        tasks.push(newTask);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function saveComment(commentText, commentId = Date.now()) {
        const comments = JSON.parse(localStorage.getItem('comments')) || [];
        const newComment = { commentId, commentText };
        comments.push(newComment);
        localStorage.setItem('comments', JSON.stringify(comments));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            const taskCard = createTaskCard(task.taskName, task.taskDescription, task.assignedTo, task.dueDate, task.status, null, task.taskId);
            if (task.taskImage) {
                const img = document.createElement('img');
                img.src = task.taskImage;
                img.classList.add('card-img-top');
                taskCard.insertBefore(img, taskCard.querySelector('.card-body'));
            }
            taskList.appendChild(taskCard);
        });
    }

    function loadComments() {
        const comments = JSON.parse(localStorage.getItem('comments')) || [];
        comments.forEach(comment => {
            const commentCard = createCommentCard(comment.commentText, comment.commentId);
            commentList.appendChild(commentCard);
        });
    }

    function editTask(taskCard, taskName, taskDescription, assignedTo, dueDate, status, taskId) {
        document.getElementById('taskName').value = taskName;
        document.getElementById('taskDescription').value = taskDescription;
        document.getElementById('assignedTo').value = assignedTo;
        document.getElementById('dueDate').value = dueDate;
        document.getElementById('status').value = status;

        deleteTask(taskCard, taskId);
    }

    function deleteTask(taskCard, taskId) {
        taskCard.remove();
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const updatedTasks = tasks.filter(task => task.taskId !== taskId);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    }
});
