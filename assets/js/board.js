let currentDraggedtask;
let currentDisplayedTask = [];

/**
 * the function is executed when the board page is loaded
 */
async function initBoard() {
  includeHTML();
  setupSearchEventListener();
  await Promise.all([loadUsers(), loadTasksFromServer(), refreshFromBackend()]);
}

/**
 * the function loads the tasks from the backend
 */
function loadTasksFromServer() {
  const currentUser = loadUserData();
  if (currentUser.tasks.length > 0) {
    loadTasksColumns(currentUser.tasks);
  }
}

/**
 * the function loads and organizes the tasks in the columns
 * * @param {tasks} - take the tasks from the backend
 */
function loadTasksColumns(tasks) {
  let todo = tasks.filter((t) => t["columns"] === "todo");
  document.getElementById("todoColumn").innerHTML = "";

  for (let index = 0; index < todo.length; index++) {
    const task = todo[index];
    document.getElementById("todoColumn").innerHTML +=
      generateColumnsHTML(task);
  }

  let progress = tasks.filter((t) => t["columns"] == "progress");
  document.getElementById("InProgressColumn").innerHTML = "";

  for (let index = 0; index < progress.length; index++) {
    const task = progress[index];
    document.getElementById("InProgressColumn").innerHTML +=
      generateColumnsHTML(task);
  }

  let feedback = tasks.filter((t) => t["columns"] == "feedback");
  document.getElementById("feedbackColumn").innerHTML = "";

  for (let index = 0; index < feedback.length; index++) {
    const task = feedback[index];
    document.getElementById("feedbackColumn").innerHTML +=
      generateColumnsHTML(task);
  }

  let done = tasks.filter((t) => t["columns"] == "done");
  document.getElementById("DoneColumn").innerHTML = "";

  for (let index = 0; index < done.length; index++) {
    const task = done[index];
    document.getElementById("DoneColumn").innerHTML +=
      generateColumnsHTML(task);
  }
}

/**
 * the function allows to drag the tasks
 */
function startDragging(id) {
  currentDraggedtask = id;
}

/**
 * the function handles change in checkbox
 * * @param {taskData} - take the tasks from the backend
 * * @param {event} - take the event
 */
async function handleCheckboxChange(event, taskData) {
  if (event.target && event.target.type === "checkbox") {
    const subtaskId = event.target.getAttribute("data-task-id");

    if (subtaskId) {
      const subtask = findSubtaskById(taskData, subtaskId);

      if (subtask) {
        updateSubtaskCompletion(subtask, event.target.checked);
        updateProgressBar(taskData);
        updateUserTasks(taskData);
        refreshFromBackend();
        loadTasksFromServer();
      }
    }
  }
}

/**
 * the function finds a subtask by its ID
 *
 * * @param {taskData} - take the tasks from the backend
 * * @param {subtaskId} - take the subtask ID
 */
function findSubtaskById(taskData, subtaskId) {
  return taskData.subTask.find((sub) => sub.id === subtaskId);
}

/**
 * the function updates the completion status of a subtask
 *
 * * @param {taskData} - take the tasks from the backend
 * * @param {isChecked} - take the status of the checkbox
 */
function updateSubtaskCompletion(subtask, isChecked) {
  subtask.completed = isChecked;
}

/**
 * the function updates the progress bar
 * * @param {taskData} - take the tasks from the backend
 */
function updateProgressBar(taskData) {
  const completedSubtasks = taskData.subTask.filter(
    (sub) => sub.completed
  ).length;
  const subtaskCount = taskData.subTask.length;
  const progressPercentage = (completedSubtasks / subtaskCount) * 100;

  const progressBarStyle = `
    --progress: ${progressPercentage}%;
    background: linear-gradient(to right, #0038FF 0%, #0038FF calc(${progressPercentage}% - 4px), #F4F4F4 calc(${progressPercentage}% - 4px), #F4F4F4 100%);
  `;
  const progressText = `${completedSubtasks}/${subtaskCount} Done`;
  const progressBar = document.querySelector(".minitask_sub_bar");
  progressBar.style.width = progressBarStyle;
  progressBar.nextSibling.textContent = progressText;
}

