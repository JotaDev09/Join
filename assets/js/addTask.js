let selecContacts = false;
let selecCategory = false;

let tasks = [];


/**
 * necessary functions init AddTask
 */
async function initAddTask() {
    includeHTML();
    await loadUsers();
    await getContacts();
}

/**
 * Create a new Task
 */
async function createATask() {
    let taskTitle = document.getElementById('inputTitleTask');
    let taskDate = document.getElementById('inputCalendarAddTask');
    let taskDescription = document.getElementById('addTaskDescription');
    let taskSubTask = document.getElementById('addTaskSubTask');

    let newTask = {
        title: taskTitle.value,
        date: taskDate.value,
        description: taskDescription.value,
        subTask: taskSubTask.value
    };

    tasks.push(newTask);
    await backend.setItem('tasks', JSON.stringify(tasks));

    clearTask()
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

function checkContactTask(id, i) {
    let checkbox = document.getElementById(id);
    checkbox.checked = !checkbox.checked;
    checkboxContact(id, i)
}

function checkboxContact(checboxId, i) {
    let checkbox = document.getElementById(checboxId);
    let userIndex = tasks.assignedTo.findIndex(u => u.name == contacts[i].name);
    if (checkbox.checked) {
        if (userIndex === -1) {
            tasks.assignedTo.push(contacts[i]);
            numberAssingendUser++;
        }
    } else if (userIndex !== -1) {
        tasks.assignedTo.splice(userIndex, 1);
        numberAssingendUser--;
    }
    renderContactNumber();
}

function renderContactNumber() {
    let contactNumber = document.getElementById('assignedContacts');
    switch (numberAssingendUser) {
        case 0:
            contactNumber.innerHTML = `Select contacts to assign`;
            break;
        case 1:
            contactNumber.innerHTML = `${numberAssingendUser} contact assigned`;
            break;
        default:
            contactNumber.innerHTML = `${numberAssingendUser} contacts assigned`;
    }

}

async function getContacts() {
    contacts = JSON.parse(backend.getItem('contacts')) || [];
    if (contacts.length > 0) {
        sortContactsByInitialLetter(contacts)
    }
}

function sortContactsByInitialLetter(contacts) {
    const sortedContacts = {};
    for (let i = 65; i <= 90; i++) {
        const letter = String.fromCharCode(i);
        sortedContacts[letter] = [];
    }

    contacts.forEach(function (contact) {
        if (contact && contact.name) {
            const initialLetter = contact.name.charAt(0).toUpperCase();
            sortedContacts[initialLetter].push(contact);
        }
    });

    return sortedContacts;
}

function generateContactAddTask(contactsByLetter, contact, i) {
    const groupedContacts = {};

    contactsByLetter.forEach(contact => {
        const initialName = contact.name.charAt(0).toUpperCase();

        if (!groupedContacts[initialName]) {
            groupedContacts[initialName] = [];
        }
        groupedContacts[initialName].push(contact);

    });

    let html = '';
    for (let initial in groupedContacts) {
        if (Array.isArray(groupedContacts[initial])) {
            html += `
            ${groupedContacts[initial].map(contact => `
    <div class="add_task_contacts_list row-center">
        <a class="add_task_contact_name font400">${contact.name}</a>
        <input type="checkbox" id="checkboxAssignedTo${i + 1}" class="add_task_contacts_check" onclick="checkContactTask(checkboxAssignedTo${i + 1}', ${i})">
    </div>
    `).join('')}
    `

        }
        return html;
    }
}

document.addEventListener('DOMContentLoaded', async function (event) {
    await initAddTask()
    const contactsTask = document.getElementById('contactsList');
    const sortedContacts = sortContactsByInitialLetter(contacts);

    for (let letter in sortedContacts) {
        const contactsByLetter = sortedContacts[letter];
        if (contactsByLetter.length > 0) {
            const html = generateContactAddTask(contactsByLetter);
            contactsTask.innerHTML += html;
        }
    }
});


async function createNewContactTask() {
    let emailContactTask = document.getElementById('addTaskNewContact');
    let newContact = {
        email: emailContactTask.value,
    };
    contacts.push(newContact);
    await backend.setItem('contacts', JSON.stringify(contacts));

    addContactToHTML();
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

/**
 * expand Category Menu in AddTask
 */
function expandCategory() {
    if (selecCategory) {
        document.getElementById('categoryList').classList.add('d-none');
        document.getElementById('selecCategoryCont').style =
            "height: 70px; overflox: inherit"
        selecCategory = false;
    } else {
        document.getElementById('categoryList').classList.remove('d-none');
        document.getElementById('selecCategoryCont').style =
            "height: 204px; overflow: auto"
        selecCategory = true;
    }
}

/**
 * write a new Category in AddTask
 */
function createdNewCategory() {
    document.getElementById('selecCategoryCont').classList.add('d-none');
    document.getElementById('addTaskNewCategory').classList.remove('d-none');
    document.getElementById('newCategoryCont').classList.remove('d-none');
}

/**
 * close write a new Category in AddTask
 */
function cancelNewCategory() {
    document.getElementById('selecCategoryCont').classList.remove('d-none');
    document.getElementById('addTaskNewCategory').classList.add('d-none');
    document.getElementById('newCategoryCont').classList.add('d-none');
}

/**
 * clear the inputs of the AddTask
 */
function clearTask() {
    document.getElementById('inputTitleTask').value = "";
    document.getElementById('inputCalendarAddTask').value = "";
    document.getElementById('addTaskDescription').value = "";
    document.getElementById('addTaskSubTask').value = "";
}