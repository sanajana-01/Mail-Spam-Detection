document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  const data = [
    { sender: "Sadam", date: "Dec, 12", message: "Hello, how are you?", id: 1 },
    { sender: "Twitter", date: "Dec, 22", message: "You have won a lottery! Click here to claim.", id: 2 },
    { sender: "Yahye", date: "Dec, 14", message: "Meeting rescheduled to next week.", id: 3 },
    { sender: "Sadam", date: "Jan, 11", message: "Limited time offer just for you!", id: 4 },
    { sender: "Qadar", date: "Dec, 12", message: "Project update attached.", id: 5 },
    { sender: "John", date: "Oct, 26", message: "Don't miss out on this exclusive deal.", id: 6 },
    { sender: "Slaf", date: "Dec, 21", message: "Lunch tomorrow?", id: 7 },
    { sender: "Sadam", date: "Dec, 10", message: "Your account has been compromised.", id: 8 },
    { sender: "Farah", date: "May, 20", message: "Happy Birthday! Celebrate with us.", id: 9 },
    { sender: "Alex", date: "Feb, 12", message: "Important information regarding your order.", id: 10 }
  ];

  const junkMessages = [];
  const messages = document.querySelector(".messages_area");
  let isViewingJunk = false;

  // Function to render email messages
  const render = function (data) {
    messages.innerHTML = data
      .map((d, index) => `
        <div class="messages" data-index="${index}" data-id="${d.id}">
          <div class="messages_left">
            <div class="check check_2">
              <input type="radio" name="message-select" class="radio-button" id="radio-${index}" />
              <label for="radio-${index}">
                <ion-icon name="checkmark"></ion-icon>
              </label>
            </div>
            <ion-icon name="star-outline" class="hover star"></ion-icon>
            <span>${d.sender}</span>
          </div>
          <div class="messages_content">${d.message}</div>
          <div class="messages_date">${d.date}</div>
        </div>
      `).join("");
  };

  // Initial render of inbox messages
  render(data);

  // Function to handle radio button selection
  function selectMessage(event) {
    if (event.target.classList.contains("radio-button")) {
      document.querySelectorAll(".messages").forEach((msg) => {
        msg.classList.remove("selected");
      });

      const selectedMessage = event.target.closest(".messages");
      if (selectedMessage) {
        selectedMessage.classList.add("selected");
      }
    }
  }

  messages.addEventListener("click", selectMessage);

  // Toggle between Inbox and Junk views
  document.getElementById("inbox-link").addEventListener("click", function () {
    isViewingJunk = false;
    render(data);
  });

  document.getElementById("junk-link").addEventListener("click", function () {
    isViewingJunk = true;
    render(junkMessages);
  });

  // // Predict button functionality
  // const predictButton = document.getElementById("predict-btn");
  // if (predictButton) {
  //   predictButton.addEventListener("click", function () {
  //     const selectedMessageElement = document.querySelector(".messages.selected .messages_content");

  //     if (selectedMessageElement) {
  //       const messageText = selectedMessageElement.textContent.trim();
  //       const selectedMessageId = document.querySelector(".messages.selected").getAttribute("data-id");

  //       fetch("http://127.0.0.1:5000/predict", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json"
  //         },
  //         body: JSON.stringify({ message: messageText })
  //       })
  //       .then(response => {
  //         if (!response.ok) {
  //           throw new Error(`Server error: ${response.statusText}`);
  //         }
  //         return response.json();
  //       })
  //       .then(data => {
  //         if (data.prediction === "Spam") {
  //           const action = prompt("This message is detected as Spam. Type 'junk' to move it to Junk or 'delete' to delete it:");
            
  //           if (action === "junk") {
  //             moveToJunkFolder(selectedMessageId);
  //           } else if (action === "delete") {
  //             deleteMessage(selectedMessageId);
  //           } else {
  //             alert("Invalid choice. Please type 'junk' or 'delete'.");
  //           }
  //         } else {
  //           alert("This message is not Spam.");
  //         }
  //       })
  //       .catch(error => {
  //         console.error("Fetch error:", error);
  //         alert("An error occurred while predicting. Check the console for details.");
  //       });
  //     } else {
  //       alert("Please select a message to predict.");
  //     }
  //   });
  // } else {
  //   console.error("Predict button not found!");
  // }

  // // Function to move a message to Junk
  // function moveToJunkFolder(id) {
  //   const messageIndex = data.findIndex(msg => msg.id == id);
  //   if (messageIndex !== -1) {
  //     junkMessages.push(data[messageIndex]);
  //     data.splice(messageIndex, 1);
  //     render(isViewingJunk ? junkMessages : data);
  //     alert("Message moved to Junk.");
  //   }
  // }

  // // Function to delete a message
  // function deleteMessage(id) {
  //   const messageIndex = data.findIndex(msg => msg.id == id);
  //   if (messageIndex !== -1) {
  //     data.splice(messageIndex, 1);
  //     render(isViewingJunk ? junkMessages : data);
  //     alert("Message deleted.");
  //   }
  // }



  // Predict button functionality