// Función para actualizar las tareas del usuario
/**
 * the function updates the user tasks
 * * @param {taskData} - take the tasks from the backend
 */
function updateUserTasks(taskData) {
  const currentUser = loadUserData();
  const taskIndex = currentUser.tasks.findIndex((t) => t.id === taskData.id);

  if (taskIndex !== -1) {
    currentUser.tasks[taskIndex] = taskData;
    saveUserData(currentUser);
    backend.setItem("currentUser", currentUser);
  }
}

/**
 * the function handles the change event
 * * @param {taskData} - take the tasks from the backend
 */
function handleChangeEvent(taskData) {
  document.addEventListener("change", async function (event) {
    await handleCheckboxChange(event, taskData);
  });
}

/**
 * the function checks the subtask
 * * @param {taskData} - take the tasks from the backend
 */
async function checkSubtask(taskData) {
  handleChangeEvent(taskData);
}

/**
 * The function opens the pop-up view task
 * @param {element} - take the element
 */
function openTask(element) {
  const viewTaskSection = document.getElementById("ViewTaskContainer");
  viewTaskSection.style = "display: flex !important";
  const taskData = JSON.parse(element.getAttribute("data-task"));
  currentDisplayedTask = taskData;
  let html = "";
  html += viewTask(taskData);
  checkSubtask(taskData);
  viewTaskSection.innerHTML = html;
  return html;
}

/**
 * the function generates the initials of the contacts
 * * @param {contact} - take the contacts from the backend
 * * @param {index} - take the index of the contact
 */
function generateContactHTML(contact, index) {
  return `
    <div class="minitask_contact column-center-center" style="background:${
      contact.color
    }; left:${index * 20}px;">
      <a class="minitask_contact_text row-center-center font400">${getInitials(
        contact.name || contact.email
      )}</a>
    </div>
  `;
}

/**
 * the function generates the progress bar
 * * @param {completedSubtasks} - take the completed subtasks
 *  * @param {subtaskCount} - take the subtask count
 */
function generateProgressBarHTML(completedSubtasks, subtaskCount) {
  const progressPercentage = (completedSubtasks / subtaskCount) * 100;
  const progressBarStyle = `
    --progress: ${progressPercentage}%;
    background: linear-gradient(to right, #0038FF 0%, #0038FF calc(${progressPercentage}% - 4px), #F4F4F4 calc(${progressPercentage}% - 4px), #F4F4F4 100%);
  `;
  const progressText = `${completedSubtasks}/${subtaskCount} Done`;

  return `
    <div class="minitask_sub_bar" style="width: ${progressBarStyle};"></div>
    <a class="minitask_sub_text font400">${progressText}</a>
  `;
}

/**
 * the function generates the initials of the contacts for the view task
 * * @param {taskData} - take the tasks from the backend
 */
function viewInitials(taskData) {
  const viewTaskInitials = taskData.contacts
    .map(
      (contact, index) => `
    <div class="view_task_contacts_container">
      <div class="view_task_contact_circle center-center" style="background:${
        contact.color
      }">
        <a class="view_task_contact_initials font400 row-center-center">${getInitials(
          contact.name || contact.email
        )}</a>
      </div>
      <a class="view_task_contact_name font400">${
        contact.name || contact.email
      }</a>
    </div>
`
    )
    .join("");
  return viewTaskInitials;
}

/**
 * the function generates the subtasks for the view task
 * * @param {taskData} - take the tasks from the backend
 */
function viewSubTask(taskData) {
  const viewTaskSubTask = taskData.subTask
    ? taskData.subTask
        .map(
          (subtask, index) => `
            <div class="viewTask_sub_cont">
            <input type="checkbox" data-task-id="${
              subtask.id
            }" id="taskCheckbox-${subtask.id}" ${
            subtask.completed ? "checked" : ""
          }>
              <label for="taskCheckbox-${
                subtask.id
              }" class="view_task_subTasks_name font400"> ${
            subtask.title
          }</label>
            </div>
          `
        )
        .join("")
    : "";
  return viewTaskSubTask;
}

/**
 * the function opens the pop-up edit task
 * * @param {element} - take the element
 */
