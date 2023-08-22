//Render Add Task HTML

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
