/**
 * The function renders the contacts in alphabetical order in a column
 *
 * @param {displayName} - displays the name of the contact
 * @param {contacts} - take the info from the array contacts
 */
function renderColumnContacts(displayName, contacts) {
  return `
      <div class="contacts_alphabet column-center-center">
        <a class="contacts_alphabet_leters font400" id="initialsSmallCard">${displayName}</a>
      </div>
      <div class="contacts_separated_line column-flex-start">
        <span class="contacts_grau_line"></span>
      </div>
      <div class="contacts_list_container">
        ${contacts
          .map(
            (contact) => `
              <div class="contacts_list row-center" onclick="showContact('${
                contact.id
              }')" data-id="${contact.id}">
                <div class="">
                  <div class="contacts_circle">
                    <a class="contacts_circle_in row-center-center font400 contact-initial-background" style="background-color: ${
                      contact.color
                    };">${getInitials(contact.name)}</a> 
                  </div>
                </div>
                <div class="contact_container_info column-flex-start">
                  <a class="contact_name_info font400" id="smallContactName">${
                    contact.name
                  }</a> 
                  <a class="contact_mail_info font400" id="smallContactPhone">${
                    contact.email
                  }</a> 
                </div>
              </div>
            `
          )
          .join("")}
      </div>
    `;
}

/**
 * The function renders a large card for a specific contact
 *
 * @param {contactName} - displays the name of the contact
 * @param {contactEmail} - displays the email of the contact
 * @param {contactPhone} - displays the phone of the contact
 * @param {contactColor} - displays the color of the contact
 */
function renderBigCard(contactName, contactEmail, contactPhone, contactColor) {
  return `
      <div class="contacts_display_name row-center">
          <div class="contacts_init_circle row-center-center" style="background-color: ${contactColor}">
          <a class="contacts_initials font400">${contactName
            .charAt(0)
            .toUpperCase()}${
    contactName.includes(" ")
      ? contactName.split(" ")[1].charAt(0).toUpperCase()
      : ""
  }</a>
          </div>
          <div class="contacts_name_cont column-flex-start">
            <div class="contacts_name column-flex-start">
              <a class="contactsName font400" id="editName">${contactName}</a>
            </div>
            <div class="contacts_addTask_cont row-center-center" onclick="createTaskPU()">
              <img src="assets/img/plusBlue.svg" class="contacts_plusBlue">
              <a class="contacts_addTask_text font400">Add Task</a>
            </div>
          </div>
      </div>
      <div class="contacts_subtitle_cont row-center">
          <div class="contacts_editContact_cont row-center-flexend" onclick="openEditContact()">
              <img src="assets/img/bluePencil.svg" class="contacts_bluePencil">
              <a class="contacts_editContact_text font400">Edit Contact</a>
          </div>
      </div>
      <div class="contacts_info_cont column-flex-start">
          <div class="contacts_info column-flex-start">
              <a class="contacts_info_subt font400">Email</a>
              <a type="number" class="contacts_info_info font400">${contactEmail}</a>
          </div>
          <div class="contacts_info column-flex-start">
              <a class="contacts_info_subt font400">Movil</a>
              <a type="number" class="contacts_info_info font400">${contactPhone}</a>
          </div>
      </div>`;
}

/*
 * The function renders the add Task container
 */
