


/**
 * open the pop-up create Task
 */
function createTaskPU() {
    document.getElementById('createTaskPopUp').classList.remove('slide_right');
    document.getElementById('createTaskPopUp').classList.add('slide_left');
    document.getElementById('addTaskPopUpContainer').classList.add('background_white_transp');
}

/**
 * close the pop-up create Task
 */
function closePopUpCreate() {
    document.getElementById('createTaskPopUp').classList.add('slide_right');
    document.getElementById('createTaskPopUp').classList.remove('slide_left');
    document.getElementById('addTaskPopUpContainer').classList.remove('background_white_transp');
}

/**
 * pop-up header log out
 */
function userLogOut() {
    if (popUpLogout) {
        document.getElementById('popUpLogOut').classList.add("d-none");
        popUpLogout = false;
    } else {
        document.getElementById('popUpLogOut').classList.remove('d-none');
        popUpLogout = true
    }
}