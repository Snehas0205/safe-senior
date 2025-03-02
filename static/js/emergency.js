// DOM Elements
const emergencyButton = document.getElementById('emergency-button');
const addContactButton = document.getElementById('add-contact-button');
const contactsList = document.getElementById('contacts-list');
const addContactModal = document.getElementById('add-contact-modal');
const contactForm = document.getElementById('contact-form');
const closeButton = document.querySelector('.close-button');
const cancelButton = document.querySelector('.cancel-button');
const notification = document.getElementById('notification');
const notificationMessage = document.getElementById('notification-message');
////------------------------------------------------------------------------------
//async function sendEmergencySMS(phoneNumber, name) {
//    const smsAPIKey = 'YOUR_SMS_API_KEY'; // Replace with your actual API key
//    const apiUrl = 'https://api.smsprovider.com/send'; // Replace with your SMS API URL
//  
//    const message = Emergency! Please help me, ${name}.;
//  
//    try {
//      const response = await fetch(apiUrl, {
//        method: 'POST',
    //    headers: {
    //      'Content-Type': 'application/json',
    //      'Authorization': Bearer ${smsAPIKey}
    //    },
    //    body: JSON.stringify({
    //      to: phoneNumber,
    //      message: message
    //    })
    //  });
  //
    //  if (!response.ok) {
    //    throw new Error('Failed to send SMS');
  //    }
  //
  //    const result = await response.json();
  //    console.log('SMS sent successfully:', result);
  //    return true;
  //  } catch (error) {
  //    console.error('Error sending SMS:', error);
  //    return false;
  //  }
  //}
 // -------------------------------------------------------------------------------
// Contact storage
let contacts = JSON.parse(localStorage.getItem('emergencyContacts')) || [];

// Initialize the app
function init() {
  renderContacts();
  setupEventListeners();
}

// Set up event listeners
function setupEventListeners() {
  // Emergency button
  emergencyButton.addEventListener('click', handleEmergency);
  
  // Add contact button
  addContactButton.addEventListener('click', openAddContactModal);
  
  // Close modal buttons
  closeButton.addEventListener('click', closeAddContactModal);
  cancelButton.addEventListener('click', closeAddContactModal);
  
  // Close modal when clicking outside
  window.addEventListener('click', (e) => {
    if (e.target === addContactModal) {
      closeAddContactModal();
    }
  });
  
  // Form submission
  contactForm.addEventListener('submit', handleAddContact);
}

// Render contacts list
function renderContacts() {
  if (contacts.length === 0) {
    contactsList.innerHTML = `
      <div class="empty-state">
        <p>No emergency contacts added yet.</p>
        <p>Add contacts to send emergency messages when needed.</p>
      </div>
    `;
    return;
  }
  
  contactsList.innerHTML = '';
  contacts.forEach(contact => {
    const contactElement = document.createElement('div');
    contactElement.className = 'contact-card';
    contactElement.innerHTML = `
      <div class="contact-info">
        <div class="contact-name">
          ${contact.name}
          ${contact.isDefault ? '<span class="contact-badge">Default</span>' : ''}
        </div>
        <div class="contact-details">
          ${contact.phoneNumber} • ${contact.relationship}
        </div>
      </div>
      <div class="contact-actions">
        <button class="edit-button" data-id="${contact.id}">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
        </button>
        <button class="delete-button" data-id="${contact.id}">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
        </button>
      </div>
    `;
    
    // Add event listeners for edit and delete buttons
    contactElement.querySelector('.edit-button').addEventListener('click', () => {
      editContact(contact.id);
    });
    
    contactElement.querySelector('.delete-button').addEventListener('click', () => {
      deleteContact(contact.id);
    });
    
    contactsList.appendChild(contactElement);
  });
}

// Open add contact modal
function openAddContactModal() {
  addContactModal.style.display = 'block';
  document.getElementById('contact-name').focus();
}

// Close add contact modal
function closeAddContactModal() {
  addContactModal.style.display = 'none';
  contactForm.reset();
}

// Handle add contact form submission
function handleAddContact(e) {
  e.preventDefault();
  
  const name = document.getElementById('contact-name').value;
  const phoneNumber = document.getElementById('contact-phone').value;
  const relationship = document.getElementById('contact-relationship').value;
  const isDefault = document.getElementById('contact-default').checked;
  
  // Validate phone number
  if (!isValidPhoneNumber(phoneNumber)) {
    showNotification('Please enter a valid phone number', true);
    return;
  }
  
  // If setting as default, remove default from other contacts
  if (isDefault) {
    contacts = contacts.map(contact => ({
      ...contact,
      isDefault: false
    }));
  }
  
  // Create new contact
  const newContact = {
    id: Date.now().toString(),
    name,
    phoneNumber,
    relationship,
    isDefault
  };
  
  // Add to contacts array
  contacts.push(newContact);
  
  // Save to localStorage
  saveContacts();
  
  // Close modal and show notification
  closeAddContactModal();
  showNotification('Contact added successfully');
  
  // Update contacts list
  renderContacts();
}

// Edit contact
function editContact(id) {
  const contact = contacts.find(c => c.id === id);
  if (!contact) return;
  
  // Fill form with contact data
  document.getElementById('contact-name').value = contact.name;
  document.getElementById('contact-phone').value = contact.phoneNumber;
  document.getElementById('contact-relationship').value = contact.relationship;
  document.getElementById('contact-default').checked = contact.isDefault;
  
  // Open modal
  openAddContactModal();
  
  // Remove old contact and add updated one on form submission
  const originalSubmitHandler = contactForm.onsubmit;
  contactForm.onsubmit = (e) => {
    e.preventDefault();
    
    // Remove the contact
    contacts = contacts.filter(c => c.id !== id);
    
    // Add the updated contact
    handleAddContact(e);
    
    // Restore original submit handler
    contactForm.onsubmit = originalSubmitHandler;
  };
}

// Delete contact
function deleteContact(id) {
  if (confirm('Are you sure you want to delete this contact?')) {
    contacts = contacts.filter(contact => contact.id !== id);
    saveContacts();
    renderContacts();
    showNotification('Contact deleted');
  }
}

// Handle emergency button click
function handleEmergency() {
  if (contacts.length === 0) {
    showNotification('No emergency contacts added yet', true);
    return;
  }
  
  // Get default contact or first contact
  const defaultContact = contacts.find(contact => contact.isDefault) || contacts[0];
  
  // Send emergency SMS
  sendEmergencySMS(defaultContact.phoneNumber, defaultContact.name)
    .then(success => {
      if (success) {
        showNotification('Emergency message sent to ${defaultContact.name}');
      } else {
        showNotification('Failed to send emergency message', true);
      }
    });
}

// Send emergency SMS (simulated)
async function sendEmergencySMS(phoneNumber, name) {
  try {
    // In a real application, this would be an API call to an SMS service
    console.log('Sending SMS to ${phoneNumber}: Im in trouble and need help!');
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate successful API response
    return true;
  } catch (error) {
    console.error('Error sending SMS:', error);
    return false;
  }
}

// Show notification
function showNotification(message, isError = false) {
  notificationMessage.textContent = message;
  notification.className = isError ? 'notification error show' : 'notification show';
  
  setTimeout(() => {
    notification.className = 'notification';
  }, 3000);
}

// Save contacts to localStorage
function saveContacts() {
  localStorage.setItem('emergencyContacts', JSON.stringify(contacts));
}

// Validate phone number
function isValidPhoneNumber(phoneNumber) {
  // Basic validation - can be enhanced for specific formats
  return phoneNumber.length >= 10;
}

// Initialize the app
init();9