let popUpLogout = false;

/**
 * pop-up header log out
 */
function userLogOut() {
   if(popUpLogout) {
    document.getElementById('popUpLogOut').classList.add("d-none");
    popUpLogout = false;
   } else {
    document.getElementById('popUpLogOut').classList.remove('d-none');
    popUpLogout = true
   }
}

function logOut() {
   window.location.href = "index.html";
}
