document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const username = document.getElementById("username").value.trim();

    if (!name || !email || !username) {
        displayFlashMessage("Please fill in all fields.", "danger");
    } else if (!validateEmail(email)) {
        displayFlashMessage("Invalid email format!", "danger");
    } else {
        displayFlashMessage("Login Successful! Welcome, " + username, "success");
        this.submit(); // Proceed with form submission
    }
});

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function displayFlashMessage(message, category) {
    const flashContainer = document.querySelector(".flash-container");
    const flashMessage = document.createElement("div");
    flashMessage.className = `flash-message flash-${category}`;
    flashMessage.innerHTML = `${message} <button onclick="this.parentElement.style.display='none'">OK</button>`;
    flashContainer.innerHTML = "";
    flashContainer.appendChild(flashMessage);
}
