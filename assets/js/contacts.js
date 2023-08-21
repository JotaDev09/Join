let contacts = [];

/**
 * necessary functions in Contacts
 */
async function initContacts() {
  includeHTML();
  await Promise.all([loadContacts(), loadUserData(), loadUsers()]);
}

async function loadContacts() {
  const currentUser = loadUserData();

  const contactsColumn = document.getElementById("contactsColumn");
  contactsColumn.innerHTML = ""; // Clear the existing contacts

  const sortedContacts = sortContactsByInitialLetter(currentUser.contacts);

  for (let letter in sortedContacts) {
    const contactsByLetter = sortedContacts[letter];
    if (contactsByLetter.length > 0) {
      const html = createContactsByLetterHTML(contactsByLetter);
      contactsColumn.innerHTML += html;
    }
  }
}
/**
 * the function sort the contacts by initial letter
 *
 * @param {contacts} - take the info from the array contacts
 */
function sortContactsByInitialLetter(contacts) {
  const sortedContacts = {};

  // Initialize all initial letters and "Unnamed" category
  for (let i = 65; i <= 90; i++) {
    const letter = String.fromCharCode(i);
    sortedContacts[letter] = [];
  }
  sortedContacts["#"] = [];

  contacts.forEach(function (contact) {
    const initialLetter = contact.name
      ? contact.name.charAt(0).toUpperCase()
      : contact.email
      ? contact.email.charAt(0).toUpperCase()
      : "#";

    if (sortedContacts[initialLetter]) {
      sortedContacts[initialLetter].push(contact);
    } else {
      sortedContacts["#"].push(contact);
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
function createContactsByLetterHTML(contactsByLetter) {
  const groupedContacts = {};

  contactsByLetter.forEach((c) => {
    const initialName = c.name
      ? c.name.charAt(0).toUpperCase()
      : c.email
      ? c.email.charAt(0).toUpperCase()
      : "#";

    if (!groupedContacts[initialName]) {
      groupedContacts[initialName] = [];
    }
    groupedContacts[initialName].push(c);
  });

  let html = "";
  for (let initial in groupedContacts) {
    if (Array.isArray(groupedContacts[initial])) {
      const displayName = initial === "#" ? "Unnamed Contact" : initial;
      html += `
          <div class="contacts_alphabet column-center-center">
            <a class="contacts_alphabet_leters font400" id="initialsSmallCard">${displayName}</a>
          </div>
          <div class="contacts_separated_line column-flex-start">
            <span class="contacts_grau_line"></span>
          </div>
          <div class="contacts_list_container">
            ${groupedContacts[initial]
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
  }
  return html;
}

function getInitials(name, email) {
  if (name) {
    const words = name.split(" ");
    let initials = "";
    for (const word of words) {
      initials += word.charAt(0).toUpperCase();
    }
    return initials;
  } else if (email) {
    const emailParts = email.split("@");
    if (emailParts.length > 1) {
      const emailInitial = emailParts[0].charAt(0).toUpperCase();
      return emailInitial;
    }
  }

  return ""; // Return an empty string if both name and email are falsy
}

function showContact(contactId) {
  const currentUser = loadUserData();

  const contact = currentUser.contacts.find((c) => c.id === contactId);

  if (contact) {
    const bigCardContact = renderBigCardContact(contact);
    document.getElementById("bigContactCard").innerHTML = bigCardContact;
    document.getElementById("bigCardTitle").style = "display: flex";
  } else {
    console.log("Contact not found.");
  }

  contactsResponsive();
}

function contactsResponsive() {
  if (window.matchMedia("(max-width: 1200px)").matches) {
    document.getElementById("containerBigCard").style =
      "display: flex !important";
  }
}

function closeShowContact() {
  document.getElementById("containerBigCard").style =
    "display: none !important;";
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

  const currentUser = loadUserData(); // Load current user's data
  if (!currentUser.contacts) {
    currentUser.contacts = []; // Initialize contacts array if not exists
  }

  let newContact = {
    id: uuidv4(),
    name: nameContact.value,
    email: emailContact.value,
    phone: phoneContact.value,
    color: getRandomColor(),
    check: false,
  };
  currentUser.contacts.push(newContact);
  saveUserData(currentUser);
  const userIndex = users.findIndex((user) => user.id === currentUser.id);
  if (userIndex !== -1) {
    // Update the user's data in the users array
    users[userIndex] = currentUser;
    await backend.setItem("users", JSON.stringify(users)); // Update the users data in the backend
  }

  addContactToHTML();
  closeNewContact();
  createContactPopup();
}

/**
 * add the new contact to the HTML
 */
function addContactToHTML() {
  const currentUser = loadUserData();
  if (!currentUser) {
    console.log("nope");
    // User is not logged in, handle this case appropriately
    return;
  }
  const contactsColumn = document.getElementById("contactsColumn");
  const sortedContacts = sortContactsByInitialLetter(currentUser.contacts);

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

function editContact(contactId) {
  const currentUser = loadUserData();
  if (!currentUser) {
    console.log("User not logged in.");
    return;
  }
  const editContact = currentUser.contacts.find((c) => c.id === contactId);
  console.log(currentUser.contacts);

  if (editContact) {
    console.log(editContact);
    const editCard = renderEditCardContact(editContact);
    document.getElementById("editContactPopUp").innerHTML = editCard;
  } else {
    console.log("Contact not found.");
  }

  // let requiredNameE = document.getElementById("editFieldRequiredName");
  // let requiredEmailE = document.getElementById("editFieldRequiredEmail");
  // let requiredPhoneE = document.getElementById("editFieldRequiredPhone");

  // if (editName.value === "") {
  //   requiredNameE.classList.remove("d-none");
  // } else if (editEmail.value === "") {
  //   requiredEmailE.classList.remove("d-none");
  // } else if (editPhone === "") {
  //   requiredPhoneE.classList.remove("d-none");
  // } else {
  //   closeEditContact();
  // }
}

function renderEditCardContact(editContact) {
  const editName = editContact.name;
  const editEmail = editContact.email;
  const editPhone = editContact.phone;
  return /*html*/ `
 <div class="newContact_popUp_container slide-left" id="editContactPop">
        <form
          class="newContact_popUp_cont column-center"
          onsubmit="saveEditContact(); return false"
        >
          <div class="new_contact_top column-center">
            <img
              src="assets/img/crossWhite.svg"
              class="new_contact_close"
              onclick="closeEditContact()"
            />
            <img src="assets/img/JoinWhite.svg" class="new_contact_logo" />
            <a class="new_contact_title font400">Edit contact</a>
          </div>
          <div class="new_contact_bottom column-center">
            <div class="new_contact_bottom1">
              <div class="new_contact_circle row-center-center">
                <img
                  src="assets/img/userGrau.svg"
                  class="new_contact_circle_user"
                />
              </div>
            </div>
            <div class="new_contact_bottom2 column-flex-start">
              <div class="new_contact_info_user column-flex-start">
                <div class="new_contact_info row-center">
                  <input
                    type="text"
                    class="newContact_input font400 row-spacebet-center"
                    id="editContactName"
                    value="${editName}"
                  />
                  <img src="assets/img/userSmall.svg" />
                </div>
                <a
                  class="new_contact_required d-none"
                  id="editFieldRequiredName"
                  >This field is required</a
                >
              </div>
              <div class="new_contact_info_user column-flex-start">
                <div class="new_contact_info row-center">
                  <input
                    type="email"
                    class="newContact_input font400 row-spacebet-center"
                    id="editContactEmail"
                    value="${editEmail}"
                  />
                  <img src="assets/img/briefSmall.svg" />
                </div>
                <a
                  class="new_contact_required d-none"
                  id="EditFieldRequiredEmail"
                  >This field is required</a
                >
              </div>
              <div class="new_contact_info_user column-flex-start">
                <div class="new_contact_info row-center">
                  <input
                    type="number"
                    class="newContact_input font400 row-spacebet-center"
                    id="editContactPhone"
                    value="${editPhone}"
                  />
                  <img src="assets/img/phoneSmall.svg" />
                </div>
                <a
                  class="new_contact_required d-none"
                  id="editFieldRequiredPhone"
                  >This field is required</a
                >
              </div>
            </div>
            <div class="new_contact_bottom3 row-center-center">
              <button class="edit_contact_botton_create row-center-center">
                <a class="new_contact_button font400">Save</a>
              </button>
            </div>
          </div>
        </form>
      </div>
`;
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
  capitalLetter();
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
  document
    .getElementById("newContactPopUp")
    .classList.remove("background_white_transp");
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
  editContact();
  document.getElementById("editContactPop").classList.add("slide-right");
  document.getElementById("editContactPop").classList.remove("slide-left");
  document
    .getElementById("editContactPopUp")
    .classList.add("background_white_transp");
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

function capitalLetter() {
  const newContactNameInput = document.getElementById("newContactName");

  newContactNameInput.addEventListener("input", (event) => {
    const input = event.target;
    const inputValue = input.value;

    if (inputValue.length > 0) {
      input.value = inputValue.charAt(0).toUpperCase() + inputValue.slice(1);
    }
  });
}
