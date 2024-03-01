/* async function sayHello() {
    let [tab] = await chrome.tabs.query({ active: true });
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
            alert("This is the extension Alert!!")
        }
    })
}
document.getElementById('myButton').addEventListener("click", sayHello) */

const todoList = document.getElementById("todo-list");
const addItemButton = document.getElementById("add-item");
const accountForm = document.getElementById("account-info");

// Function to create a new to-do list item
function createTodoItem(text) {
  const listItem = document.createElement("li");
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.addEventListener("change", () => {
    listItem.classList.toggle("completed");
  });
  const textArea = document.createElement("textarea");
  textArea.value = text;
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", () => {
    listItem.remove();
  });
  listItem.appendChild(checkbox);
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
  }
});

// Handle form submission (optional, if needed)
accountForm.addEventListener("submit", (event) => {
  // Prevent default form submission behavior (if applicable)
  event.preventDefault();
  // Access account number and phone number values here
  const accountNumber = document.getElementById("account-number").value;
  const phoneNumber = document.getElementById("phone-number").value;
  // Do something with the account info, e.g., display it or store it
  console.log(`Account Number: ${accountNumber}, Phone Number: ${phoneNumber}`);
});