const predictButton = document.getElementById("predict-btn");
const spamActionModal = document.getElementById("spamActionModal");
const moveToJunkButton = document.getElementById("moveToJunkButton");
const deleteButton = document.getElementById("deleteButton");
const closeModalButton = document.getElementById("closeModalButton");


if (predictButton) {
  predictButton.addEventListener("click", function () {
    const selectedMessageElement = document.querySelector(".messages.selected .messages_content");

    if (selectedMessageElement) {
      const messageText = selectedMessageElement.textContent.trim();
      const selectedMessageId = document.querySelector(".messages.selected").getAttribute("data-id");

      fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: messageText })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Server error: ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        if (data.prediction === "Spam") {
          showSpamActionModal(selectedMessageId); // Show modal if message is spam
        } else {
          alert("This message is not Spam.");
        }
      })
      .catch(error => {
        console.error("Fetch error:", error);
        alert("An error occurred while predicting. Check the console for details.");
      });
    } else {
      alert("Please select a message to predict.");
    }
  });
} else {
  console.error("Predict button not found!");
}

// Show spam action modal
function showSpamActionModal(messageId) {
  spamActionModal.style.display = "flex"; // Show modal

  // Set up event listeners for the buttons
  moveToJunkButton.onclick = function() {
    moveToJunkFolder(messageId);
    closeModal(); // Close modal after action
  };

  deleteButton.onclick = function() {
    deleteMessage(messageId);
    closeModal(); // Close modal after action
  };

  closeModalButton.onclick = closeModal; // Close modal without action
}

// Close the modal
function closeModal() {
  spamActionModal.style.display = "none";
}

// Function to move a message to Junk
function moveToJunkFolder(id) {
  const messageIndex = data.findIndex(msg => msg.id == id);
  if (messageIndex !== -1) {
    junkMessages.push(data[messageIndex]);
    data.splice(messageIndex, 1);
    render(isViewingJunk ? junkMessages : data);
    alert("Message moved to Junk.");
  }
}

// Function to delete a message
function deleteMessage(id) {
  const messageIndex = data.findIndex(msg => msg.id == id);
  if (messageIndex !== -1) {
    data.splice(messageIndex, 1);
    render(isViewingJunk ? junkMessages : data);
    alert("Message deleted.");
  }
}


  // --- Compose Message Logic ---

  // Compose Button and Form Elements
  const composeButton = document.getElementById("compose-btn");
  const composeForm = document.getElementById("compose-form");
  const sendButton = document.getElementById("send-btn");
  const cancelButton = document.getElementById("cancel-btn");

  // Show Compose Form
  composeButton.addEventListener("click", function () {
    composeForm.style.display = "block";
  });

  // Cancel Button to Hide Form
  cancelButton.addEventListener("click", function () {
    composeForm.style.display = "none";
  });

  // Send Button to Add New Message
  sendButton.addEventListener("click", function () {
    const sender = document.getElementById("compose-sender").value;
    const date = document.getElementById("compose-date").value;
    const message = document.getElementById("compose-message").value;

    if (!sender || !date || !message) {
      alert("Please fill out all fields.");
      return;
    }

    const newMessage = { sender, date, message, id: data.length + 1 };
    data.push(newMessage);
    render(data);

    // Clear form fields and hide form
    document.getElementById("compose-sender").value = "";
    document.getElementById("compose-date").value = "";
    document.getElementById("compose-message").value = "";
    composeForm.style.display = "none";
  });
  
  document.querySelector('.menu').addEventListener('click', () => {
    document.querySelector('.nav_container').classList.toggle('active');
  });
  
});
