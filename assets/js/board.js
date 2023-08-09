let tasks = []

let currentDraggedElement;

async function initBoard() {
    includeHTML();
    await loadUsers();
    await loadTasksFromServer();
    await getContactsBoard();
    await loadCategories();
    await loadTasksFromServer();
    loadTasksColumns();

}
async function loadCategories() {
    await downloadFromServer();
    categoryList = JSON.parse(backend.getItem('categoryList')) || [];
}

async function getContactsBoard() {
    await downloadFromServer();
    contacts = JSON.parse(backend.getItem('contacts')) || [];
}

function loadTasksColumns() {
    let todo = tasks.filter(t => t['column'] == 'todo');
    document.getElementById('todoColumn').innerHTML = '';

    for (let index = 0; index < todo.length; index++) {
        const element = todo[index];
        document.getElementById('todoColumn').innerHTML += generateTodoHTML(element)
    };

    let progress = tasks.filter(t => t['column'] == 'progress');
    document.getElementById('InProgressColumn').innerHTML = '';

    for (let index = 0; index < progress.length; index++) {
        const element = progress[index];
        document.getElementById('InProgressColumn').innerHTML += generateTodoHTML(element)
    };

    let feedback = tasks.filter(t => t['column'] == 'feedback');
    document.getElementById('feedbackColumn').innerHTML = '';

    for (let index = 0; index < feedback.length; index++) {
        const element = feedback[index];
        document.getElementById('feedbackColumn').innerHTML += generateTodoHTML(element)
    };

    let done = tasks.filter(t => t['column'] == 'done');
    document.getElementById('DoneColumn').innerHTML = '';

    for (let index = 0; index < done.length; index++) {
        const element = done[index];
        document.getElementById('DoneColumn').innerHTML += generateTodoHTML(element)
    };
}

function startDragging(id) {
    currentDraggedElement = id;
}

function generateTodoHTML(element) {
    
    return `
    <div class="minitask_container column-center-center" draggable="true" ondragstart="startDragging(${element['id']})">
        <div class="minitask column-flex-start">
            <div class="minitask_title_cont column-flex-start" style="background:${element['category']['color']}">
                <a class="minitask_title font400">${element['category']['name']}</a>
            </div>
            <div class="minitask_description_cont column-flex-start">
                <a class="minitask_descr_title font400">${element['title']}</a>
                <a class="minitask_descr_text font400">${element['description']}</a>
            </div>
            <div class="minitask_subtask row-center-center">
                <div class="minitask_sub_bar"></div>
                <a class="minitask_sub_text font400">1/2 Done</a>
            </div>
            <div class="minitask_buttom_cont row-center-center">
                <div class="minitask_contacts_cont row-center-center">
                    <div class="minitask_contact column-center-center" style="background:${contacts.color}">
                        <a class="minitask_contact_text font400">${element['contacts']['name']}</a>
                    </div>
                </div>
                <div class="minitask_prio_cont row-center-center">
                    <img src="" class="minitask_prio">
                </div>
            </div>
        </div>
    </div>`
}

function allowDrop(ev) {
    ev.preventDefault()
}

function moveTo(column) {
    tasks[currentDraggedElement]['column'] = column;
    loadTasksColumns();
}

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
    clearTask();
    resetColors;
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