function addTaskContainer() {
  return `
            <img
            class="add_task_popUp_close_PU"
            src="assets/img/closePopCreate.svg"
            onclick="closePopUpCreate()"
          />
            <div class="add_task_title column-flex-start">
                <div class="add_task_title_cont row-center">
                    <input class="add_task_input font400" placeholder="Enter a title" id="inputTitleTask"
                        onclick="writeTitle()"></input>
                </div>
                <a class="field_required" id="titleRequired">This field is required</a>
            </div>
            <div class="add_task_description_cont column-flex-start">
                <a class="add_task_titles font400">Description</a>
                <textarea class="add_task_descript_input row-flexstart font400" placeholder="Enter a Description"
                    id="addTaskDescription" onclick="writeDescription()"></textarea>
                <a class="field_required" id="descriptionRequired">This field is required</a>
            </div>
            <div class="add_task_dueDate_cont column-flex-start">
                <a class="add_task_titles font400">Due date</a>
                <div class="add_task_Duedate_input row-center">
                <input class="Duedate_input font400" placeholder="YYYY-MM-DD" type="date" id="inputCalendarAddTask" onclick="writeDate()">
                </div>
                <a class="field_required" id="dateRequired">This field is required</a>
            </div>
            <div class="add_task_prio_cont column-flex-start">
                <a class="add_task_titles font400">Priority</a>
                <div class="add_task_prio_cont_buttons row-center-center">
                    <div class="add_task_prio_buttons row-center-center urgent_hover" id="addTaskPrioUrgent"
                        onclick="choosePrio(this)">
                        <a class="prio_buttons_text font400" id="addTaskPrioUrgentA">Urgent</a>
                        <img class="prio_buttons_img" id="addTaskPrioUrgentImg" src="assets/img/PrioAlta.svg">
                    </div>
                    <div class="add_task_prio_buttons row-center-center urgent_medium" id="addTaskPrioMedium"
                        onclick="choosePrio(this)">
                        <a class="prio_buttons_text font400" id="addTaskPrioMediumA">Medium</a>
                        <img class="prio_buttons_img" id="addTaskPrioMediumImg" src="assets/img/PrioMedia.svg">
                    </div>
                    <div class="add_task_prio_buttons row-center-center urgent_low" id="addTaskPrioLow"
                        onclick="choosePrio(this)">
                        <a class="prio_buttons_text font400" id="addTaskPrioLowA">Low</a>
                        <img class="prio_buttons_img" id="addTaskPrioLowImg" src="assets/img/PrioBaja.svg">
                    </div>
                </div>
            </div>
            <div class="add_task_contacts_cont column-flex-start" id="assignedContactcont">
                <a class="add_task_titles font400">Assigned to</a>
                <div class="add_task_contacts column-flex-start" id="containerContacts">
                    <div class="contacts_img_cont row-center" onclick="expandMenu()" id="selecContacts">
                        <a class="add_task_subtitle font400" id="assignedContacts">Select contacts to assign</a>
                        <img src="assets/img/contactsArrow.svg" class="add_task_contacts_arrow">
                    </div>
                    <div class="contacts_hidden_cont column-flex-start d-none" id="contactsList">
                        
                    </div>
                </div>
            </div>
            <div class="new_contact_cont row-center d-none" id="newContactCont">
                <div>
                    <input class="new_contact_input row-center font400" id="addTaskNewContact"
                        placeholder="Contact email"></input>
                </div>
                <div class="new_contact_input_icons row-center-center">
                    <img src="assets/img/cancelBlue.svg" onclick="cancelNewContactTask()">
                    <img src="assets/img/grauLineSmall.svg">
                    <img src="assets/img/blueCheck.svg" onclick="createNewContactTask()">
                </div>
            </div>
            <div class="add_task_category_cont column-flex-start" id="selecCategoryCont">
                <a class="add_task_titles font400">Category</a>
                <div class="add_task_select_cat column-flex-start" id="categoryContacts">
                    <div class="add_task_selectCat row-center" onclick="expandCategory()" id="selecCategory">
                        <a class="add_task_subtitle font400" id="selectTaskCategory">Select task category</a>
                        <img src="assets/img/contactsArrow.svg" class="add_task_contacts_arrow">
                    </div>
                    <div class="category_hidden_cont column-flex-start d-none" id="categoryList">
                        <div class="contacts_choose_cont row-center" id="contactsChooseCont" onclick="createdNewCategory()">
                            <a class="add_task_subtitle font400">New category</a>
                        </div>
                        <div class="new_category_container" id="newCategoryContainer"></div>
                    </div>
                </div>
            </div>
            <div class="new_contact_container column-flex-start d-none" id="newCategoryCont">
            </div>
            <div class="add_task_subtasks_cont column-flex-start">
                <a class="add_task_titles font400">Subtasks</a>
                <div class="subtasks_cont_input_img row-center">
                    <input class="add_task_subtasks_input row-center font400" placeholder="Add new subtask"
                        id="addTaskSubTask" onclick="subTaskRequired()">
                    <img src="assets/img/plusBlue.svg" class="plus_blue_img" onclick="subTaskGenerate()">
                </div>
                <a class="field_required" id="subTaskRequired">This field is required</a>
            </div>
            <div class="subTaskContainer column-flex-start" id="subTaskContainer"></div>
            <div class="add_task_buttons_bottom_resp row-center-center" id="adddTaskButtonsResp">
                <button class="add_task_buttons_clear row-center-center" onclick="clearTask()">
                    <a class="add_task_clear_text font400">Clear X</a>
                </button>
                <button class="add_task_buttons_create row-center-center" onclick="createATask()">
                    <a class="add_task_create_text font400">Create Task</a>
                    <img src="assets/img/checkCreateT.svg" class="">
                </button>
            </div>
       
  `;
}

