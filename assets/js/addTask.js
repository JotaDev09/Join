let selecContacts = false;
let selecCategory = false;
let selectedCategory = null;
let selectedButtonId = "";
let categoryList = [];
let selectedSubTasks = [];
let task = {};
let selectedCategoryColor = "";
let columns = ["todo", "progress", "feedback", "done"];
let colorsCategory = [
  "#8AA4FF",
  "#FF0000",
  "#2AD300",
  "#FF8A00",
  "#E200BE",
  "#0038FF",
];

/**
 * necessary functions init AddTask
 */
async function initAddTask() {
  includeHTML();
  loadAddTaskHTML();
  await Promise.all([
    loadUsers(),
    loadCategoriesFromServer(),
    loadUserData(),
    getContacts(),
    loadSubTasks(),
    actualdate(),
  ]);
}

/**
 * the function loads the formular for add a new task
 */
function loadAddTaskHTML() {
  const addTaskSection = document.getElementById("addTaskContainer");
  let html = "";
  html += addTaskContainer();
  addTaskSection.innerHTML += html;
  return html;
}

/**
 * the function load the categories from Server
 */
async function loadCategoriesFromServer() {
  const currentUser = loadUserData();
  if (currentUser.categories.length > 0) {
    renderCategory(currentUser.categories);
  }
}

/**
 * The function gets the actual date
 */
function actualdate() {
  let today = new Date().toISOString().split("T")[0];
  document.getElementById("inputCalendarAddTask").min = today;
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

/**
 * expand Contacts Menu in AddTask
 */
function expandMenu() {
  if (selecContacts) {
    document.getElementById("contactsList").classList.add("d-none");
    document.getElementById("assignedContactcont").style = "height: 79px;";
    document.getElementById("containerContacts").style = "height: 51px;";
    selecContacts = false;
  } else {
    document.getElementById("contactsList").classList.remove("d-none");
    document.getElementById("assignedContactcont").style =
      "height: 204px; overflow: initial";
    document.getElementById("containerContacts").style =
      "height: 150px; overflow: scroll";
    selecContacts = true;
  }
}

/**
 * the function expands de menu of the categories
 */
function expandCategory() {
  if (selecCategory) {
    document.getElementById("categoryList").classList.add("d-none");
    document.getElementById("selecCategoryCont").style = "height: 79px;";
    document.getElementById("categoryContacts").style = "height: 51px;";
    selecCategory = false;
  } else {
    document.getElementById("categoryList").classList.remove("d-none");
    document.getElementById("selecCategoryCont").style =
      "height: 204px; overflow: initial";
    document.getElementById("categoryContacts").style =
      "height: 150px; overflow: scroll";
    selecCategory = true;
  }
}

/**
 * the function creates a new contact in the new Task
 */
async function createNewContactTask() {
  let emailContactTask = document.getElementById("addTaskNewContact");
  const currentUser = loadUserData();

  let newContact = {
    id: uuidv4(),
    name: "",
    email: emailContactTask.value,
    phone: "",
    color: getRandomColor(),
    check: false,
  };
  currentUser.contacts.push(newContact);
  saveUserData(currentUser);

  const userIndex = users.findIndex((user) => user.id === currentUser.id);
  if (userIndex !== -1) {
    users[userIndex] = currentUser;
    await backend.setItem("users", JSON.stringify(users));
  }

  const contactsList = document.getElementById("contactsList");
  const newContactHtml = generateContactsHtml([newContact]);
  contactsList.insertAdjacentHTML("beforeend", newContactHtml);

  emailContactTask.value = "";
  cancelNewContactTask();
}

/**
 * the function checks if the contacts are checked in a new task
 *
 */
function getCheckedContacts() {
  const checkedContacts = [];
  const checkboxes = document.querySelectorAll(".add_task_contacts_check");
  const currentUser = loadUserData();

  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      const contactId = checkbox.getAttribute("data-contact-id");

      if (currentUser && currentUser.contacts) {
        const checkedContactIndex = currentUser.contacts.findIndex(
          (contact) => contact.id === contactId
        );

        if (checkedContactIndex !== -1) {
          currentUser.contacts[checkedContactIndex].check = true;
          checkedContacts.push(currentUser.contacts[checkedContactIndex]);
        }
      }
    }
  });
  return checkedContacts;
}

/**
 * open to add a new Contact in AddTask
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
    "height: 79px; overflox: inherit";
  selecCategory = false;
}

/**
 * the function selects the color for the category
 */
