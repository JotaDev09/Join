let contacts = [];

/**
 * necessary functions in Contacts
 */
async function initContacts() {
  includeHTML();
  await loadContacts();
}

async function loadContacts() {
  contacts = JSON.parse(backend.getItem("contacts")) || [];

  if (contacts.length > 0) {
    sortContactsByInitialLetter(contacts);
  }
}

/**
 * ensure that all page content has been loaded before the code is executed
 */
document.addEventListener("DOMContentLoaded", async function (event) {
  await initContacts();
  const contactsColumn = document.getElementById("contactsColumn");
  const sortedContacts = sortContactsByInitialLetter(contacts);

  for (let letter in sortedContacts) {
    const contactsByLetter = sortedContacts[letter];
    if (contactsByLetter.length > 0) {
      const html = createContactsByLetterHTML(contactsByLetter);
      contactsColumn.innerHTML += html;
    }
  }
});

/**
 * the function sort the contacts by initial letter
 *
 * @param {contacts} - take the info from the array contacts
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
 * the function create the contact by initial letter and the template for the contact list
 *
 * @param {contacts} - take the info of the contacts
 * @param {contactsByLetter} - take the contacts by inital leter
 */
function createContactsByLetterHTML(contactsByLetter, contact) {
  const groupedContacts = {};

  contactsByLetter.forEach((contact) => {
    const initialName = contact.name.charAt(0).toUpperCase();

    if (!groupedContacts[initialName]) {
      groupedContacts[initialName] = [];
    }
    groupedContacts[initialName].push(contact);
  });

  let html = "";
  for (let initial in groupedContacts) {
    if (Array.isArray(groupedContacts[initial])) {
      html += `
          <div class="contacts_alphabet column-center-center">
            <a class="contacts_alphabet_leters font400" id="initialsSmallCard">${initial}</a>
          </div>
          <div class="contacts_separated_line column-flex-start">
            <span class="contacts_grau_line"></span>
          </div>
          <div class="contacts_list_container" onclick="showContact(event)" data-id="${contact}">
            ${groupedContacts[initial]
              .map(
                (contact) => `
              <div class="contacts_list row-center">
                <div class="">
                  <div class="contacts_circle">
                    <a class="contacts_circle_in row-center-center font400 contact-initial-background" style="background-color: ${
                      contact.color
                    };">${contact.name.charAt(0).toUpperCase()}${contact.name
                  .split(" ")[1]
                  .charAt(0)
                  .toUpperCase()}</a> 
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
  }
  return html;

  const contactInitialBackgrounds = document.querySelectorAll(
    ".contact-initial-background"
  );
  contactInitialBackgrounds.forEach((contactInitialBackground) => {
    const randomColor = getRandomColor();
    contactInitialBackground.style.backgroundColor = randomColor;
  });
}

function showContact(event) {
  const contactId = event.target.dataset.id;
  const contact = contacts.find((c) => c.id === contactId);
  const bigCardContact = renderBigCardContact(contact);
  document.getElementById("bigContactCard").innerHTML = bigCardContact;
}

