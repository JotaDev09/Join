let users = [
    {
        'name': 'Guest',
        'email': 'guest@join.de',
        'password': 'join123'
    }
];

async function initSignUp() {
    await loadUsers();
}

async function addUser() {
    let name = document.getElementById('newUserName');
    let email = document.getElementById('newUserEmail');
    let password = document.getElementById('newUserPassword');

    users.push({ name: name.value, email: email.value, password: password.value });
    await backend.setItem('users', JSON.stringify(users));
    window.location.href = "index.html";
}

async function loadUsers() {
    await downloadFromServer();
    users = JSON.parse(backend.getItem('users')) || [];
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
    document.getElementById('login_site').classList.remove('d-none')
    document.getElementById('sign_up_site').classList.add('d-none')
    document.getElementById('sign_up_container').classList.add('d-none')
    document.getElementById('container_sign_up').classList.add('d-none')
}
