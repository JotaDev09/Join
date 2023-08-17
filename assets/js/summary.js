const columnTodoElements = document.getElementById("summaryTodoCount");
const columnProgressElements = document.getElementById("summaryProgressCount");
const columnFeedbacksElements = document.getElementById("summaryFeedbackCount");
const columnDoneElements = document.getElementById("summaryDoneCount");

async function initSummary() {
  includeHTML();
  greetUser();
  await Promise.all([
    loadUsers(),
    loadUserData(),
    updatePriorityCount(),
    updateTodoCount(),
  ]);
}

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

function countTasksWithPriority(priority, tasks) {
  return tasks.filter((task) => task.prio === priority).length;
}
function countTasksInColumns(column, tasks) {
  return tasks.filter((task) => task.columns === column).length;
}

function updatePriorityCount() {
  const currentUser = loadUserData();
  const urgentTaskCount = countTasksWithPriority(
    "addTaskPrioUrgent",
    currentUser.tasks
  );
  const urgentTaskCountElement = document.getElementById("summaryTasksUrgent");
  urgentTaskCountElement.textContent = urgentTaskCount;
}

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

//greeting according with the time
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

function greetUserName() {
  let users = JSON.parse(localStorage.getItem("actualUser"));
  if (users) {
    document.getElementById("summaryUser").innerHTML = users["name"];
  } else {
    document.getElementById("summaryUser").innerHTML = "Guest";
  }
  currentUserId = users ? users.id : null;
  console.log(currentUserId);
  console.log(loadUserData);
}
