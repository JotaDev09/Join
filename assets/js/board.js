let currentDraggedtask;

async function initBoard() {
  includeHTML();
  setupSearchEventListener();
  await Promise.all([loadUsers(), loadTasksFromServer()]);
  await refreshFromBackend();
}
// getContactsPU(),
//loadCategoriesFromServer(),
//loadSubTasks()

function loadTasksFromServer() {
  const currentUser = loadUserData();
  if (currentUser.tasks.length > 0) {
    loadTasksColumns(currentUser.tasks);
    console.log(currentUser);
  }
}

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

function startDragging(id) {
  currentDraggedtask = id;
}

function generateColumnsHTML(task) {
  const contactHtml = task.contacts
    .map(
      (contact, index) => `
    <div class="minitask_contact column-center-center" style="background:${
      contact.color
    }; left:${index * 20}px;">
        <a class="minitask_contact_text row-center-center font400">${getInitials(
          contact.name || contact.email
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

  const priorityImagePath = prioInBoardImg(task.prio);

  return `
  <div class="minitask_container column-center-center" draggable="true" ondragstart="startDragging('${
    task.id
  }')" onclick="openTask(this)" data-task='${JSON.stringify(task)}'>
        <div class="minitask column-flex-start">
            <div class="minitask_title_cont column-flex-start" style="background:${
              task.category.color
            }">
                <a class="minitask_title font400">${
                  task["category"]["name"]
                }</a>
            </div>
            <div class="minitask_description_cont column-flex-start">
                <a class="minitask_descr_title font400">${task["title"]}</a>
                <a class="minitask_descr_text font400">${
                  task["description"]
                }</a>
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

function openTask(element) {
  const viewTaskSection = document.getElementById("ViewTaskContainer");
  viewTaskSection.style = "display: flex !important";
  const taskData = JSON.parse(element.getAttribute("data-task"));
  let html = "";
  html += viewTask(taskData);
  viewTaskSection.innerHTML = html;
  getCheckSubtasks(taskData);
  return html;
}
// Agrega un evento de escucha a los checkboxes

// Función para actualizar la información en el backend
async function updateBackendData(userData) {
  try {
    await backend.setItem("currentUser", userData);
    console.log("Datos actualizados en el backend");
  } catch (error) {
    console.error("Error al actualizar datos en el backend:", error);
  }
}

// Llama a la función para inicializar el checkbox

function viewTask(taskData) {
  const priorityImagePath = prioInBoardImg(taskData.prio);
  const namePrio = prioInBoard(taskData.prio);

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

  const viewTaskSubTask = taskData.subTask
    ? taskData.subTask
        .map(
          (subtask, index) => `
            <div class="viewTask_sub_cont">
            <input type="checkbox" data-task-id="${subtask.id}" id="subTask${index}";>
              <a class="view_task_subTasks_name font400"> ${subtask.title}</a>
            </div>
          `
        )
        .join("")
    : "";

  return `
  <div class="view_task_task column-flex-start">
  <img class="view_task_popUp_close" src="assets/img/closePopCreate.svg" onclick="closeViewTask()">
  <div class="view_task_category center-center" style="background:${
    taskData.category.color
  }">
      <a class="view_task_category_text font400" >${taskData.category.name}</a>
  </div>
  <div class="view_task_category_title column-flex-start">
      <a class="view_task_category_a font400">${taskData.title}</a>
  </div>
  <a class="view_task_description font400">${taskData.description}</a>
  <div class="view_task_due_date row-flexstart">
      <a class="view_task_subtitle font400">Due date:</a>
      <a class="view_task_date font400">${taskData.dueDate}</a>
  </div>
  <div class="view_task_priority row-center">
      <a class="view_task_subtitle font400">Priority:</a>
      <div class="view_task_prio_cont row-center-center">
          <a class="view_task_prio font400">${namePrio}</a>
          <img src="${priorityImagePath}" class="view_task_prio_img">
      </div>
  </div>
  <div class="view_task_contacts_cont column-flex-start">
  <a class="view_task_subtitle font400">Assigned To:</a>
      <div class="view_task_contact column-flex-start">${viewTaskInitials}
      </div>
  </div>
  <div class="view_task_subTasks_cont column-flex-start">
    <a class="view_task_subtitle font400">Subtasks</a>
    <div class="view_task_subTasks column-center-center">${viewTaskSubTask}</div>
  </div>
  <div class="view_task_edit center-center">
  <div class="view_task_editTask center-center" data-task='${JSON.stringify(
    taskData
  )}' onclick="deleteTask(this)">
      <img src="assets/img/delete.svg" class="view_task">
      <a class="delete_task font400">Delete</a>
    </div>
    <img src="assets/img/Vector 3.svg" class="view_task_edit_line">
    <div class="view_task_editTask center-center" data-task='${JSON.stringify(
      taskData
    )}' onclick="editTask(this)">
      <img src="assets/img/edit.svg" class="view_task">
      <a class="delete_task font400">Edit</a>
    </div>
  </div>
</div>
`;
}

