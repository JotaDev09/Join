let selecContacts = false;
let selectContactsTask = null;
let selecCategory = false;
let selectedCategory = null;
let selectedButtonId = "";
let categoryList = [];
let colorsCategory = [
  "#8AA4FF",
  "#FF0000",
  "#2AD300",
  "#FF8A00",
  "#E200BE",
  "#0038FF",
];
let selectedCategoryColor = "";
let columns = ["todo", "progress", "feedback", "done"];

let task = {
  id: "",
  title: "",
  contacts: new Array(),
  dueDate: "",
  category: new Array(),
  prio: "",
  description: "",
  subTask: new Array(),
};

/**
 * necessary functions init AddTask
 */
async function initAddTask() {
  includeHTML();
  await Promise.all([
    loadUsers(),
    loadCategoriesFromServer(),
    loadTasksFromServer(),
    loadUserData(),
    getContacts(),
    subTaskGenerate(),
  ]);
}

/**
 * the function load the tasks from Server
 */
async function loadTasksFromServer() {
  await downloadFromServer();
  tasks = JSON.parse(backend.getItem("tasks")) || [];
}

async function loadCategoriesFromServer() {
  await downloadFromServer();
  categoryList = JSON.parse(backend.getItem("categoryList")) || [];
  if (categoryList.length > 0) {
    renderCategory(categoryList);
  }
}

createATask(); // La función que deseas medir

/**
 * Create a new Task
 */
async function createATask() {
  if (checkInfo()) {
    // Lógica para verificar información
  } else {
    addInfoNewTask();

    // Obtén el usuario actual de alguna manera (por ejemplo, de la sesión o las cookies)
    const currentUser = loadUsers(); // Reemplaza esto con la forma en que obtienes el usuario

    if (currentUser) {
      // Asocia la tarea con el ID del usuario actual
      task.userId = currentUser.id; // Reemplaza 'id' con la propiedad correcta del usuario

      console.log("added");
      // Encuentra al usuario correspondiente en el array de usuarios
      const user = users.find((u) => u.id === currentUser.id);

      if (user) {
        // Agrega la tarea al array de tareas del usuario
        user.tasks.push(task);

        // Almacena la lista de usuarios actualizada en el servidor
        await backend.setItem("users", JSON.stringify(users));

        clearTask();
      } else {
        // El usuario no está autenticado o no se encontró en el array de usuarios, muestra un mensaje de error o realiza alguna otra acción
      }
    } else {
      // El usuario no está autenticado, muestra un mensaje de error o realiza alguna otra acción
    }
  }
}

/**
 * Create a new Task Pop-Up
 */
async function createATaskPU() {
  if (checkInfoPU()) {
  } else {
    addInfoNewTask();
    await loadTasksFromServer();
    tasks = JSON.parse(await backend.getItem("tasks")) || [];
    tasks.push(task);
    await backend.setItem("tasks", JSON.stringify(tasks));
    //clearTaskPU();
  }
}

/**
 * Check the inputs and add an alert to required the info
 */
