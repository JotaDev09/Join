let contacts = [];
let currentDisplayedContact = null;

/**
 * Functions required to load contacts site.
 */
async function initContacts() {
  includeHTML();
  await Promise.all([loadContacts(), loadUserData(), loadUsers()]);
}

/**
 * Function retrieves contacts from the server and sends them for sorting by their initial letter
 */
async function loadContacts() {
  const currentUser = loadUserData();

  const contactsColumn = document.getElementById("contactsColumn");
  contactsColumn.innerHTML = "";

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
 * The function sorts the contacts by their initial letter.
 *
 * @param {contacts} - take the info from the array contacts
 */
function sortContactsByInitialLetter(contacts) {
  const sortedContacts = {};

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
 * The function creates contacts based on their initial letter and generates a template for the contact list.
 *
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
      html += renderColumnContacts(displayName, groupedContacts[initial]);
    }
  }
  return html;
}

/**
 * The function generates initials based on either the name or the email.
 *
 * @param {name} - take the name of contacts
 * @param {emial} - take the name of contacts
 */
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

  return "";
}

/**
 * The function displays a specific contact when the user clicks on it.
 *
 * @param {contacId} - take the id of one specific contact
 */
function showContact(contactId) {
  const currentUser = loadUserData();
  const contact = currentUser.contacts.find((c) => c.id === contactId);

  if (contact) {
    currentDisplayedContact = contact;
    const bigCardContact = renderBigCardContact(contact);
    document.getElementById("bigContactCard").innerHTML = bigCardContact;
    document.getElementById("bigCardTitle").style = "display: flex";
  }
  contactsResponsive();
}

/**
 * The function displays a specific contact when the user clicks on it in responsive mode
 *
 */
function contactsResponsive() {
  if (window.matchMedia("(max-width: 1200px)").matches) {
    document.getElementById("containerBigCard").style =
      "display: flex !important";
  }
}

/**
 * The function closes a specific contact when the user clicks on it.
 *
 */
function closeShowContact() {
  document.getElementById("containerBigCard").style =
    "display: none !important;";
}

/**
 * The function renders a big card of one specific contact when the user clicks on it.
 *
 * @param {contact} - take the info of one specific contact
 */
function renderBigCardContact(contact) {
  const contactName = contact.name;
  const contactEmail = contact.email;
  const contactPhone = contact.phone;
  const contactColor = contact.color;

  document.getElementById("editContactName").value = contactName;
  document.getElementById("editContactEmail").value = contactEmail;
  document.getElementById("editContactPhone").value = contactPhone;
  const contactCircle = document.getElementById("circleContact");
  contactCircle.style.backgroundColor = contactColor;
  const circleInitials = document.getElementById("circleInitials");
  const initials =
    contactName.charAt(0).toUpperCase() +
    (contactName.includes(" ")
      ? contactName.split(" ")[1].charAt(0).toUpperCase()
      : "");
  circleInitials.textContent = initials;

  const html = renderBigCard(
    contactName,
    contactEmail,
    contactPhone,
    contactColor
  );
  return html;
}

/**
 * The function takes the nformation required for adding a new contact and shows advise in case of blank
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
 * The function creates a new contact.
 */
async function createNewContact() {
  let nameContact = document.getElementById("newContactName");
  let emailContact = document.getElementById("newContactEmail");
  let phoneContact = document.getElementById("newContactPhone");

  const currentUser = loadUserData();

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
    users[userIndex] = currentUser;
    await backend.setItem("users", JSON.stringify(users));
  }
  addContactToHTML();
  loadContacts();
  createContactPopup();
}

/**
 * The function adds the new contact to the HTML
 */
function addContactToHTML() {
  const currentUser = loadUserData();
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
 * The function generates a random color for the new contact.
 */
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

/**
 * The function opens the new contact pop-up
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
 * The function closes the new contact pop-up
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
 * The function opens the show contact pop-up
 */
function createContactPopup() {
  document.getElementById("contactCreated").style =
    "transform: translateY(-557%); transition-duration: 1s";
  closeNewContact();
  setInterval(hiddeContactPopUp, 1000);
}

/**
 * The function hiddes the new contact pop-up
 */
function hiddeContactPopUp() {
  document
    .getElementById("newContactPopUp")
    .classList.remove("background_white_transp");
  document.getElementById("contactCreated").style =
    "display: none !important; transform: translateY(110%); transition-duration: 2s";
}

/**
 * The function opens the edit contact pop-up
 */
function openEditContact() {
  document.getElementById("editContactPop").classList.add("slide-right");
  document.getElementById("editContactPop").classList.remove("slide-left");
  document
    .getElementById("editContactPopUp")
    .classList.add("background_white_transp");
}

/**
 * The function edits a specific contact when the user clicks on it.
 *
 */
function editOldContact() {
  const editedName = document.getElementById("editContactName").value;
  const editedEmail = document.getElementById("editContactEmail").value;
  const editedPhone = document.getElementById("editContactPhone").value;

  if (currentDisplayedContact) {
    currentDisplayedContact.name = editedName;
    currentDisplayedContact.email = editedEmail;
    currentDisplayedContact.phone = editedPhone;

    const currentUser = loadUserData();
    const editedContactIndex = currentUser.contacts.findIndex(
      (c) => c.id === currentDisplayedContact.id
    );

    if (editedContactIndex !== -1) {
      currentUser.contacts[editedContactIndex] = currentDisplayedContact;
      saveUserData(currentUser);

      const userIndex = users.findIndex((user) => user.id === currentUser.id);
      if (userIndex !== -1) {
        users[userIndex] = currentUser;
        backend.setItem("users", JSON.stringify(users));
      }

      const bigCardContact = renderBigCardContact(currentDisplayedContact);
      document.getElementById("bigContactCard").innerHTML = bigCardContact;
    }
    addContactToHTML();
    closeEditContact();
    loadContacts();
  }
}

/**
 * The function closes the edit contact pop-up
 */
function closeEditContact() {
  document.getElementById("editContactPop").classList.add("slide-left");
  document.getElementById("editContactPop").classList.remove("slide-right");
  document
    .getElementById("editContactPopUp")
    .classList.remove("background_white_transp");
}

/**
 * The function deletes a specific contact when the user clicks on it.
 *
 */
function deleteContact() {
  if (currentDisplayedContact) {
    const currentUser = loadUserData();
    const contactIndex = currentUser.contacts.findIndex(
      (c) => c.id === currentDisplayedContact.id
    );

    if (contactIndex !== -1) {
      currentUser.contacts.splice(contactIndex, 1);
      saveUserData(currentUser);

      const userIndex = users.findIndex((user) => user.id === currentUser.id);
      if (userIndex !== -1) {
        users[userIndex] = currentUser;
        backend.setItem("users", JSON.stringify(users));
      }

      closeEditContact();
      closeShowContact();
      loadContacts();
    }
  }
}

/**
 * The function clears the information in the new contact pop-up
 */
function cancelNewContact() {
  document.getElementById("newContactName").value = "";
  document.getElementById("newContactEmail").value = "";
  document.getElementById("newContactPhone").value = "";
}

/**
 * The function capitalizes the first letter when the user enters input
 */
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
