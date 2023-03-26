let selecContacts = false


/**
 * necessary functions init AddTask
 */
async function initAddTask() {
    includeHTML();
    await loadUsers();
}

/**
 * expand Contacts Menu in AddTask
 */
function expandMenu() {
    if (selecContacts) {
        document.getElementById('contactsList').classList.add('d-none');
        document.getElementById('assignedContactcont').style = 
        "height: 51px; overflox: inherit"
        selecContacts = false;
    } else {
        document.getElementById('contactsList').classList.remove('d-none');
        document.getElementById('assignedContactcont').style = 
        "height: 204px; overflow: auto"
        selecContacts = true;
    }
}

/**
 * write a new Contact in AddTask
 */
function assignedNewContact() {
    document.getElementById('assignedContactcont').classList.add('d-none');
    document.getElementById('addTaskNewContact').classList.remove('d-none');
    document.getElementById('newContactCont').classList.remove('d-none');
}

/**
 * close write a new Contact in AddTask
 */
function cancelNewContact() {
    document.getElementById('assignedContactcont').classList.remove('d-none');
    document.getElementById('addTaskNewContact').classList.add('d-none');
    document.getElementById('newContactCont').classList.add('d-none');
}