function selectCategoryColor(color) {
  selectedCategoryColor = color;
}

/**
 * the function creates the new category with his color
 */
async function createNewCategoryTask() {
  const category = document.getElementById("addTaskNewCategory").value;
  const newCategoryColor = selectedCategoryColor;
  const currentUser = loadUserData();

  let newCategory = {
    id: uuidv4(),
    name: category,
    check: false,
    color: newCategoryColor,
  };
  currentUser.categories.push(newCategory);
  saveUserData(currentUser);

  const userIndex = users.findIndex((user) => user.id === currentUser.id);
  if (userIndex !== -1) {
    users[userIndex] = currentUser;
    await backend.setItem("users", JSON.stringify(users));
  }

  document.getElementById("addTaskNewCategory").value = "";
  loadCategoriesFromServer();
  cancelNewCategory();
}

/**
 * the function renders in the html the new category with his color
 */
function renderCategory(categories) {
  const categoryContainer = document.getElementById("newCategoryContainer");
  categoryContainer.innerHTML = "";

  categories.forEach((category, index) => {
    const categoryDiv = document.createElement("div");
    categoryDiv.className = "contacts_choose_cont row-center";
    categoryDiv.id = `selectCategoryForTask_${index}`;
    const categoryName = category && category.name;
    const categoryColor = category && category.color;
    categoryDiv.innerHTML = `
        <a class="add_task_subtitle font400">${categoryName}</a>
        <span class="category_circle_color color_sales" style="background:${categoryColor}"></span>
      `;

    selectedCategoryTask(categoryDiv, category, categories);
    categoryContainer.appendChild(categoryDiv);
  });
}

/**
 * the function selects the category for the task
 * @param {categoryDiv} - take the info from the category
 * @param {category} - take the info from the category
 **/
function selectedCategoryTask(categoryDiv, category, categories) {
  categoryDiv.addEventListener("click", () => {
    if (selectedCategory) {
      selectedCategory.check = false;
      const prevSelectedCategoryDiv = document.getElementById(
        `selectCategoryForTask_${categories.indexOf(selectedCategory)}`
      );
      prevSelectedCategoryDiv.classList.remove("add_task_selected");
    }
    category.check = true;
    selectedCategory = category;
    categoryDiv.classList.add("add_task_selected");

    const selectTaskCategoryDiv = document.getElementById("selectTaskCategory");
    selectTaskCategoryDiv.textContent = selectedCategory.name;

    expandCategory();
  });
}

/**
 * the function changes the colors of the prio buttons
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
 * the function resets the colors with the clearTask
 */
function resetColors() {
  deselectedButtons(selectedButtonId);
  deselectedButtonsPU(selectedButtonId);
}

/**
 * the function creates a new subtask
 */
async function subTaskGenerate() {
  if (document.getElementById("addTaskSubTask").value === "") {
    document.getElementById("subTaskRequired").style.display = "flex";
  } else {
    const taskSubTask = document.getElementById("addTaskSubTask").value;
    const currentUser = loadUserData();

    let newSubTask = {
      id: uuidv4(),
      title: taskSubTask,
      check: false,
      completed: false,
    };
    currentUser.subTasks.push(newSubTask);
    saveUserData(currentUser);
    const userIndex = users.findIndex((user) => user.id === currentUser.id);
    if (userIndex !== -1) {
      users[userIndex].subTasks = currentUser.subTasks;
      await backend.setItem("users", JSON.stringify(users));
    }
    document.getElementById("addTaskSubTask").value = "";
    loadSubTasks(newSubTask);
  }
}

/**
 * the function generates the html with the new subtask
 */
async function subTaskGenerateEdit() {
  const taskSubTask = document.getElementById("addTaskSubTaskEdit").value;
  const currentUser = loadUserData();

  let newSubTask = {
    id: uuidv4(),
    title: taskSubTask,
    check: false,
    completed: false,
  };
  currentUser.subTasks.push(newSubTask);
  saveUserData(currentUser);
  const userIndex = users.findIndex((user) => user.id === currentUser.id);
  if (userIndex !== -1) {
    users[userIndex].subTasks = currentUser.subTasks;
    await backend.setItem("users", JSON.stringify(users));
  }
  document.getElementById("addTaskSubTaskEdit").value = "";
  loadSubTasks(newSubTask);
}

/**
 * the function loads the subtasks in the html
 */

