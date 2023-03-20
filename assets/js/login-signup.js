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

/**
 * show sign up window
 */
function showSignup() {
    document.getElementById('login_site').classList.add('d-none')
    document.getElementById('sign_up_site').classList.remove('d-none')
    document.getElementById('sign_up_container').classList.remove('d-none')
    document.getElementById('container_sign_up').classList.remove('d-none')
}

/**
 * show login window from sign up
 */
function showLoginSite() {
    document.getElementById('login_site').classList.remove('d-none')
    document.getElementById('sign_up_site').classList.add('d-none')
    document.getElementById('sign_up_container').classList.add('d-none')
    document.getElementById('container_sign_up').classList.add('d-none')
}

/**
 * show forgot password window
 */
function showForgotPassword() {
    document.getElementById('login_site').classList.add('d-none')
    document.getElementById('sign_up_container').classList.add('d-none')
    document.getElementById('sign_up_site').classList.remove('d-none')
    document.getElementById('container_forgot_password').classList.remove('d-none')
}

function confirmNewUser() {
    document.getElementById('login_site').classList.remove('d-none')
    document.getElementById('sign_up_site').classList.add('d-none')
    document.getElementById('sign_up_container').classList.add('d-none')
    document.getElementById('container_sign_up').classList.add('d-none')
}