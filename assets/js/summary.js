async function initSummary() {
  includeHTML();
  greetUser();
  await Promise.all([loadUsers(), loadUserData()]);
}

/**
 * greet user according day time and name
 */
function greetUser() {
  greetAccordingToDayTime();
  greetUserName();
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
