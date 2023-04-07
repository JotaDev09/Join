let selecContacts = false;
let selecCategory = false;
let selectedButtonId = '';

let task = {
    id: "",
    title: "",
    dueDate: "",
    prio: "",
    description: "",
    subTask: new Array,
};


/**
 * necessary functions init AddTask
 */
async function initAddTask() {
    includeHTML();
    await loadUsers();
    await getContacts();
    await loadTasksFromServer()
}

async function loadTasksFromServer() {
    await downloadFromServer();
    tasks = JSON.parse(backend.getItem('tasks')) || [];
}

/**
 * Create a new Task
 */
async function createATask() {
    await loadTasksFromServer();
    tasks = JSON.parse(await backend.getItem('tasks')) || [];
    tasks.push(task);
    await backend.setItem('tasks', JSON.stringify(tasks));

    clearTask()
}

function addTitle() {
    let taskTitle = document.getElementById('inputTitleTask').value;
    task.title = taskTitle
}

function addDescription() {
    let taskDescription = document.getElementById('addTaskDescription').value;
    task.description = taskDescription;
}

function addDate() {
    let taskDate = document.getElementById('inputCalendarAddTask').value;
    task.dueDate = taskDate;
}

function subTaskGenerate() {
    addSubTask()
}
function addSubTask() {
    let taskSubTask = document.getElementById('addTaskSubTask').value;
    if (taskSubTask) {
        let subTask = {
            title: taskSubTask, status: false
        };
        task.subTask.push(subTask);
        renderSubtask();
    }
    document.getElementById('addTaskSubTask').value = '';
}

function renderSubtask() {
    document.getElementById('subTaskContainer').innerHTML = ``;
    for (let i = 0; i < task.subTask.length; i++) {
        if (!task.subTask[i].status) {
            document.getElementById('subTaskContainer').innerHTML += renderSubTask(i);
        }
    }
}

function renderSubTask(i) {
    return `
    <div class="subtasks_cont_check row-center">
        <input type="checkbox" class="subtasks_checkbox">
        <a class="subtask_text font400">${task.subTask[i].title}</a>
    </div>`
}

/**
 * the function change the colors of the prio buttons
 * 
 * @param {button} - take the info from prio buttons
 */
function choosePrio(button) {
    if (selectedButtonId !== button.id) {
        deselectedButtons(selectedButtonId);
        selectedButtons(button.id);
        selectedButtonId = button.id;
    }
}

/**
 * the function change the colors of the prio buttons to initials colors
 * 
 * @param {selectedButtonId} - take the info from id of the prio buttons
 */
function deselectedButtons(selectedButtonId) {
    switch (selectedButtonId) {
        case 'addTaskPrioUrgent':
            document.getElementById('addTaskPrioUrgent').style.backgroundColor = '#FFFFFF';
            document.getElementById('addTaskPrioUrgentA').style.color = '#000000';
            document.getElementById('addTaskPrioUrgentImg').src = 'assets/img/PrioAlta.svg';
            break;
        case 'addTaskPrioMedium':
            document.getElementById('addTaskPrioMedium').style.backgroundColor = '#FFFFFF';
            document.getElementById('addTaskPrioMediumA').style.color = '#000000';
            document.getElementById('addTaskPrioMediumImg').src = 'assets/img/PrioMedia.svg';
            break;
        case 'addTaskPrioLow':
            document.getElementById('addTaskPrioLow').style.backgroundColor = '#FFFFFF';
            document.getElementById('addTaskPrioLowA').style.color = '#000000';
            document.getElementById('addTaskPrioLowImg').src = 'assets/img/PrioBaja.svg';
            break;
        default:
            break;
    }
}

/**
 * the function change the colors of the prio buttons to selected colors
 * 
 * @param {buttonId} - take the info from id of the prio buttons
 */
function selectedButtons(buttonId) {
    switch (buttonId) {
        case 'addTaskPrioUrgent':
            document.getElementById(buttonId).style.backgroundColor = '#FF3D00';
            document.getElementById('addTaskPrioUrgentA').style.color = '#FFFFFF';
            document.getElementById('addTaskPrioUrgentImg').src = 'assets/img/prioAltaWhite.svg';
            task.prio = 'urgent';
            break;
        case 'addTaskPrioMedium':
            document.getElementById(buttonId).style.backgroundColor = '#FFA800';
            document.getElementById('addTaskPrioMediumA').style.color = '#FFFFFF';
            document.getElementById('addTaskPrioMediumImg').src = 'assets/img/prioMediaWhite.svg';
            task.prio = 'medium';
            break;
        case 'addTaskPrioLow':
            document.getElementById(buttonId).style.backgroundColor = '#7AE229';
            document.getElementById('addTaskPrioLowA').style.color = '#FFFFFF';
            document.getElementById('addTaskPrioLowImg').src = 'assets/img/prioBajaWhite.svg';
            task.prio = 'low';
            break;
        default:
            break;
    }
}

/**
 * the function reset the colors with the clearTask
 */
function resetColors() {
    deselectedButtons(selectedButtonId);
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
    let userIndex = task.assignedTo.findIndex(u => u.name == contacts[i].name);
    if (checkbox.checked) {
        if (userIndex === -1) {
            task.assignedTo.push(contacts[i]);
            numberAssingendUser++;
        }
    } else if (userIndex !== -1) {
        task.assignedTo.splice(userIndex, 1);
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

/**
 * the function take the contacts from Server and send them to sort function
 */
async function getContacts() {
    contacts = JSON.parse(backend.getItem('contacts')) || [];
    if (contacts.length > 0) {
        sortContactsByInitialLetter(contacts)
    }
}

/**
 * the function sort the contactos by initial letter
 * 
 * @param {contacts} - take the contactos from the array
 */
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

/**
 * the function do the html element to send the contacts sorted
 * 
 * @param {contactsByLetter} - take the contactos by initial letter
 */
function generateContactAddTask(contactsByLetter, i) {
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

/**
 * the function load the contacts array after DOM
 */
document.addEventListener('DOMContentLoaded', async function (event) {
    await initAddTask();
    subTaskGenerate()
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

/**
 * the function creates a new contact bei new Task
 */
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
    resetColors();
}