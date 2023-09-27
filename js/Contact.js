function validateForm() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const subject = document.getElementById("subject").value;
    const message = document.getElementById("message").value;

    document.getElementById("name-error").textContent = "";
    document.getElementById("email-error").textContent = "";
    document.getElementById("subject-error").textContent = "";
    document.getElementById("message-error").textContent = "";

    let isValid = true;

    if (name.length <= 5) {
        document.getElementById("name-error").textContent = "Name must be more than 5 characters.";
        isValid = false;
    }

    if (!isValidEmail(email)) {
        document.getElementById("email-error").textContent = "Invalid email address.";
        isValid = false;
    }

    if (subject.length <= 15) {
        document.getElementById("subject-error").textContent = "Subject must be more than 15 characters.";
        isValid = false;
    }

    if (message.length <= 25) {
        document.getElementById("message-error").textContent = "Message must be more than 25 characters.";
        isValid = false;
    }

    return isValid;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

document.getElementById("contact-form").addEventListener("submit", function (e) {
    e.preventDefault();

    if (validateForm()) {
        const submitButton = document.querySelector(".submit-button");
        submitButton.textContent = "Submitted!";
        submitButton.disabled = true;
        const successMessageElement = document.getElementById("success-message");
        successMessageElement.textContent = "Form submitted successfully!";
        successMessageElement.style.display = "block";

        setTimeout(function () {
            submitButton.textContent = "Submit";
            submitButton.disabled = false;
            document.getElementById("name").value = "";
            document.getElementById("email").value = "";
            document.getElementById("subject").value = "";
            document.getElementById("message").value = "";
            successMessageElement.style.display = "none";
        }, 3000);

    }
});