function loadSubTasks() {
  const currentUser = loadUserData();
  const subTaskContainer = document.getElementById("subTaskContainer");
  subTaskContainer.innerHTML = "";

  if (currentUser.subTasks.length > 0) {
    currentUser.subTasks.forEach((subTask, index) => {
      createSubTaskElement(subTask, index);
    });
  }
}

/**
 * The function creates the html for the subtask
 * @param {subTask} - take the info from the subtask
 * @param {index} - take the info from the index of the subtask
 */
function createSubTaskElement(subTask, index) {
  const subTaskDiv = document.createElement("div");
  subTaskDiv.classList.add("subtasks_cont_check", "row-center");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = "subTask${index}";
  checkbox.classList.add("subtasks_checkbox");
  checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
      selectedSubTasks.push(subTask);
      subTask.check = true;
    } else {
      const subTaskIndex = selectedSubTasks.findIndex(
        (item) => item.title === subTask.title
      );
      if (subTaskIndex !== -1) {
        selectedSubTasks.splice(subTaskIndex, 1);
        subTask.check = false;
      }
    }
  });
  const subTaskText = document.createElement("a");
  subTaskText.classList.add("subtask_text", "font400");
  subTaskText.textContent = subTask.title;

  subTaskDiv.appendChild(checkbox);
  subTaskDiv.appendChild(subTaskText);

  subTaskContainer.appendChild(subTaskDiv);
}

/**
 * the function creates a new Task
 */
async function createATask() {
  if (checkInfo()) {
  } else {
    let titleTask = document.getElementById("inputTitleTask");
    let contactsTask = getCheckedContacts() || { check: false, name: "" };
    let dueDateTask = document.getElementById("inputCalendarAddTask");
    let categoryTask = selectedCategory || {
      name: "default",
      check: true,
      color: "#000000",
    };
    let prioTask = selectedButtonId || "low";
    let descriptionTask = document.getElementById("addTaskDescription");
    let subtaskTask = selectedSubTasks || " ";

    const currentUser = loadUserData();
    createNewTask(
      titleTask,
      contactsTask,
      dueDateTask,
      categoryTask,
      prioTask,
      descriptionTask,
      subtaskTask,
      currentUser
    );

    clearTask();
  }
}

/**
 * the function creates a new Task
 * @param {titleTask} - take the info from the title of the task
 * @param {contactsTask} - take the info from the contacts of the task
 * @param {dueDateTask} - take the info from the due date of the task
 * @param {categoryTask} - take the info from the category of the task
 * @param {prioTask} - take the info from the prio of the task
 * @param {descriptionTask} - take the info from the description of the task
 * @param {subtaskTask} - take the info from the subtask of the task
 * @param {currentUser} - take the info from the current user
 **/
async function createNewTask(
  titleTask,
  contactsTask,
  dueDateTask,
  categoryTask,
  prioTask,
  descriptionTask,
  subtaskTask,
  currentUser
) {
  let newTask = {
    id: uuidv4(),
    title: titleTask.value,
    contacts: contactsTask,
    dueDate: dueDateTask.value,
    category: categoryTask,
    prio: prioTask,
    description: descriptionTask.value,
    subTask: subtaskTask,
    columns: "todo",
  };

  currentUser.tasks.push(newTask);
  saveUserData(currentUser);
  const userIndex = users.findIndex((user) => user.id === currentUser.id);
  if (userIndex !== -1) {
    users[userIndex] = currentUser;
    await backend.setItem("users", JSON.stringify(users));
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
 * deletes the required information notice
 */
function subTaskRequired() {
  document.getElementById("subTaskRequired").style.display = "none";
}

/**
 * clear the inputs of the AddTask
 */
function clearTask() {
  document.getElementById("inputTitleTask").value = "";
  document.getElementById("inputCalendarAddTask").value = "";
  document.getElementById("addTaskDescription").value = "";
  document.getElementById("contactsList").classList.add("d-none");
  document.getElementById("assignedContactcont").style =
    "height: 79px; overflox: inherit";
  resetColors();
  document.getElementById("categoryList").classList.add("d-none");
  document.getElementById("selecCategoryCont").style =
    "height: 79px; overflox: inherit";
  selecCategory = false;
  const checkboxes = document.querySelectorAll(".add_task_contacts_check");
  checkboxes.forEach((checkbox) => {
    checkbox.checked = false;
  });
  if (selectedCategory) {
    selectedCategory.check = false;
  }
  const checkSubTask = document.querySelectorAll(".subtasks_checkbox");
  checkSubTask.forEach((checkbox) => {
    checkbox.checked = false;
  });
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
  return selectedButtonId;
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