function editTask(element) {
  closeViewTask();
  const editTaskSection = document.getElementById("ViewTaskContainer");
  editTaskSection.style = "display: flex !important";
  const taskData = JSON.parse(element.getAttribute("data-task"));
  let html = "";
  html += editTaskContainer(taskData);
  editTaskSection.innerHTML = html;
  loadCategoriesFromServer();
  getContacts();
  getCheckContacts(taskData);
  loadSubTasks();
  getCheckSubtasks(taskData);
  const buttonEdit = taskData.prio;
  if (buttonEdit) {
    selectedButtons(buttonEdit);
  }

  return html;
}

function getCheckContacts(taskData) {
  const contactsTask = taskData.contacts;

  // Itera a través de los contactos
  for (let i = 0; i < contactsTask.length; i++) {
    const contact = contactsTask[i];
    const checkbox = document.getElementById(`checkContact${i}`);

    // Verifica si el contacto tiene check: true y marca el checkbox si es el caso
    if (contact.check === true) {
      checkbox.checked = true;
    }
  }
}

function getCheckSubtasks(taskData) {
  const taskSubTasks = taskData.subTask;

  for (let i = 0; i < taskSubTasks.length; i++) {
    const subTask = taskSubTasks[i];
    const checkbox = document.getElementById(`subTask${i}`);
    //const checkbox = document.getElementById(`addTaskSubTask${i}`);

    if (subTask.check === true) {
      checkbox.checked = true;
    }
  }
}

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

function closePopUpEdit() {
  closeViewTask();
}

function checkSubtask() {
  document.addEventListener("change", async (event) => {
    console.log("Checkbox clicked");
    const checkbox = event.target;
    // Verifica si el elemento clickeado es un checkbox
    if (checkbox.type === "checkbox") {
      // Obtiene el ID de la tarea desde algún atributo (por ejemplo, data-task-id)
      const taskId = checkbox.getAttribute("data-task-id");
      console.log(taskId);

      // Obtiene el usuario actual y las tareas
      const currentUser = loadUserData();
      const tasks = currentUser.tasks || [];
      console.log(tasks);

      // Encuentra la tarea correspondiente por su ID
      const task = tasks.find((t) => t.id === taskId);
      console.log(task);

      // Verifica que se haya encontrado la tarea y que tenga subtasks
      if (task && task.subTask) {
        // Encuentra la subtask correspondiente en la tarea por su título
        const subtask = task.subTask.find(
          (sub) => sub.title === checkbox.nextSibling.textContent.trim()
        );
        console.log(subtask);

        // Verifica que se haya encontrado la subtask
        if (subtask) {
          // Cambia el valor de completed en la subtask
          subtask.completed = checkbox.checked;
          console.log(subtask.completed);

          // Actualiza el estado local
          console.log(subtask);
          console.log(currentUser);
          saveUserData(currentUser);

          // Actualiza la información en el backend
          await updateBackendData(currentUser);
        }
      }
    }
  });
}

function allowDrop(ev) {
  ev.preventDefault();
}

async function moveTo(column) {
  try {
    const currentUser = loadUserData();
    const taskIndex = currentUser.tasks.findIndex(
      (task) => task.id === currentDraggedtask
    );

    if (taskIndex !== -1) {
      // Actualiza la columna de la tarea local
      currentUser.tasks[taskIndex].columns = column;
      // Guarda la tarea actualizada en el backend
      await backend.setItem(currentDraggedtask, currentUser.tasks[taskIndex]);
      // Actualiza la UI con la nueva columna
      loadTasksColumns(currentUser.tasks);
    }
  } catch (error) {
    console.error("Error moving task:", error);
  }
}

async function moveTo(column) {
  try {
    const currentUser = loadUserData();
    const taskIndex = currentUser.tasks.findIndex(
      (task) => task.id === currentDraggedtask
    );

    if (taskIndex !== -1) {
      // Actualiza la columna de la tarea local
      currentUser.tasks[taskIndex].columns = column;

      // Actualiza todas las tareas en el backend
      await backend.setItem("currentUser", currentUser);

      // Actualiza la UI con las tareas actualizadas
      loadTasksColumns(currentUser.tasks);
      await refreshFromBackend();
    }
  } catch (error) {
    console.error("Error moving task:", error);
  }
}

async function refreshFromBackend() {
  try {
    const updatedUserData = await backend.getItem("currentUser");
    if (updatedUserData) {
      const currentUser = loadUserData();
      // Actualiza solo las tareas locales con los datos del backend
      currentUser.tasks = updatedUserData.tasks;
      // Actualiza el estado local
      saveUserData(currentUser);
      // Actualiza la UI con las tareas actualizadas
      loadTasksColumns(currentUser.tasks);
    }
  } catch (error) {
    console.error("Error fetching updated data:", error);
  }
}

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

function loadAddTaskPU() {
  const addTaskSection = document.getElementById("createTaskPopUp");
  let html = "";
  html += addTaskContainer();
  addTaskSection.innerHTML += html;
  return html;
}

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

function checkInfoPU() {
  let info = false;
  if (document.getElementById("inputTitleTaskPU").value === "") {
    document.getElementById("titleRequiredPU").style.display = "flex";
    info = true;
  }
  if (document.getElementById("inputCalendarAddTaskPU").value === "") {
    document.getElementById("dateRequiredPU").style.display = "flex";
    info = true;
  }
  if (document.getElementById("addTaskDescriptionPU").value === "") {
    document.getElementById("descriptionRequiredPU").style.display = "flex";
    info = true;
  }
  return info;
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
  //clearTask();
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