function editTask(element) {
  closeViewTask();
  const editTaskSection = document.getElementById("ViewTaskContainer");
  editTaskSection.style = "display: flex !important";
  const taskData = JSON.parse(element.getAttribute("data-task"));
  let html = "";
  html += editTaskContainer(taskData);
  editTaskSection.innerHTML = html;
  getContacts();
  getCheckContacts(taskData);
  loadSubTasks();
  const buttonEdit = taskData.prio;
  if (buttonEdit) {
    selectedButtons(buttonEdit);
  }
  return html;
}

/**
 * the function checks the contacts for the edit task
 * * @param {taskData} - take the tasks from the backend
 */
function getCheckContacts(taskData) {
  const contactsTask = taskData.contacts;

  for (let i = 0; i < contactsTask.length; i++) {
    const contact = contactsTask[i];
    const checkbox = document.getElementById(`checkContact${i}`);

    if (contact.check === true) {
      checkbox.checked = true;
    }
  }
}

/**
 * the function deletes the task
 * * @param {clickedElement} - take the clicked element
 */
function deleteTask(clickedElement) {
  const taskData = JSON.parse(clickedElement.getAttribute("data-task"));
  if (taskData) {
    const currentUser = loadUserData();
    const taskIndex = currentUser.tasks.findIndex((t) => t.id === taskData.id);

    if (taskIndex !== -1) {
      currentUser.tasks.splice(taskIndex, 1);
      saveUserData(currentUser);

      const userIndex = users.findIndex((user) => user.id === currentUser.id);
      if (userIndex !== -1) {
        users[userIndex] = currentUser;
        backend.setItem("users", JSON.stringify(users));
      }
      closeViewTask();
    }
    loadTasksFromServer();
  }
}

/**
 * the function closes the pop-up edit task
 */
function closePopUpEdit() {
  closeViewTask();
}

/**
 * the function saves the task by editing it
 */
function okEditTask() {
  updateTaskData();
  const currentUser = loadUserData();
  updateTaskInCurrentUser(currentUser);
  updateUserDataAndClosePopUp(currentUser);
  loadTasksFromServer();
}

/**
 * the function recibes de new info of the task
 */
function updateTaskData() {
  const editTitle = document.getElementById("editTitleTask").value;
  const editDescription = document.getElementById("editTaskDescription").value;
  const editDueDate = document.getElementById("editCalendarTask");
  const editPrio = selectedButtonId;
  const editContactsTask = getCheckedContacts();
  const editSubTask = selectedSubTasks;

  if (currentDisplayedTask) {
    currentDisplayedTask.title = editTitle;
    currentDisplayedTask.description = editDescription;
    currentDisplayedTask.dueDate = editDueDate.value;
    currentDisplayedTask.prio = editPrio;
    currentDisplayedTask.contacts = editContactsTask;
    currentDisplayedTask.subTask = editSubTask;
  }
}

/**
 * the function updates the task in the current user
 * * @param {currentUser} - take the current user
 */
function updateTaskInCurrentUser(currentUser) {
  const taskIndex = currentUser.tasks.findIndex(
    (t) => t.id === currentDisplayedTask.id
  );

  if (taskIndex !== -1) {
    currentUser.tasks[taskIndex] = currentDisplayedTask;
  }
}

/**
 * the function updates the user data and closes the pop-up
 * * @param {currentUser} - take the current user
 */
function updateUserDataAndClosePopUp(currentUser) {
  saveUserData(currentUser);

  const userIndex = users.findIndex((user) => user.id === currentUser.id);
  if (userIndex !== -1) {
    users[userIndex] = currentUser;
    backend.setItem("currentUser", currentUser);
  }

  closePopUpEdit();
}

/**
 * the function allows to drag the tasks
 * * @param {ev} - take the event
 */
function allowDrop(ev) {
  ev.preventDefault();
}

/**
 * the function moves the task to the columns
 * * @param {column} - take the column
 */
async function moveTo(column) {
  const currentUser = loadUserData();
  const taskIndex = currentUser.tasks.findIndex(
    (task) => task.id === currentDraggedtask
  );

  if (taskIndex !== -1) {
    currentUser.tasks[taskIndex].columns = column;
    await backend.setItem("currentUser", currentUser);
    loadTasksColumns(currentUser.tasks);
    await refreshFromBackend();
  }
}

