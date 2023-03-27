let contacts = [
    {
        'name': 'Juan',
        'email': 'juan@join.de',
        'phone': '+4912345678'
    }
]

/**
 * necessary functions in Contacts
 */
async function initContacts() {
    includeHTML();
    await loadUsers();
}

/**
 * open new contact pop-up
 */
function openNewContact() {
    document.getElementById('newContactPop').classList.remove('slide-left');
    document.getElementById('newContactPop').classList.add('slide-right');
    document.getElementById('newContactPopUp').classList.add('background_white_transp');
}

/**
 * close new contact pop-up
 */
function closeNewContact() {
    document.getElementById('newContactPop').classList.add('slide-left');
    document.getElementById('newContactPop').classList.remove('slide-right');
    document.getElementById('newContactPopUp').classList.remove('background_white_transp');
}

/**
 * open edit contact pop-up
 */
function openEditContact() {
    document.getElementById('editContactPop').classList.remove('slide-left');
    document.getElementById('editContactPop').classList.add('slide-right');
    document.getElementById('editContactPopUp').classList.add('background_white_transp');
}

/**
 * close edit contact pop-up
 */
function closeEditContact() {
    document.getElementById('editContactPop').classList.add('slide-left');
    document.getElementById('editContactPop').classList.remove('slide-right');
    document.getElementById('editContactPopUp').classList.remove('background_white_transp');
}

/**
 * empty new contact pop-up
 */
function cancelNewContact() {
    document.getElementById('newContactName').value = "";
    document.getElementById('newContactEmail').value = "";
    document.getElementById('newContactPhone').value = "";
}

function createNewContact() {
    let newName = document.getElementById('newContactName');
    let newEmail = document.getElementById('newContactEmail');
    let newPhone = document.getElementById('newContactPhone');
    let requiredName = document.getElementById('newFieldRequiredName');
    let requiredEmail = document.getElementById('newFieldRequiredEmail');
    let requiredPhone = document.getElementById('newFieldRequiredPhone');
    
    if (newName.value === "" || newEmail.value === "" || newPhone === "") {
        requiredName.classList.remove('d-none');
        requiredEmail.classList.remove('d-none');
        requiredPhone.classList.remove('d-none');
    } else {
        closeNewContact()
    }
}

function editContact() {
    let editName = document.getElementById('editContactName');
    let editEmail = document.getElementById('editContactEmail');
    let editPhone = document.getElementById('editContactPhone');
    let requiredNameE = document.getElementById('editFieldRequiredName');
    let requiredEmailE = document.getElementById('editFieldRequiredEmail');
    let requiredPhoneE = document.getElementById('editFieldRequiredPhone');
    
    if (editName.value === "" || editEmail.value === "" || editPhone === "") {
        requiredNameE.classList.remove('d-none');
        requiredEmailE.classList.remove('d-none');
        requiredPhoneE.classList.remove('d-none');
    } else {
        closeNewContact()
    }
}