const columnTodoElements = document.getElementById("summaryTodoCount");
const columnProgressElements = document.getElementById("summaryProgressCount");
const columnFeedbacksElements = document.getElementById("summaryFeedbackCount");
const columnDoneElements = document.getElementById("summaryDoneCount");

/**
 * The function loads the summary page
 */
async function initSummary() {
  includeHTML();
  greetUser();
  showSummary();
  await Promise.all([
    loadUsers(),
    loadUserData(),
    updatePriorityCount(),
    updateTodoCount(),
  ]);
}

/**
 * The function loads the users
 */
function loadUserData() {
  return JSON.parse(localStorage.getItem("currentUser"));
}

/**
 * greet user according day time and name
 */
function greetUser() {
  greetAccordingToDayTime();
  greetUserName();
}

/**
 * The function counts the tasks with priority
 *
 * @param {priority} - take the priority
 * @param {tasks} -take the tasks
 */
function countTasksWithPriority(priority, tasks) {
  return tasks.filter((task) => task.prio === priority).length;
}

/**
 * The function counts the tasks in the columns
 *
 * @param {column} - take the column
 * @param {tasks} - take the tasks
 */
function countTasksInColumns(column, tasks) {
  return tasks.filter((task) => task.columns === column).length;
}

/**
 * The function updates the priority count
 */
function updatePriorityCount() {
  const currentUser = loadUserData();
  const urgentTaskCount = countTasksWithPriority(
    "addTaskPrioUrgent",
    currentUser.tasks
  );
  const urgentTaskCountElement = document.getElementById("summaryTasksUrgent");
  urgentTaskCountElement.textContent = urgentTaskCount;
}

/**
 * The function updates the todo column
 *
 */
function updateTodoCount() {
  const currentUser = loadUserData();
  const todoColumn = countTasksInColumns("todo", currentUser.tasks);
  const progressColumn = countTasksInColumns("progress", currentUser.tasks);
  const feedbackColumn = countTasksInColumns("feedback", currentUser.tasks);
  const doneColumn = countTasksInColumns("done", currentUser.tasks);

  if (todoColumn !== null) {
    columnTodoElements.textContent = todoColumn;
  }
  if (progressColumn !== null) {
    columnProgressElements.textContent = progressColumn;
  }
  if (feedbackColumn !== null) {
    columnFeedbacksElements.textContent = feedbackColumn;
  }
  if (doneColumn !== null) {
    columnDoneElements.textContent = doneColumn;
  }
}

/**
 * The function greets the user according to the day time
 *
 */
function greetAccordingToDayTime() {
  var currentTime = new Date().getHours();
  if (currentTime < 12) {
    document.getElementById("greetText").innerHTML = "Good morning, ";
  } else if (currentTime < 18) {
    document.getElementById("greetText").innerHTML = "Good afternoon, ";
  } else {
    document.getElementById("greetText").innerHTML = "Good evening, ";
  }
}

/**
 * The function greets the user according to the name
 */
function greetUserName() {
  let users = JSON.parse(localStorage.getItem("actualUser"));
  if (users) {
    document.getElementById("summaryUser").innerHTML = users["name"];
  } else {
    document.getElementById("summaryUser").innerHTML = "Guest";
  }
  currentUserId = users ? users.id : null;
}

/**
 * The function shows the summary board
 */
function showSummary() {
  if (window.matchMedia("(max-width: 650px)").matches) {
    setTimeout(() => {
      document.getElementById("containerSummary").classList.add("d-none");
      document.getElementById("summaryBoard").style =
        "display: flex !important";
    }, 2000);
  } else {
  }
}
