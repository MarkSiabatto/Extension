const copyButtons = document.querySelectorAll(".copy-btn");

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

const todoList = document.getElementById("todo-list");
const addItemButton = document.getElementById("add-item");
const accountForm = document.getElementById("account-info");
const clearAllButton = document.getElementById("clear-all");

// Function to create a new to-do list item
function createTodoItem(text) {
  const listItem = document.createElement("li");
  listItem.classList.add("list-group-item"); // Add 'list-group-item' class for Bootstrap styling
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.classList.add("form-control"); // Add 'form-control' class for Bootstrap styling
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.classList.add("btn", "btn-danger"); // Add button classes for Bootstrap styling
  deleteButton.addEventListener("click", () => {
    listItem.remove();
    saveDataToStorage(); // Save data to storage when deleting a to-do item
  });
  listItem.appendChild(textArea);
  listItem.appendChild(deleteButton);
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
  // Save to-do list items
  const todoItems = Array.from(todoList.children).map(
    (item) => item.querySelector("textarea").value
  );
  chrome.storage.sync.set({ todoList: todoItems }, () => {
    console.log("To-do list saved to Chrome storage!");
  });

  // Save other field values (account number, phone number, etc.)
  const formData = {};
  const formInputs = document.querySelectorAll(
    "#account-info input[type='text'], #account-info input[type='tel']"
  );
  formInputs.forEach((input) => {
    formData[input.name] = input.value;
  });
  chrome.storage.sync.set({ formData: formData }, () => {
    console.log("Form data saved to Chrome storage!");
  });
}

// Load the data from Chrome storage on page load
chrome.storage.sync.get(["todoList", "formData"], (data) => {
  // Load to-do list items
  const savedTodoList = data.todoList;
  if (savedTodoList) {
    savedTodoList.forEach((text) => {
      const newItem = createTodoItem(text);
      todoList.appendChild(newItem);
    });
  }

  // Load other field values (account number, phone number, etc.)
  const savedFormData = data.formData;
  if (savedFormData) {
    const formInputs = document.querySelectorAll(
      "#account-info input[type='text'], #account-info input[type='tel']"
    );
    formInputs.forEach((input) => {
      input.value = savedFormData[input.name];
    });
  }
});

clearAllButton.addEventListener("click", () => {
  // Clear form field values
  const formInputs = document.querySelectorAll("#account-info input");
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