function renderBigCardContact(contact) {
  const contactName = contact.name;
  const contactEmail = contact.email;
  const contactPhone = contact.phone;
  const contactColor = contact.color;
  return /*html*/ `
    <div class="contacts_display_name row-center">
        <div class="contacts_init_circle row-center-center" style="background-color: ${contactColor}">
            <a class="contacts_initials font400">${contactName
              .charAt(0)
              .toUpperCase()}${contactName
    .split(" ")[1]
    .charAt(0)
    .toUpperCase()}</a>
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
        <a class="contacts_subtitle_text font400">Contact Information</a>
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

/**
 * info required of a new contact
 */
function requiredNewContact() {
  let newName = document.getElementById("newContactName");
  let newEmail = document.getElementById("newContactEmail");
  let newPhone = document.getElementById("newContactPhone");
  let requiredName = document.getElementById("newFieldRequiredName");
  let requiredEmail = document.getElementById("newFieldRequiredEmail");
  let requiredPhone = document.getElementById("newFieldRequiredPhone");

  if (newName.value === "") {
    requiredName.classList.remove("d-none");
  } else if (newEmail.value === "") {
    requiredEmail.classList.remove("d-none");
  } else if (newPhone === "") {
    requiredPhone.classList.remove("d-none");
  } else {
    createNewContact();
  }
}

/**
 * create a new contact
 */
async function createNewContact() {
  let nameContact = document.getElementById("newContactName");
  let emailContact = document.getElementById("newContactEmail");
  let phoneContact = document.getElementById("newContactPhone");
  let newContact = {
    id: uuidv4(),
    name: nameContact.value,
    email: emailContact.value,
    phone: phoneContact.value,
    color: getRandomColor(),
  };

  const users = await loadUsers();

  const currentUser = users.find((user) => user.id === currentUserId);

  if (currentUser) {
    currentUser.contacts.push(newContact);

    const updatedUsers = users.map((user) =>
      user.id === currentUser.id ? currentUser : user
    );

    await backend.setItem("users", JSON.stringify(updatedUsers));
    addContactToHTML();
    closeNewContact();
  } else {
    console.error("Current user not found.");
  }
}

/**
 * add the new contact to the HTML
 */
function addContactToHTML() {
  const contactsColumn = document.getElementById("contactsColumn");
  const sortedContacts = sortContactsByInitialLetter(contacts);

  contactsColumn.innerHTML = "";
  for (let letter in sortedContacts) {
    const contactsByLetter = sortedContacts[letter];
    if (contactsByLetter.length > 0) {
      const html = createContactsByLetterHTML(contactsByLetter);
      contactsColumn.innerHTML += html;
    }
  }
}

/**
 * function to create random colors for the contacts
 */
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function editContact() {
  let editName = "";
  let contactEmail = "";
  let contactPhone = "";
  let contactColor = "";
  for (let i = 0; i < contacts.length; i++) {
    editName = contacts[i].name;
    contactEmail = contacts[i].email;
    contactPhone = contacts[i].phone;
    contactColor = contacts[i].color;
  }
  editName = document.getElementById("editContactName").value;
  let editEmail = document.getElementById("editContactEmail");
  let editPhone = document.getElementById("editContactPhone");
  let requiredNameE = document.getElementById("editFieldRequiredName");
  let requiredEmailE = document.getElementById("editFieldRequiredEmail");
  let requiredPhoneE = document.getElementById("editFieldRequiredPhone");

  if (editName.value === "") {
    requiredNameE.classList.remove("d-none");
  } else if (editEmail.value === "") {
    requiredEmailE.classList.remove("d-none");
  } else if (editPhone === "") {
    requiredPhoneE.classList.remove("d-none");
  } else {
    closeEditContact();
  }
}

/**
 * open new contact pop-up
 */
function openNewContact() {
  document.getElementById("newContactPop").classList.remove("slide-left");
  document.getElementById("newContactPop").classList.add("slide-right");
  document
    .getElementById("newContactPopUp")
    .classList.add("background_white_transp");
}

/**
 * close new contact pop-up
 */
function closeNewContact() {
  document.getElementById("newContactPop").classList.add("slide-left");
  document.getElementById("newContactPop").classList.remove("slide-right");
  document.getElementById("contactCreated").classList.remove("d-none");
  document.getElementById("newContactName").value = "";
  document.getElementById("newContactEmail").value = "";
  document.getElementById("newContactPhone").value = "";
  createContactPopup();
}

/**
 * show contact created pop-up
 */
function createContactPopup() {
  document.getElementById("contactCreated").style =
    "transform: translateY(-557%); transition-duration: 0.5s";
  popUpCreateContact = setInterval(hiddeContactPopUp, 1500);
}

/**
 * hidde contact created pop-up
 */
function hiddeContactPopUp() {
  document
    .getElementById("newContactPopUp")
    .classList.remove("background_white_transp");
  document.getElementById("contactCreated").style =
    "display: none !important; transform: translateY(110%); transition-duration: 0.1s";
}

/**
 * open edit contact pop-up
 */
function openEditContact() {
  document.getElementById("editContactPop").classList.remove("slide-left");
  document.getElementById("editContactPop").classList.add("slide-right");
  document
    .getElementById("editContactPopUp")
    .classList.add("background_white_transp");
  editContact();
}

/**
 * close edit contact pop-up
 */
function closeEditContact() {
  document.getElementById("editContactPop").classList.add("slide-left");
  document.getElementById("editContactPop").classList.remove("slide-right");
  document
    .getElementById("editContactPopUp")
    .classList.remove("background_white_transp");
}

/**
 * empty new contact pop-up
 */
function cancelNewContact() {
  document.getElementById("newContactName").value = "";
  document.getElementById("newContactEmail").value = "";
  document.getElementById("newContactPhone").value = "";
}
