


/**
 * necessary functions in init
 */
async function init() {
    includeHTML();
    animatedLogo();
    await loadUsers();
}



/**
 * animated Join logo
 */
function animatedLogo() {
    if (window.matchMedia("(max-width: 480px)").matches) {
        document.getElementById("logo_init").style =
            "transform: translateX(-100%) translateY(-100%); left: 20px; top: 20px; scale: 0.4;";
    } else {
        document.getElementById("logo_init").style =
            "transition-duration: 1.3s"
        "transform: translateX(-100%) translateY(-100%); width:100px; height:121px; left: 77px; top: 80px; scale: 1.0;";
    }
    showLogin();
}

/**
 * show login window
 */
function showLogin() {
    setTimeout(() => {
        document.getElementById("logo_init").classList.add("d-none");
        document.getElementById("login_site").classList.remove("d-none");
    }, 1500);
}


function showPassword() {
    const passwordInput = document.getElementById('newUserPassword');
    const passwordIcon = document.getElementById('password_icon');

    if (passwordInput.getAttribute('type') === 'password') {
        passwordInput.setAttribute('type', 'text');
        passwordIcon.setAttribute('src', 'assets/img/eyeOpen.svg');
    } else {
        passwordInput.setAttribute('type', 'password');
        passwordIcon.setAttribute('src', 'assets/img/locker.svg');
    }
}

/**
 * login as user
 */
async function logInUser() {
    await downloadFromServer();
    users = JSON.parse(backend.getItem('users')) || [];
    let email = document.getElementById('newUserEmail');
    let password = document.getElementById('newUserPassword');
    let user = users.find(u => u.email == email.value && u.password == password.value);
    let existingEmail = users.find((u) => u.email == email);
    let existingpassword = users.find((u) => u.password == password);

    if (user) {
        window.location.href = "summary.html";
    } else if (!existingEmail) {
        wrongEmail();
    }

    if (user) {
        window.location.href = "summary.html";
    } else if (!existingpassword) {
        wrongPassword();
    }

    
}

/**
 * show message when the email is wrong
 */
function wrongEmail() {
    document.getElementById('wrongEmail').classList.remove('d-none');;
    // inputPass.setAttribute("placeholder", "");
}

/**
 * hidde the message when the email is wrong
 */
function writeEmail() {
    document.getElementById('wrongEmail').classList.add('d-none');;
    document.getElementById("newUserEmail").value = "";
}

/**
 * show message when the password is wrong
 */
function wrongPassword() {
    document.getElementById('tryAgain').classList.remove('d-none');;
    document.getElementById('wrongPassword').classList.remove('d-none');;
    document.getElementById('newUserPassword').classList.add('d-none');
}

/**
 * hidde the message when the password is wrong
 */
function writePassword() {
    document.getElementById('tryAgain').classList.add('d-none');;
    document.getElementById('wrongPassword').classList.add('d-none');;
    document.getElementById('newUserPassword').classList.remove('d-none');
    document.getElementById("newUserPassword").value = "";
}


/**
 * show forgot password window
 */
function showForgotPassword() {
    document.getElementById('login_site').classList.add('d-none')
    document.getElementById('sign_up_site').classList.remove('d-none')
    document.getElementById('container_forgot_password').classList.remove('d-none')
}

/**
 * show sign up window
 */
function showSignup() {
    window.location.href = "signup.html";
}

/**
 * login as guest
 */
function logInGuest() {
    window.location.href = "summary.html";
}

/**
 *  open Summary window
 */
function openSummary() {
    window.location.href = "summary.html";
}

/**
 *  open Board window
 */
function openBoard() {
    window.location.href = "board.html";
}

/**
 *  open Add Task window
 */
function openAddTask() {
    window.location.href = "addTask.html";
}

/**
 *  open Contacts window
 */
function openContacts() {
    window.location.href = "contacts.html";
}




/**
 * include templates html
 */
function includeHTML() {
    var z, i, elmnt, file, xhttp;
    /* Loop through a collection of all HTML elements: */
    z = document.getElementsByTagName("*");
    for (i = 0; i < z.length; i++) {
        elmnt = z[i];
        /*search for elements with a certain atrribute:*/
        file = elmnt.getAttribute("w3-include-html");
        if (file) {
            /* Make an HTTP request using the attribute value as the file name: */
            xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4) {
                    if (this.status == 200) { elmnt.innerHTML = this.responseText; }
                    if (this.status == 404) { elmnt.innerHTML = "Page not found."; }
                    /* Remove the attribute, and call this function once more: */
                    elmnt.removeAttribute("w3-include-html");
                    includeHTML();
                }
            }
            xhttp.open("GET", file, true);
            xhttp.send();
            /* Exit the function: */
            return;
        }
    }
}