function checkInfo() {
  let info = false;
  if (document.getElementById("inputTitleTask").value === "") {
    document.getElementById("titleRequired").style.display = "flex";
    info = true;
  }
  if (document.getElementById("inputCalendarAddTask").value === "") {
    document.getElementById("dateRequired").style.display = "flex";
    info = true;
  }
  if (document.getElementById("addTaskDescription").value === "") {
    document.getElementById("descriptionRequired").style.display = "flex";
    info = true;
  }
  return info;
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
 * deletes the required information notice
 */
function writeTitle() {
  document.getElementById("titleRequired").style.display = "none";
}

/**
 * deletes the required information notice
 */
function writeDate() {
  document.getElementById("dateRequired").style.display = "none";
}

/**
 * deletes the required information notice
 */
function writeDescription() {
  document.getElementById("descriptionRequired").style.display = "none";
}

/**
 * add the info of the new tasl to the array
 */
function addInfoNewTask() {
  let taskTitle = document.getElementById("inputTitleTask").value;
  let taskDate = document.getElementById("inputCalendarAddTask").value;
  let taskDescription = document.getElementById("addTaskDescription").value;

  task.id = uuidv4();
  task.title = taskTitle;
  task.contacts = selectContactsTask;
  task.dueDate = taskDate;
  task.category = selectedCategory;
  task.description = taskDescription;

  if (!columns.includes(task.column)) {
    task.column = "todo"; // Establecer 'todo' como la categoría por defecto
  }
}

/**
 * expand Contacts Menu in AddTask
 */
function expandMenu() {
  if (selecContacts) {
    document.getElementById("contactsList").classList.add("d-none");
    document.getElementById("assignedContactcont").style =
      "height: 51px; overflox: inherit";
    selecContacts = false;
  } else {
    document.getElementById("contactsList").classList.remove("d-none");
    document.getElementById("assignedContactcont").style =
      "height: 204px; overflow: auto";
    selecContacts = true;
  }
}

/**
 * the function load the contacts from Server
 */
function getContacts() {
  const currentUser = loadUserData();
  const sortedContacts = sortContactsByInitialLetter(currentUser.contacts);

  let html = "";
  for (let letter in sortedContacts) {
    const contactsByLetter = sortedContacts[letter];
    if (contactsByLetter.length > 0) {
      html += generateContactsHtml(contactsByLetter);
    }
  }

  const contactsList = document.getElementById("contactsList");
  contactsList.innerHTML = html + generateInviteNewContactHtml();
}

function generateContactsHtml(contacts) {
  let html = "";

  contacts.forEach((contact, index) => {
    html += `
      <div class="add_task_contacts_list row-center" id="contactContainer${index}">
        <a class="add_task_contact_name font400" id="addUserTask${index}">${
      contact.name || contact.email
    }</a>
        <input type="checkbox" class="add_task_contacts_check" id="checkContact${index}" onclick="checkboxContact(${index}, 'checkContact${index}')">
      </div>
    `;
  });

  return html;
}

function generateInviteNewContactHtml() {
  return `
    <div class="contacts_choose_cont row-center" onclick="assignedNewContact()">
      <a class="add_task_subtitle font400">Invite new contact</a>
      <img src="assets/img/newContactBlue.svg" class="add_task_new_contact" >
    </div>
  `;
}

/**
 * the function check if the contacts are in the Task
 *  *
 * @param {index} - take the info from array contacts
 * @param {checkboxId} - take the info from the input checkbox
 */
function checkboxContact(index, checkboxId) {
  const checkbox = document.getElementById(checkboxId);
  const contactName = document.getElementById(
    `addUserTask${index}`
  ).textContent;

  if (checkbox.checked) {
    selectContactsTask = { name: contactName };
    console.log(`Se ha marcado el contacto '${contactName}'`);
  } else {
    selectContactsTask = null;
  }
}

/**
 * the function creates a new contact bei new Task
 */
async function createNewContactTask() {
  let emailContactTask = document.getElementById("addTaskNewContact");
  const currentUser = loadUserData(); // Load current user's data
  if (!currentUser.contacts) {
    currentUser.contacts = []; // Initialize contacts array if not exists
  }
  let newContact = {
    id: uuidv4(),
    name: "",
    email: emailContactTask.value,
    phone: "",
    color: getRandomColor(),
  };
  currentUser.contacts.push(newContact);
  saveUserData(currentUser);

  const userIndex = users.findIndex((user) => user.id === currentUser.id);
  if (userIndex !== -1) {
    // Update the user's data in the users array
    users[userIndex] = currentUser;
    await backend.setItem("users", JSON.stringify(users)); // Update the users data in the backend
  }

  const contactsList = document.getElementById("contactsList");
  const newContactHtml = generateContactsHtml([newContact]);
  contactsList.insertAdjacentHTML("beforeend", newContactHtml);

  // Reset the input field
  emailContactTask.value = "";

  // Hide the new contact input
  //document.getElementById("newContactCont").classList.add("d-none");
  cancelNewContactTask();
}

/**
 * write a new Contact in AddTask
 */
function assignedNewContact() {
  document.getElementById("assignedContactcont").classList.add("d-none");
  document.getElementById("addTaskNewContact").classList.remove("d-none");
  document.getElementById("newContactCont").classList.remove("d-none");
}

/**
 * close write a new Contact in AddTask
 */
function cancelNewContactTask() {
  document.getElementById("assignedContactcont").classList.remove("d-none");
  document.getElementById("addTaskNewContact").classList.add("d-none");
  document.getElementById("newContactCont").classList.add("d-none");
}

/**
 * the function change the colors of the prio buttons
 *
 * @param {button} - take the info from prio buttons
 */
function choosePrio(button) {
  if (selectedButtonId !== button.id) {
    deselectedButtons(selectedButtonId);
    selectedButtons(button.id);
    selectedButtonId = button.id;
  }
}

/**
 * the function change the colors of the prio buttons to initials colors
 *
 * @param {selectedButtonId} - take the info from id of the prio buttons
 */
function deselectedButtons(selectedButtonId) {
  switch (selectedButtonId) {
    case "addTaskPrioUrgent":
      document.getElementById("addTaskPrioUrgent").style.backgroundColor =
        "#FFFFFF";
      document.getElementById("addTaskPrioUrgentA").style.color = "#000000";
      document.getElementById("addTaskPrioUrgentImg").src =
        "assets/img/PrioAlta.svg";
      break;
    case "addTaskPrioMedium":
      document.getElementById("addTaskPrioMedium").style.backgroundColor =
        "#FFFFFF";
      document.getElementById("addTaskPrioMediumA").style.color = "#000000";
      document.getElementById("addTaskPrioMediumImg").src =
        "assets/img/PrioMedia.svg";
      break;
    case "addTaskPrioLow":
      document.getElementById("addTaskPrioLow").style.backgroundColor =
        "#FFFFFF";
      document.getElementById("addTaskPrioLowA").style.color = "#000000";
      document.getElementById("addTaskPrioLowImg").src =
        "assets/img/PrioBaja.svg";
      break;
    default:
      break;
  }
}

/**
 * the function change the colors of the prio buttons to selected colors
 *
 * @param {buttonId} - take the info from id of the prio buttons
 */
function selectedButtons(buttonId) {
  switch (buttonId) {
    case "addTaskPrioUrgent":
      document.getElementById(buttonId).style.backgroundColor = "#FF3D00";
      document.getElementById("addTaskPrioUrgentA").style.color = "#FFFFFF";
      document.getElementById("addTaskPrioUrgentImg").src =
        "assets/img/prioAltaWhite.svg";
      task.prio = "urgent";
      break;
    case "addTaskPrioMedium":
      document.getElementById(buttonId).style.backgroundColor = "#FFA800";
      document.getElementById("addTaskPrioMediumA").style.color = "#FFFFFF";
      document.getElementById("addTaskPrioMediumImg").src =
        "assets/img/prioMediaWhite.svg";
      task.prio = "medium";
      break;
    case "addTaskPrioLow":
      document.getElementById(buttonId).style.backgroundColor = "#7AE229";
      document.getElementById("addTaskPrioLowA").style.color = "#FFFFFF";
      document.getElementById("addTaskPrioLowImg").src =
        "assets/img/prioBajaWhite.svg";
      task.prio = "low";
      break;
    default:
      break;
  }
}

/**
 * the function change the colors of the prio buttons Pop Up
 *
 * @param {button} - take the info from prio buttons
 */
function choosePrioPU(button) {
  if (selectedButtonId !== button.id) {
    deselectedButtonsPU(selectedButtonId);
    selectedButtonsPU(button.id);
    selectedButtonId = button.id;
  }
}

/**
 * the function change the colors of the prio buttons to initials colors  Pop Up
 *
 * @param {selectedButtonId} - take the info from id of the prio buttons
 */
function deselectedButtonsPU(selectedButtonId) {
  switch (selectedButtonId) {
    case "addTaskPrioUrgentPU":
      document.getElementById("addTaskPrioUrgentPU").style.backgroundColor =
        "#FFFFFF";
      document.getElementById("addTaskPrioUrgentAPU").style.color = "#000000";
      document.getElementById("addTaskPrioUrgentImgPU").src =
        "assets/img/PrioAlta.svg";
      break;
    case "addTaskPrioMediumPU":
      document.getElementById("addTaskPrioMediumPU").style.backgroundColor =
        "#FFFFFF";
      document.getElementById("addTaskPrioMediumAPU").style.color = "#000000";
      document.getElementById("addTaskPrioMediumImgPU").src =
        "assets/img/PrioMedia.svg";
      break;
    case "addTaskPrioLowPU":
      document.getElementById("addTaskPrioLowPU").style.backgroundColor =
        "#FFFFFF";
      document.getElementById("addTaskPrioLowAPU").style.color = "#000000";
      document.getElementById("addTaskPrioLowImgPU").src =
        "assets/img/PrioBaja.svg";
      break;
    default:
      break;
  }
}

/**
 * the function change the colors of the prio buttons to selected colors  Pop Up
 *
 * @param {buttonId} - take the info from id of the prio buttons
 */
function selectedButtonsPU(buttonId) {
  switch (buttonId) {
    case "addTaskPrioUrgentPU":
      document.getElementById(buttonId).style.backgroundColor = "#FF3D00";
      document.getElementById("addTaskPrioUrgentAPU").style.color = "#FFFFFF";
      document.getElementById("addTaskPrioUrgentImgPU").src =
        "assets/img/prioAltaWhite.svg";
      task.prio = "urgent";
      break;
    case "addTaskPrioMediumPU":
      document.getElementById(buttonId).style.backgroundColor = "#FFA800";
      document.getElementById("addTaskPrioMediumAPU").style.color = "#FFFFFF";
      document.getElementById("addTaskPrioMediumImgPU").src =
        "assets/img/prioMediaWhite.svg";
      task.prio = "medium";
      break;
    case "addTaskPrioLowPU":
      document.getElementById(buttonId).style.backgroundColor = "#7AE229";
      document.getElementById("addTaskPrioLowAPU").style.color = "#FFFFFF";
      document.getElementById("addTaskPrioLowImgPU").src =
        "assets/img/prioBajaWhite.svg";
      task.prio = "low";
      break;
    default:
      break;
  }
}

/**
 * the function reset the colors with the clearTask
 */
function resetColors() {
  deselectedButtons(selectedButtonId);
  deselectedButtonsPU(selectedButtonId);
}

/**
 * expand Category Menu in AddTask
 */
function expandCategory() {
  if (selecCategory) {
    document.getElementById("categoryList").classList.add("d-none");
    document.getElementById("selecCategoryCont").style =
      "height: 70px; overflox: inherit";
    selecCategory = false;
  } else {
    document.getElementById("categoryList").classList.remove("d-none");
    document.getElementById("selecCategoryCont").style =
      "height: 204px; overflow: auto";
    selecCategory = true;
  }
}

/**
 * write a new Category in AddTask
 */
function createdNewCategory() {
  document.getElementById("selecCategoryCont").classList.add("d-none");
  document.getElementById("newCategoryCont").classList.remove("d-none");
  document.getElementById("newCategoryCont").innerHTML = ``;
  document.getElementById("newCategoryCont").innerHTML += newCategoryName();
  document.getElementById("colorsContainer").innerHTML += ``;
  for (let color = 0; color < colorsCategory.length; color++) {
    let colorCategory = colorsCategory[color];
    document.getElementById("colorsContainer").innerHTML +=
      newCategoryColors(colorCategory);
  }
}

/**
 * close write a new Category in AddTask
 */
function cancelNewCategory() {
  document.getElementById("selecCategoryCont").classList.remove("d-none");
  document.getElementById("addTaskNewCategory").classList.add("d-none");
  document.getElementById("newCategoryCont").classList.add("d-none");
  document.getElementById("categoryList").classList.add("d-none");
  document.getElementById("selecCategoryCont").style =
    "height: 70px; overflox: inherit";
  selecCategory = false;
}

function newCategoryName() {
  return `
        <div class="new_contact_cont row-center">
            <input class="new_contact_input row-center font400" id="addTaskNewCategory" 
            placeholder="New category name"></input>
            <div class="new_contact_input_icons row-center-center">
                <img src="assets/img/cancelBlue.svg" onclick="cancelNewCategory()">
                <img src="assets/img/grauLineSmall.svg">
                <img src="assets/img/blueCheck.svg" onclick="createNewCategoryTask()">
            </div>
        </div>
        <div class="new_category_colors row-center" id="colorsContainer"></div>
    `;
}

function newCategoryColors(colorCategory) {
  return `
        <div class="new_category_select_color row-center">
            <button class="new_category_circle" style="background:${colorCategory}" onclick="selectCategoryColor('${colorCategory}')"></button>
        </div>
    `;
}

function selectCategoryColor(color) {
  selectedCategoryColor = color; // Almacenar el color seleccionado en la variable global
}

async function createNewCategoryTask() {
  const newCategory = document.getElementById("addTaskNewCategory").value;
  const newCategoryColor = selectedCategoryColor;
  if (newCategory) {
    categoryList.push({
      name: newCategory,
      status: false,
      color: newCategoryColor,
    });
    await backend.setItem("categoryList", JSON.stringify(categoryList));
    generateNewCategory();
  }
  document.getElementById("addTaskNewCategory").value = "";
  cancelNewCategory();
}

function generateNewCategory() {
  // document.getElementById('newCategoryContainer').innerHTML = ``;
  for (let i = 0; i < categoryList.length; i++) {
    if (!categoryList[i].status) {
      //         document.getElementById('newCategoryContainer').innerHTML += renderCategory(i);
    }
  }
  renderCategory(i);
}

function renderCategory(categories) {
  const categoryContainer = document.getElementById("newCategoryContainer");
  categoryContainer.innerHTML = "";

  categories.forEach((category, index) => {
    const categoryDiv = document.createElement("div");
    categoryDiv.className = "contacts_choose_cont row-center";
    categoryDiv.id = "selectCategoryForTask";
    const categoryName =
      category && category.name ? category.name : "Unnamed Category";
    const categoryColor =
      category && category.color ? category.color : "Unnamed Color";
    categoryDiv.innerHTML = `
        <a class="add_task_subtitle font400">${categoryName}</a>
        <span class="category_circle_color color_sales" style="background:${categoryColor}"></span>
      `;
    categoryDiv.addEventListener("click", () => {
      // Handle category click event here
      console.log(`Clicked category ${index}`);
      selectedCategory = category;
    });
    categoryContainer.appendChild(categoryDiv);
  });
}

/**
 * create a new subtask
 */
function subTaskGenerate() {
  let taskSubTask = document.getElementById("addTaskSubTask").value;
  if (taskSubTask) {
    let subTask = {
      title: taskSubTask,
      status: false,
    };
    task.subTask.push(subTask);
    renderSubtask();
  }
  document.getElementById("addTaskSubTask").value = "";
}

/**
 * render the new subtask
 */
function renderSubtask() {
  document.getElementById("subTaskContainer").innerHTML = ``;
  for (let i = 0; i < task.subTask.length; i++) {
    if (!task.subTask[i].status) {
      document.getElementById("subTaskContainer").innerHTML += renderSubTask(i);
    }
  }
}

/**
 * include de html of the new subtask
 */
function renderSubTask(i) {
  return `
    <div class="subtasks_cont_check row-center">
        <input type="checkbox" class="subtasks_checkbox">
        <a class="subtask_text font400">${task.subTask[i].title}</a>
    </div>`;
}

/**
 * clear the inputs of the AddTask
 */
function clearTask() {
  document.getElementById("inputTitleTask").value = "";
  document.getElementById("inputCalendarAddTask").value = "";
  document.getElementById("addTaskDescription").value = "";
  document.getElementById("addTaskSubTask").value = "";
  resetColors();
}
