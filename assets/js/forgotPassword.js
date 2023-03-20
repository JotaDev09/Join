/**
 * show login window from forgot password
 */
function showLoginSite() {
    document.getElementById('login_site').classList.remove('d-none')
    document.getElementById('sign_up_site').classList.add('d-none')
    document.getElementById('container_forgot_password').classList.add('d-none')
}

/**
 * show pop-up when forgot password
 */
function sendMailPassword() {
    document.getElementById('windowPopUps').classList.remove('d-none');
    document.getElementById('popUpForgotPassword').style =
        "transform: translateY(-557%); transition-duration: 0.5s";

    sendMailPass = setInterval(sendMail, 1000)
}

/**
 * function for interval bei sendMailPassword
 */
function sendMail() {
    document.getElementById('windowPopUps').classList.add('d-none');
    document.getElementById('popUpForgotPassword').style =
        "transform: translateY(110%)";
    document.getElementById('container_forgot_password').classList.add('d-none');
    document.getElementById('container_reset_password').classList.remove('d-none');
    clearInterval(sendMailPass)
}

/**
 * show window forgot the password
 */
function showForgotThePassword() {
    document.getElementById('container_reset_password').classList.add('d-none')
    document.getElementById('sign_up_container').classList.add('d-none')
    document.getElementById('sign_up_site').classList.remove('d-none')
    document.getElementById('container_forgot_password').classList.remove('d-none')
}
/**
 * change the password and show pop-up
 */
function changePassword() {
    // document.getElementById('windowPopUps').classList.remove('d-none');
    document.getElementById('popUpResetPassword').style =
        "transform: translateY(-557%); transition-duration: 0.5s"

    changePass = setInterval(passwordChange, 1000)
}

/**
 * function for interval bei changePassword
 */
function passwordChange() {
    document.getElementById('windowPopUps').classList.add('d-none');
    document.getElementById('popUpResetPassword').style =
        "transform: translateY(110%)";
    document.getElementById('container_reset_password').classList.add('d-none');
    document.getElementById('sign_up_site').classList.add('d-none');
    document.getElementById('login_site').classList.remove('d-none');
    clearInterval(changePass);
}