/**
 * the function generates the columns with the tasks
 * * @param {task} - take the tasks from the backend
 */
function generateColumnsHTML(task) {
  const contactHtml = task.contacts
    .map((contact, index) => generateContactHTML(contact, index))
    .join("");

  const subtaskCount = task.subTask.length; // Total number of subtasks
  const completedSubtasks = task.subTask.filter(
    (subtask) => subtask.completed
  ).length;

  const progressPercentage = (completedSubtasks / subtaskCount) * 100;
  const progressBarStyle = `
    --progress: ${progressPercentage}%;
    background: linear-gradient(to right, #0038FF 0%, #0038FF calc(${progressPercentage}% - 4px), #F4F4F4 calc(${progressPercentage}% - 4px), #F4F4F4 100%);
  `;
  const progressText = `${completedSubtasks}/${subtaskCount} Done`;

  const priorityImagePath = prioInBoardImg(task.prio);

  return `
    <div class="minitask_container column-center-center" draggable="true" ondragstart="startDragging('${
      task.id
    }')" onclick="openTask(this)" data-task='${JSON.stringify(task)}'>
      <div class="minitask column-flex-start">
        <div class="minitask_title_cont column-flex-start" style="background:${
          task.category.color
        }">
          <a class="minitask_title font400">${task["category"]["name"]}</a>
        </div>
        <div class="minitask_description_cont column-flex-start">
          <a class="minitask_descr_title font400">${task["title"]}</a>
          <a class="minitask_descr_text font400">${task["description"]}</a>
        </div>
        <div class="minitask_subtask row-center-center">
                <div class="minitask_sub_bar" style="width: ${progressBarStyle}%;"></div>
                <a class="minitask_sub_text font400">${progressText}</a>
            </div>
        <div class="minitask_buttom_cont row-center-center">
          <div class="minitask_contacts_cont row-center">${contactHtml}</div>
          <div class="minitask_prio_cont row-center-center">
            <img src="${priorityImagePath}" class="minitask_prio" id="boardPrioIcon">
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * the function generates the initials of the contacts
 * * @param {contact} - take the contacts from the backend
 * * @param {index} - take the index of the contact
 */
function generateContactHTML(contact, index) {
  return `
    <div class="minitask_contact column-center-center" style="background:${
      contact.color
    }; left:${index * 20}px;">
      <a class="minitask_contact_text row-center-center font400">${getInitials(
        contact.name || contact.email
      )}</a>
    </div>
  `;
}

/**
 * the function generates the initials of the contacts for the view task
 * * @param {taskData} - take the tasks from the backend
 */
function viewInitials(taskData) {
  const viewTaskInitials = taskData.contacts
    .map(
      (contact, index) => `
    <div class="view_task_contacts_container">
      <div class="view_task_contact_circle center-center" style="background:${
        contact.color
      }">
        <a class="view_task_contact_initials font400 row-center-center">${getInitials(
          contact.name || contact.email
        )}</a>
      </div>
      <a class="view_task_contact_name font400">${
        contact.name || contact.email
      }</a>
    </div>
