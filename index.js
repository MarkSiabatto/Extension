const copyButtons = document.querySelectorAll(".copy-btn");
const todoList = document.getElementById("todo-list");
const addItemButton = document.getElementById("add-item");
const accountForm = document.getElementById("account-info");
const clearAllButton = document.getElementById("clear-all");
const formInputs = document.querySelectorAll(
  "#account-info input[type='text'], #account-info input[type='tel']"
);

// Add event listeners for form input fields
formInputs.forEach((input) => {
  input.addEventListener("input", saveDataToStorage);
});

// Add event listeners for to-do list item text areas
todoList.querySelectorAll("textarea").forEach((textArea) => {
  textArea.addEventListener("input", saveDataToStorage);
});

// Add event listeners for copy buttons
copyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const fieldId = button.dataset.fieldId;
    const inputField = document.getElementById(fieldId);
    const textToCopy = inputField.value;

    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        console.log("Text copied to clipboard!");
        // Optionally add visual feedback (e.g., show a success message)
      })
      .catch((err) => {
        console.error("Failed to copy text:", err);
        // Optionally handle clipboard errors (e.g., show an error message)
      });
  });
});

// Function to create a new to-do list item
function createTodoItem(text) {
  const listItem = document.createElement("li");
  listItem.classList.add("list-group-item"); // Add 'list-group-item' class for Bootstrap styling
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.classList.add("form-control"); // Add 'form-control' class for Bootstrap styling
  textArea.disabled = true; // Disable the textarea
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.classList.add("btn", "btn-danger"); // Add button classes for Bootstrap styling
  deleteButton.addEventListener("click", () => {
    listItem.remove();
    saveDataToStorage(); // Save data to storage when deleting a to-do item
  });
  const copyButton = document.createElement("button"); // Create copy button
  copyButton.textContent = "Copy";
  copyButton.classList.add("copy-btn", "btn", "btn-secondary"); // Add button classes for Bootstrap styling
  copyButton.dataset.fieldId = `todo-item-${Date.now()}`; // Generate unique field ID for each item
  copyButton.addEventListener("click", () => {
    const textToCopy = textArea.value;

    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        console.log("Text copied to clipboard!");
        // Optionally add visual feedback (e.g., show a success message)
      })
      .catch((err) => {
        console.error("Failed to copy text:", err);
        // Optionally handle clipboard errors (e.g., show an error message)
      });
  });
  listItem.appendChild(textArea);
  listItem.appendChild(deleteButton);
  listItem.appendChild(copyButton); // Append copy button to list item
  return listItem;
}

// Add new item button click handler
addItemButton.addEventListener("click", () => {
  const newItemText = prompt("Enter a new todo item:");
  if (newItemText) {
    const newItem = createTodoItem(newItemText);
    todoList.appendChild(newItem);
    saveDataToStorage(); // Save data to storage when adding a new to-do item
  }
});

// Function to save the current data to Chrome storage
function saveDataToStorage() {
  // Combine all data into a single object
  const dataToSave = {
    formData: {},
    todoList: [],
  };

  // Save form field values
  formInputs.forEach((input) => {
    dataToSave.formData[input.name] = input.value;
  });

  // Save to-do list items
  todoList.querySelectorAll("textarea").forEach((textArea) => {
    dataToSave.todoList.push(textArea.value);
  });

  // Save data to Chrome storage
  chrome.storage.sync.set(dataToSave, () => {
    console.log("Data saved to Chrome storage!");
  });
}

// Load the data from Chrome storage on page load
chrome.storage.sync.get(["formData", "todoList"], (data) => {
  // Load form field values
  Object.entries(data.formData).forEach(([name, value]) => {
    const input = document.querySelector(`#account-info [name="${name}"]`);
    if (input) {
      input.value = value;
    }
  });

  // Load to-do list items
  data.todoList.forEach((text) => {
    const newItem = createTodoItem(text);
    todoList.appendChild(newItem);
  });
});

// Add event listener for clear all button
clearAllButton.addEventListener("click", () => {
  // Clear form field values
  formInputs.forEach((input) => {
    input.value = "";
  });

  // Clear to-do list items
  todoList.innerHTML = "";

  // Clear saved data from Chrome storage
  chrome.storage.sync.clear(() => {
    console.log("Cleared all data from Chrome storage!");
  });
});
