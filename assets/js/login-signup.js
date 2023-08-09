let users = [];
let currentRecoveredUser = null;
let currentUserId = null;

/**
 * neccesary functions in Sign-Up
 */
async function initSignUp() {
  await loadUsers();
}

/**
 * The function generates a new ID for the new user
 */
function generateUniqueId() {
  const timestamp = Date.now().toString(36); // Convert timestamp to base36
  const randomChars = Math.random().toString(36).substr(2, 5); // Get a random string (excluding "0." prefix)
  return `${timestamp}${randomChars}`;
}

/**
 * Add a new user in Join
 */
async function addUser() {
  let name = document.getElementById("newUserName");
  let email = document.getElementById("newUserEmail");
  let password = document.getElementById("newUserPassword");
  let existingUser = users.find((u) => u.email == email.value);
  if (existingUser) {
    alert("User already existing!");
  } else {
    let id = generateUniqueId();
    users.push({
      id: id,
      name: name.value,
      email: email.value,
      password: password.value,
      tasks: [],
      contacts: [],
    });
    await backend.setItem("users", JSON.stringify(users));
    window.location.href = "index.html";
  }
}

/**
 * load users from array
 */
async function loadUsers() {
  await downloadFromServer();
  users = JSON.parse(backend.getItem("users")) || [];
  return users;
}

/**
 * show login window from sign up
 */
function showLogInSite() {
  window.location.href = "index.html";
}

/**
 * confirm a new user in sign-up
 */
function confirmNewUser() {
  document.getElementById("login_site").classList.remove("d-none");
  document.getElementById("sign_up_site").classList.add("d-none");
  document.getElementById("sign_up_container").classList.add("d-none");
  document.getElementById("container_sign_up").classList.add("d-none");
}

/**
 * show login window from forgot password
 */
function showLoginSite() {
  document.getElementById("login_site").classList.remove("d-none");
  document.getElementById("sign_up_site").classList.add("d-none");
  document.getElementById("container_forgot_password").classList.add("d-none");
}

/**
 * show pop-up when forgot password
 */
function sendMailPassword() {
  const emailInput = document.getElementById("emailForNewPassword");
  const userEmail = emailInput.value;
  console.log("userEmail:", userEmail);

  const user = users.find((u) => u.email === userEmail);

  if (user) {
    currentRecoveredUser = user;

    document.getElementById("windowPopUps").classList.remove("d-none");
    document.getElementById("popUpForgotPassword").style =
      "transform: translateY(-557%); transition-duration: 0.5s";

    sendMailPass = setInterval(sendMail, 1000);
  } else {
    alert("user not found");
  }
}

/**
 * function for interval bei sendMailPassword
 */
function sendMail() {
  document.getElementById("windowPopUps").classList.add("d-none");
  document.getElementById("popUpForgotPassword").style =
    "transform: translateY(110%)";
  document.getElementById("container_forgot_password").classList.add("d-none");
  document
    .getElementById("container_reset_password")
    .classList.remove("d-none");
  clearInterval(sendMailPass);
}

/**
 * show window forgot the password
 */
function showForgotThePassword() {
  document.getElementById("container_reset_password").classList.add("d-none");
  document.getElementById("sign_up_container").classList.add("d-none");
  document.getElementById("sign_up_site").classList.remove("d-none");
  document
    .getElementById("container_forgot_password")
    .classList.remove("d-none");
}

/**
 * User changes the password and show pop-up
 */
function changePassword() {
  const newPasswordInput = document.getElementById("newPassword");
  const confirmPasswordInput = document.getElementById("confirmPassword");

  const newPassword = newPasswordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  if (newPassword === confirmPassword) {
    currentRecoveredUser.password = newPassword;
    backend.setItem("users", JSON.stringify(users));

    document.getElementById("popUpResetPassword").style =
      "transform: translateY(-557%); transition-duration: 0.5s";

    changePass = setInterval(passwordChange, 1000);
  } else {
    alert("Passwords do not match");
  }
}

/**
 * function for interval bei changePassword
 */
function passwordChange() {
  document.getElementById("windowPopUps").classList.add("d-none");
  document.getElementById("popUpResetPassword").style =
    "transform: translateY(110%)";
  document.getElementById("container_reset_password").classList.add("d-none");
  document.getElementById("sign_up_site").classList.add("d-none");
  document.getElementById("login_site").classList.remove("d-none");
  clearInterval(changePass);
}