/**
 * the function refreshes the data from the backend
 */
async function refreshFromBackend() {
  const updatedUserData = await backend.getItem("currentUser");
  if (updatedUserData) {
    const currentUser = loadUserData();
    currentUser.tasks = updatedUserData.tasks;
    saveUserData(currentUser);
    loadTasksColumns(currentUser.tasks);
  }
}

/**
 * the function chooses the img for priority
 * * @param {prio} - takes the priority of the task
 */
function prioInBoardImg(prio) {
  let imagePath = "";

  if (prio === "addTaskPrioUrgent") {
    imagePath = "assets/img/PrioAlta.svg";
  } else if (prio === "addTaskPrioMedium") {
    imagePath = "assets/img/PrioMedia.svg";
  } else if (prio === "addTaskPrioLow") {
    imagePath = "assets/img/PrioBaja.svg";
  }

  return imagePath;
}

/**
 * the function receives the priority
 * * @param {prio} - takes the priority of the task
 */
function prioInBoard(prio) {
  let namePrio = "";

  if (prio === "addTaskPrioUrgent") {
    namePrio = "Urgent";
  } else if (prio === "addTaskPrioMedium") {
    namePrio = "Medium";
  } else if (prio === "addTaskPrioLow") {
    namePrio = "Medium";
  }

  return namePrio;
}

/**
 * the function allows to look for a task
 */
function setupSearchEventListener() {
  const findTaskInput = document.getElementById("findTaskInput");

  findTaskInput.addEventListener("input", function () {
    const searchTerm = this.value.trim().toLowerCase();
    const filteredTasks = filterTasksBySearchTerm(searchTerm);
    loadTasksColumns(filteredTasks);
  });
}

/**
 * the function filter the tasks by searching
 * * @param {searchTerm} - takes the searching of the user
 */
function filterTasksBySearchTerm(searchTerm) {
  const currentUser = loadUserData();
  return currentUser.tasks.filter((task) =>
    task.title.toLowerCase().includes(searchTerm)
  );
}

/**
 * open the pop-up create Task
 */
function createTaskPU() {
  if (window.matchMedia("(max-width: 600px)").matches) {
    window.location.href = "addTask.html";
  } else {
    document.getElementById("createTaskPopUp").innerHTML = "";
    document
      .getElementById("createTaskPopUpSlide")
      .classList.remove("slide_right");
    document.getElementById("addTaskPopUpContainer").style = "display: flex";
    document
      .getElementById("addTaskPopUpContainer")
      .classList.add("background_white_transp");
    setTimeout(() => {
      document
        .getElementById("createTaskPopUpSlide")
        .classList.add("slide_left");
      loadAddTaskPU();
      loadCategoriesFromServer();
      getContacts();
      loadSubTasks();
    }, 100);
  }
}

/**
 * the function loads the add task pop-up
 */
function loadAddTaskPU() {
  const addTaskSection = document.getElementById("createTaskPopUp");
  let html = "";
  html += addTaskContainer();
  addTaskSection.innerHTML += html;
  return html;
}

/**
 * the function closes the view task
 */
function closeViewTask() {
  const viewTaskSection = document.getElementById("ViewTaskContainer");
  viewTaskSection.style = "display: none !important";
}

/**
 * Create a new Task Pop-Up
 */
async function createATaskPU() {
  createATask();
  closePopUpCreate();
}

/**
 * close the pop-up create Task
 */
function closePopUpCreate() {
  document.getElementById("createTaskPopUpSlide").classList.add("slide_right");
  document
    .getElementById("createTaskPopUpSlide")
    .classList.remove("slide_left");
  setTimeout(() => {
    document
      .getElementById("addTaskPopUpContainer")
      .classList.remove("background_white_transp");
    document.getElementById("addTaskPopUpContainer").style = "display: none";
  }, 100);
  loadTasksFromServer();
}

/**
 * pop-up header log out
 */
function userLogOut() {
  if (popUpLogout) {
    document.getElementById("popUpLogOut").classList.add("d-none");
    popUpLogout = false;
  } else {
    document.getElementById("popUpLogOut").classList.remove("d-none");
    popUpLogout = true;
  }
}
