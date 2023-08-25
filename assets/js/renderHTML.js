//Render Add Task HTML

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
                    <input class="Duedate_input font400" placeholder="dd/mm/yyyy" type="date" id="inputCalendarAddTask"
                        onclick="writeDate()">
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
                        <a class="add_task_subtitle font400">Select task category</a>
                        <img src="assets/img/contactsArrow.svg" class="add_task_contacts_arrow">
                    </div>
                    <div class="category_hidden_cont column-flex-start d-none" id="categoryList">
                        <div class="contacts_choose_cont row-center" onclick="createdNewCategory()">
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
                        id="addTaskSubTask">
                    <img src="assets/img/plusBlue.svg" class="plus_blue_img" onclick="subTaskGenerate()">
                </div>
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

function editTaskContainer(taskData) {
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
                    <input class="add_task_input font400" placeholder="${taskData.title}" id="inputTitleTask"
                        onclick="writeTitle()"></input>
                </div>
                <a class="field_required" id="titleRequired">This field is required</a>
            </div>
            <div class="add_task_description_cont column-flex-start">
                <a class="add_task_titles font400">Description</a>
                <textarea class="add_task_descript_input row-flexstart font400" placeholder="${taskData.description}"
                    id="addTaskDescription" onclick="writeDescription()"></textarea>
                <a class="field_required" id="descriptionRequired">This field is required</a>
            </div>
            <div class="add_task_dueDate_cont column-flex-start">
                <a class="add_task_titles font400">Due date</a>
                <div class="add_task_Duedate_input row-center">
                
                <input class="Duedate_input font400" value="${taskData.dueDate}" type="date" id="inputCalendarAddTask" onclick="writeDate()">
                </div>
                <a class="field_required" id="dateRequired">This field is required</a>
            </div>
            <div class="add_task_prio_cont column-flex-start">
                <a class="add_task_titles font400">Priority</a>
                <div class="add_task_prio_cont_buttons row-center-center">
                    <div class="add_task_prio_buttons row-center-center urgent_hover " id="addTaskPrioUrgent"
                        onclick="choosePrioEdit(this)">
                        <a class="prio_buttons_text font400" id="addTaskPrioUrgentA">Urgent</a>
                        <img class="prio_buttons_img" id="addTaskPrioUrgentImg" src="assets/img/PrioAlta.svg">
                    </div>
                    <div class="add_task_prio_buttons row-center-center urgent_medium" id="addTaskPrioMedium"
                        onclick="choosePrioEdit(this)">
                        <a class="prio_buttons_text font400" id="addTaskPrioMediumA">Medium</a>
                        <img class="prio_buttons_img" id="addTaskPrioMediumImg" src="assets/img/PrioMedia.svg">
                    </div>
                    <div class="add_task_prio_buttons row-center-center urgent_low" id="addTaskPrioLow"
                        onclick="choosePrioEdit(this)">
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
                        <a class="add_task_subtitle font400">Select task category</a>
                        <img src="assets/img/contactsArrow.svg" class="add_task_contacts_arrow">
                    </div>
                    <div class="category_hidden_cont column-flex-start d-none" id="categoryList">
                        <div class="contacts_choose_cont row-center" onclick="createdNewCategory()">
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
                        id="addTaskSubTask${index}">
                    <img src="assets/img/plusBlue.svg" class="plus_blue_img" onclick="subTaskGenerate()">
                </div>
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
       </div>
       </div>
  `;
}