`
    )
    .join("");
  return viewTaskInitials;
}

/**
 * the function generates the html with the info of the contact
 *  *
 * @param {contacts} - take the info from the contacts
 */
function generateContactsHtml(contacts) {
  let html = "";

  contacts.forEach((contact, index) => {
    html += `
      <div class="add_task_contacts_list row-center" id="contactContainer${index}">
        <a class="add_task_contact_name font400" id="addUserTask${index}">${
      contact.name || contact.email
    }</a>
    <input type="checkbox" class="add_task_contacts_check" id="checkContact${index}" data-contact-index="${index}" data-contact-id="${
      contact.id
    }" ${contact.check ? "checked" : ""} >
      </div>
    `;
  });

  return html;
}

/**
 * the function generates the html to add a new contact from addTask
 */
function generateInviteNewContactHtml() {
  return `
    <div class="contacts_choose_cont row-center" onclick="assignedNewContact()">
      <a class="add_task_subtitle font400">Invite new contact</a>
      <img src="assets/img/newContactBlue.svg" class="add_task_new_contact" >
    </div>
  `;
}

/**
 * the function generates the html with the new name of the category
 */
function newCategoryName() {
  return `
        <div class="new_contact_cont row-center">
            <input class="new_contact_input row-center font400" id="addTaskNewCategory" 
            placeholder="New category name"></input>
            <div class="new_contact_input_icons row-center-center">
                <img src="assets/img/cancelBlue.svg" onclick="cancelNewCategory()">
                <img src="assets/img/grauLineSmall.svg">
                <img src="assets/img/blueCheck.svg" onclick="createNewCategoryTask()">
            </div>
        </div>
        <div class="new_category_colors row-center" id="colorsContainer"></div>
    `;
}

/**
 * the function generates the html with the new color for the new category
 */
function newCategoryColors(colorCategory) {
  return `
        <div class="new_category_select_color row-center">
            <button class="new_category_circle" style="background:${colorCategory}" onclick="selectCategoryColor('${colorCategory}')"></button>
        </div>
    `;
}

/**
 * The function generates the edit Task container
 *
 * @param {taskData} - take the info from the task
 * @param {index} - take the index of the task
 **/
function editTaskContainer(taskData, index) {
  return `
    <div class="edit_task_container ">
      <div class="edit_task_contain column-center-center">
            <img
            class="add_task_popUp_close_PU"
            src="assets/img/closePopCreate.svg"
            onclick="closePopUpEdit()"
          />
            <div class="add_task_title column-flex-start">
                <div class="add_task_title_cont row-center">
                    <input class="add_task_input font400" value="${taskData.title}" id="editTitleTask"
                        onclick="writeTitle()"></input>
                </div>
                <a class="field_required" id="titleRequired">This field is required</a>
            </div>
            <div class="add_task_description_cont column-flex-start">
                <a class="add_task_titles font400">Description</a>
                <textarea class="add_task_descript_input row-flexstart font400" placeholder=""
                    id="editTaskDescription" onclick="writeDescription()">${taskData.description}</textarea>
                <a class="field_required" id="descriptionRequired">This field is required</a>
            </div>
            <div class="add_task_dueDate_cont column-flex-start">
                <a class="add_task_titles font400">Due date</a>
                <div class="add_task_Duedate_input row-center">
                
                <input class="Duedate_input font400" value="${taskData.dueDate}" type="date" id="editCalendarTask" onclick="writeDate()">
                </div>
                <a class="field_required" id="dateRequired">This field is required</a>
            </div>
            <div class="add_task_prio_cont column-flex-start">
                <a class="add_task_titles font400">Priority</a>
                <div class="add_task_prio_cont_buttons row-center-center">
                    <div class="add_task_prio_buttons row-center-center urgent_hover " id="addTaskPrioUrgent"
                        onclick="choosePrio(this)">
                        <a class="prio_buttons_text font400" id="addTaskPrioUrgentA">Urgent</a>
                        <img class="prio_buttons_img" id="addTaskPrioUrgentImg" src="assets/img/PrioAlta.svg">
                    </div>
                    <div class="add_task_prio_buttons row-center-center urgent_medium" id="addTaskPrioMedium"
                        onclick="choosePrio(this)">
                        <a class="prio_buttons_text font400" id="addTaskPrioMediumA">Medium</a>
                        <img class="prio_buttons_img" id="addTaskPrioMediumImg" src="assets/img/PrioMedia.svg">
                    </div>
                    <div class="add_task_prio_buttons row-center-center urgent_low" id="addTaskPrioLow"
                        onclick="choosePrio(this)">
                        <a class="prio_buttons_text font400" id="addTaskPrioLowA">Low</a>
                        <img class="prio_buttons_img" id="addTaskPrioLowImg" src="assets/img/PrioBaja.svg">
                    </div>
                </div>
            </div>
            <div class="add_task_contacts_cont column-flex-start" id="assignedContactcont">
                <a class="add_task_titles font400">Assigned to</a>
                <div class="add_task_contacts column-flex-start" id="containerContacts">
                    <div class="contacts_img_cont row-center" onclick="expandMenu()" id="selecContacts">
                        <a class="add_task_subtitle font400" id="assignedContacts">Select contacts to assign</a>
                        <img src="assets/img/contactsArrow.svg" class="add_task_contacts_arrow">
                    </div>
                    <div class="contacts_hidden_cont column-flex-start d-none" id="contactsList"></div>
                </div>
            </div>
            <div class="new_contact_cont row-center d-none" id="newContactCont">
                <div>
                    <input class="new_contact_input row-center font400" id="addTaskNewContact"
                        placeholder="Contact email"></input>
                </div>
                <div class="new_contact_input_icons row-center-center">
                    <img src="assets/img/cancelBlue.svg" onclick="cancelNewContactTask()">
                    <img src="assets/img/grauLineSmall.svg">
                    <img src="assets/img/blueCheck.svg" onclick="createNewContactTask()">
                </div>
            </div>
            <div class="new_contact_container column-flex-start d-none" id="newCategoryCont">
            </div>
            <div class="add_task_subtasks_cont column-flex-start">
                <a class="add_task_titles font400">Subtasks</a>
                <div class="subtasks_cont_input_img row-center">
                    <input class="add_task_subtasks_input row-center font400" placeholder="Add new subtask"
                        id="addTaskSubTask">
                    <img src="assets/img/plusBlue.svg" class="plus_blue_img" onclick="subTaskGenerate()">
                </div>
            </div>
            <div class="subTaskContainer column-flex-start" id="subTaskContainer"></div>
            <div class="add_task_buttons_bottom_ok center-flex-end" id="addTaskButtonsok">
                <button class="add_task_buttons_ok row-center-center" onclick="okEditTask()">
                    <a class="add_task_create_text font400">Ok</a>
                    <img src="assets/img/checkCreateT.svg" class="">
                </button>
            </div>
       </div>
       </div>
  `;
}

/**
 * The function generates the view Task container
 * @param {taskData} - take the info from the task
 */
function viewTask(taskData) {
  const priorityImagePath = prioInBoardImg(taskData.prio);
  const namePrio = prioInBoard(taskData.prio);
  const viewTaskInitials = viewInitials(taskData);
  const viewTaskSubTask = viewSubTask(taskData);

  return `
  <div class="view_task_task column-flex-start">
  <img class="view_task_popUp_close" src="assets/img/closePopCreate.svg" onclick="closeViewTask()">
  <div class="view_task_category center-center" style="background:${
    taskData.category.color
  }">
      <a class="view_task_category_text font400" >${taskData.category.name}</a>
  </div>
  <div class="view_task_category_title column-flex-start">
      <a class="view_task_category_a font400">${taskData.title}</a>
  </div>
  <a class="view_task_description font400">${taskData.description}</a>
  <div class="view_task_due_date row-flexstart">
      <a class="view_task_subtitle font400">Due date:</a>
      <a class="view_task_date font400">${taskData.dueDate}</a>
  </div>
  <div class="view_task_priority row-center">
      <a class="view_task_subtitle font400">Priority:</a>
      <div class="view_task_prio_cont row-center-center">
          <a class="view_task_prio font400">${namePrio}</a>
          <img src="${priorityImagePath}" class="view_task_prio_img">
      </div>
  </div>
  <div class="view_task_contacts_cont column-flex-start">
  <a class="view_task_subtitle font400">Assigned To:</a>
      <div class="view_task_contact column-flex-start">${viewTaskInitials}
      </div>
  </div>
  <div class="view_task_subTasks_cont column-flex-start">
    <a class="view_task_subtitle font400">Subtasks</a>
    <div class="view_task_subTasks column-flex-start">${viewTaskSubTask}</div>
  </div>
  <div class="view_task_edit center-flex-end">
  <div class="view_task_editTask center-center" data-task='${JSON.stringify(
    taskData
  )}' onclick="deleteTask(this)">
      <img src="assets/img/delete.svg" class="view_task">
      <a class="delete_task font400">Delete</a>
    </div>
    <img src="assets/img/Vector 3.svg" class="view_task_edit_line">
    <div class="view_task_editTask center-center" data-task='${JSON.stringify(
      taskData
    )}' onclick="editTask(this)">
      <img src="assets/img/edit.svg" class="view_task">
      <a class="delete_task font400">Edit</a>
    </div>
  </div>
</div>
`;
}
