let currentDraggedtask;

async function initBoard() {
  includeHTML();
  setupSearchEventListener();
  await Promise.all([loadUsers(), loadTasksFromServer()]);
}

//loadCategoriesFromServer(),
//getContacts(),
//loadSubTasks()

function loadTasksFromServer() {
  const currentUser = loadUserData();
  if (currentUser.tasks.length > 0) {
    loadTasksColumns(currentUser.tasks);
  }
}

function loadTasksColumns(tasks) {
  let todo = tasks.filter((t) => t["columns"] === "todo");
  document.getElementById("todoColumn").innerHTML = "";

  for (let index = 0; index < todo.length; index++) {
    const task = todo[index];
    document.getElementById("todoColumn").innerHTML += generateTodoHTML(task);
  }

  let progress = tasks.filter((t) => t["columns"] == "progress");
  document.getElementById("InProgressColumn").innerHTML = "";

  for (let index = 0; index < progress.length; index++) {
    const task = progress[index];
    document.getElementById("InProgressColumn").innerHTML +=
      generateTodoHTML(task);
  }

  let feedback = tasks.filter((t) => t["columns"] == "feedback");
  document.getElementById("feedbackColumn").innerHTML = "";

  for (let index = 0; index < feedback.length; index++) {
    const task = feedback[index];
    document.getElementById("feedbackColumn").innerHTML +=
      generateTodoHTML(task);
  }

  let done = tasks.filter((t) => t["columns"] == "done");
  document.getElementById("DoneColumn").innerHTML = "";

  for (let index = 0; index < done.length; index++) {
    const task = done[index];
    document.getElementById("DoneColumn").innerHTML += generateTodoHTML(task);
  }
}

function startDragging(id) {
  currentDraggedtask = id;
}

function generateTodoHTML(task) {
  const contactHtml = task.contacts
    .map(
      (contact, index) => `
    <div class="minitask_contact column-center-center" style="background:${
      contact.color
    }; left:${index * 20}px;">
        <a class="minitask_contact_text row-center-center font400">${getInitials(
          contact.name
        )}</a>
    </div>
  `
    )
    .join("");

  const subtaskCount = task.subTask.length; // Total number of subtasks
  const completedSubtasks = task.subTask.filter(
    (subtask) => subtask.completed
  ).length;

  const progressPercentage = (completedSubtasks / subtaskCount) * 100;
  const progressBarStyle = `
    --progress: ${progressPercentage}%;
    background: linear-gradient(to right, #0038FF 0%, #0038FF calc(${progressPercentage}% - 4px), #F4F4F4 calc(${progressPercentage}% - 4px), #F4F4F4 100%);
  `;
  const progressText = `${completedSubtasks}/${subtaskCount} Done`;

  const priorityImagePath = prioInBoard(task.prio);

  return `
    <div class="minitask_container column-center-center" draggable="true" ondragstart="startDragging('${task.id}')">
        <div class="minitask column-flex-start">
            <div class="minitask_title_cont column-flex-start" style="background:${task.category.color}">
                <a class="minitask_title font400">${task["category"]["name"]}</a>
            </div>
            <div class="minitask_description_cont column-flex-start">
                <a class="minitask_descr_title font400">${task["title"]}</a>
                <a class="minitask_descr_text font400">${task["description"]}</a>
            </div>
            <div class="minitask_subtask row-center-center">
                <div class="minitask_sub_bar" style="width: ${progressBarStyle}%;"></div>
                <a class="minitask_sub_text font400">${progressText}</a>
            </div>
            <div class="minitask_buttom_cont row-center-center">
                <div class="minitask_contacts_cont row-center">${contactHtml}</div>
                <div class="minitask_prio_cont row-center-center">
                    <img src="${priorityImagePath}" class="minitask_prio" id="boardPrioIcon">
                </div>
            </div>
        </div>
    </div>`;
}

function allowDrop(ev) {
  ev.preventDefault();
}

async function moveTo(column) {
  const currentUser = loadUserData();
  const taskIndex = currentUser.tasks.findIndex(
    (task) => task.id === currentDraggedtask
  );

  if (taskIndex !== -1) {
    currentUser.tasks[taskIndex].columns = column;

    try {
      await backend.setItem("currentUser", currentUser);
      await refreshFromBackend(); // Retrieve updated data from the backend
    } catch (error) {
      console.error("Error updating backend:", error);
    }
  }
}

async function refreshFromBackend() {
  try {
    const updatedUserData = await backend.getItem("currentUser");
    if (updatedUserData) {
      localStorage.setItem("currentUser", JSON.stringify(updatedUserData));
      loadTasksColumns(updatedUserData.tasks);
    }
  } catch (error) {
    console.error("Error fetching updated data:", error);
  }
}

function prioInBoard(prio) {
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

function setupSearchEventListener() {
  const findTaskInput = document.getElementById("findTaskInput");

  findTaskInput.addEventListener("input", function () {
    const searchTerm = this.value.trim().toLowerCase();
    const filteredTasks = filterTasksBySearchTerm(searchTerm);
    loadTasksColumns(filteredTasks);
  });
}

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
  document.getElementById("createTaskPopUp").classList.remove("slide_right");
  document.getElementById("createTaskPopUp").classList.add("slide_left");
  document
    .getElementById("addTaskPopUpContainer")
    .classList.add("background_white_transp");
}

/**
 * close the pop-up create Task
 */
function closePopUpCreate() {
  document.getElementById("createTaskPopUp").classList.add("slide_right");
  document.getElementById("createTaskPopUp").classList.remove("slide_left");
  document
    .getElementById("addTaskPopUpContainer")
    .classList.remove("background_white_transp");
  clearTask();
  resetColors;
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
