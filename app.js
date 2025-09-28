let categories = [];

let selectedCategoryId;
console.log(selectedCategoryId);
let selectedCategoryName = "default";
console.log(selectedCategoryName);

const allTaskBtn = document
  .getElementById("allTaskBtn")
  .addEventListener("click", allTask);

function allTask() {
  selectedCategoryName = "default";
  fallowCategories(selectedCategoryName);
  let data = getTasks();
  allData(data);
}

function getTasks() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  return tasks;
}

function getCategory() {
  let category = JSON.parse(localStorage.getItem("category")) || [];
  return category;
}
function setCategory(category) {
  localStorage.setItem("category", JSON.stringify(category));
}

function setTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function inputValidation(inputVal) {
  if (inputVal != null && inputVal != "") {
    return true;
  } else {
    false;
  }
}

function uniqueIdGenerator() {
  const random = Math.floor(Math.random() * 10000) + 1000;
  return uniqueIdChecker(random);
}

function uniqueIdChecker(uniqueId) {
  let tasks = getTasks();

  const taskCheckResult = tasks.find((task) => task.id == uniqueId);
  const categoryCheckResult = categories.find(
    (category) => category.id == uniqueId
  );

  if (taskCheckResult || categoryCheckResult) {
    uniqueIdGenerator();
  } else {
    return uniqueId;
  }
}

function createTasks() {
  const inputTask = document.getElementById("inputTask");
  const startDateTime = document.getElementById("startTaskDate");
  const endDateTime = document.getElementById("endTaskDate");
  const categorySelect = document.getElementById("selectedCategory");
  const inputTaskVal = inputTask.value;
  const isInputTask = inputValidation(inputTaskVal);

  const isDate = checkDateValueTask();

  if (isInputTask) {
    const taskId = uniqueIdGenerator();
    const now = new Date();
    const createdAt = now.toLocaleString("tr-TR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
    let categoryValue = "";
    if (selectedCategoryId) {
      categoryValue = selectedCategoryId;
    } else if (categorySelect && categorySelect.value !== "default") {
      categoryValue = Number(categorySelect.value);
    }
    const taskItem = {
      id: taskId,
      categoryId: categoryValue,
      taskName: inputTaskVal,
      startTaskTime: isDate ? startDateTime.value : "",
      endTaskTime: isDate ? endDateTime.value : "",
      completed: false,
      generationTime: createdAt,
    };
    inputTask.value = "";
    let tasks = getTasks();
    tasks.unshift(taskItem);
    setTasks(tasks);

    let filterData = tasks.filter((x) => x.categoryId == categoryValue);
    allData(filterData);

    resetDate();
  } else {
    return;
  }
}

function checkDateValueTask() {
  const startDateTime = document.getElementById("startTaskDate");
  const endDateTime = document.getElementById("endTaskDate");
  if (startDateTime.value === "" || endDateTime.value === "") {
    return false;
  } else return true;
}

function resetDate() {
  const startDateTime = document.getElementById("startTaskDate");
  const endDateTime = document.getElementById("endTaskDate");
  const isDate = checkDateValueTask();
  if (isDate) {
    startDateTime.value = "";
    endDateTime.value = "";
  } else {
    return;
  }
}

function checkDateValue() {
  const updateDialog = document.getElementById("updateDialog");

  const startDateTime = updateDialog.querySelector("#updateStartTaskDate");
  const endDateTime = updateDialog.querySelector("#updateEndTaskDate");
  if (startDateTime.value == "" || endDateTime.value == "") {
    return false;
  } else return true;
}

function updateTask(taskId) {
  const updateDialog = document.getElementById("updateDialog");
  const updateInput = updateDialog.querySelector("#updateInput");

  const updateStartTaskDate = updateDialog.querySelector(
    "#updateStartTaskDate"
  );
  const updateEndTaskDate = updateDialog.querySelector("#updateEndTaskDate");

  let data = getTasks();
  let currentTask = data.find((e) => e.id == taskId);
  if (!currentTask) {
    console.error("Task yok", taskId);
    return;
  }
  updateInput.value = currentTask.taskName;
  updateStartTaskDate.value = currentTask.startTaskTime;
  updateEndTaskDate.value = currentTask.endTaskTime;
  updateDialog.setAttribute("data-id", taskId);
  updateDialog.show();
}

document
  .getElementById("updateDialog")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      const updateDialog = document.getElementById("updateDialog");
      const taskID = parseInt(updateDialog.getAttribute("data-id"));

      const updateStartTaskDate = updateDialog.querySelector(
        "#updateStartTaskDate"
      );
      const updateEndTaskDate =
        updateDialog.querySelector("#updateEndTaskDate");
      const updateInput = updateDialog.querySelector("#updateInput");

      let data = getTasks();
      let currentTask = data.find((e) => e.id == taskID);

      if (!currentTask) {
        console.error("Task yok", taskID);
        return;
      }
      const isDate = checkDateValue();

      currentTask.taskName = updateInput.value;
      currentTask.startTaskTime = isDate ? updateStartTaskDate.value : "";
      currentTask.endTaskTime = isDate ? updateEndTaskDate.value : "";
      setTasks(data);
      allData(data);
      updateDialog.close();
    }
  });

function removeTask(id) {
  let tasks = getTasks();
  tasks = tasks.filter((e) => e.id !== id);
  setTasks(tasks);
  allData(tasks);
}

function dateMinMax() {
  const startTaskDate = document.getElementById("startTaskDate");
  const endTaskDate = document.getElementById("endTaskDate");

  startDateVal = startTaskDate.value;
  endDateVal = endTaskDate.value;
  console.log(startDateVal);
  console.log(endDateVal);
  if (startDateVal != "" && endDateVal == "") {
    endTaskDate.min = startDateVal;
  } else if (endDateVal != "" && startDateVal == "") {
    startTaskDate.max = endDateVal;
  }
}

function searchTask() {
  const list = document.getElementById("task-List");
  list.innerHTML = "";

  const searchInput = document.getElementById("searchTask");
  const searchInputVal = searchInput.value;

  let data = getTasks();
  let filterData = data.filter((e) =>
    e.taskName.toLowerCase().includes(searchInputVal.toLowerCase())
  );
  allData(filterData);
}

function sorting() {
  const selected = document.getElementById("sorting");
  selectedVal = selected.value;
  console.log(selectedVal);
  if (selectedVal == "fromAtoZsorted") {
    alphabetSorted(selectedVal);
  } else if (selectedVal == "fromZtoAsorted") {
    alphabetSorted(selectedVal);
  } else if (selectedVal == "newDateSorted") {
    filterDate(selectedVal);
  } else if (selectedVal == "oldDateSorted") {
    filterDate(selectedVal);
  } else if (selectedVal == "completed") {
    completedSorted();
  } else if (selectedVal == "unfinished") {
    unfinishedSorted();
  } else return;
}
function unfinishedSorted() {
  let allTasks = getTasks();

  let unfinished = allTasks.filter((task) => task.completed === false);

  allData(unfinished);
}
function completedSorted() {
  let allTasks = getTasks();

  let completedTasks = allTasks.filter((task) => task.completed === true);

  allData(completedTasks);
}

function alphabetSorted(getSelectVal) {
  let data = getTasks();

  if (getSelectVal == "fromAtoZsorted") {
    let newData = data.sort((a, b) => a.taskName.localeCompare(b.taskName));
    setTasks(newData);
    allData(newData);
  } else if (getSelectVal == "fromZtoAsorted") {
    let newData = data.sort((a, b) => b.taskName.localeCompare(a.taskName));
    setTasks(newData);
    allData(newData);
  }
}

function checkTaskDate() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let data = getTasks();
  data.forEach((element) => {
    const iconDiv = document.getElementById(`iconDiv_${element.id}`);
    if (!iconDiv) return;

    let finishDateVal = new Date(element.endTaskTime);
    finishDateVal.setHours(0, 0, 0, 0);

    const diffTime = finishDateVal.getTime() - today.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (diffDays === 0 || diffDays === 1) {
      iconDiv.innerHTML = "⏳";
    } else if (diffDays < 0) {
      iconDiv.innerHTML = "🚨";
    } else {
      iconDiv.innerHTML = "";
    }
  });
}

function createCategoryInput() {
  const UserCategoryDiv = document.getElementById("getUserCategoryDiv");
  const userCategoryButtonDiv = document.getElementById(
    "getUserCategoryButtonDiv"
  );

  const getUserCategory = document.createElement("input");
  getUserCategory.setAttribute("id", "getUserInput");
  UserCategoryDiv.appendChild(getUserCategory);

  const getUserCategoryButton = document.createElement("button");

  getUserCategoryButton.setAttribute("id", "userCategoryAppend");
  getUserCategoryButton.innerHTML = "Ekle";
  userCategoryButtonDiv.appendChild(getUserCategoryButton);
  getUserCategoryButton.addEventListener("click", createCategory);
}

function createCategory() {
  const getUserInput = document.getElementById("getUserInput");
  const selectCategory = document.getElementById("createCategorySelect");

  const getUserInputVal = getUserInput.value;

  const isInputValid = inputValidation(getUserInputVal);

  if (isInputValid) {
    const inputId = uniqueIdGenerator();
    const item = {
      id: inputId,
      category_name: getUserInputVal,
    };
    let categories = getCategory();
    categories.push(item);
    setCategory(categories);
    fetchCategory();
  } else {
    return;
  }
}

function fetchCategory() {
  const selectCategory = document.getElementById("createCategorySelect");
  const selectCategoryTaskInput = document.getElementById("selectedCategory");
  selectCategory.innerHTML = "";
  selectCategoryTaskInput.innerHTML = "";
  let data = getCategory();
  console.log(data);
  selectCategoryTaskInput.innerHTML = ` 
    <option value="default">Kategori Seçiniz</option>
  `;
  data.forEach((element) => {
    selectCategory.innerHTML += `
    <div class="category-btn-wrapper"> 
      <button id="btn_${element.id}" class="category-btn" onclick="filterCategory(${element.id},'${element.category_name}')">${element.category_name}</button>
      <button class="delete-category-btn" onclick="deleteCategory(${element.id})">🗑️</button>
    </div>
    `;
    selectCategoryTaskInput.innerHTML += `
      <option value="${element.id}" id="${element.id}">${element.category_name}</option>
    `;
  });
}
function deleteCategory(categoryId) {
  let allCategory = getCategory();
  let allTask = getTasks();
  let remainingCategory = allCategory.filter(
    (category) => category.id != categoryId
  );
  setCategory(remainingCategory);

  const btnWrapper = document.getElementById(
    `btn_${categoryId}`
  )?.parentElement;
  if (btnWrapper) btnWrapper.remove();
  fetchCategory();
  allData(allTask);
}

function filterCategory(id, categoryName) {
  let data = getTasks();
  let filterData = data.filter((x) => x.categoryId == id);
  selectedCategoryId = id;
  selectedCategoryName = categoryName;
  console.log(selectedCategoryName);
  fallowCategories(selectedCategoryName);
  setTasks(data);
  allData(filterData);
}

function fallowCategories(selectedCategory) {
  const categorySelect = document.getElementById("selectedCategory");
  if (selectedCategory == "default") {
    categorySelect.text = selectedCategory;
    categorySelect.disabled = false;
    categorySelect.style.display = "inline-block";
  } else {
    categorySelect.text = selectedCategory;
    console.log(categorySelect.value);

    categorySelect.disabled = true;
  }
}

function filterDate(selectedVal) {
  let data = getTasks();
  if (selectedVal == "oldDateSorted") {
    let newData = data.sort((a, b) =>
      a.endTaskTime.localeCompare(b.endTaskTime)
    );
    setTasks(newData);
    allData(newData);
  } else if (selectedVal == "newDateSorted") {
    let newData = data.sort((a, b) =>
      b.endTaskTime.localeCompare(a.endTaskTime)
    );
    setTasks(newData);
    allData(newData);
  } else {
    allData(data);
  }
}

document
  .getElementById("inputTask")
  .addEventListener("keydown", function (event) {
    if (event.key == "Enter") {
      event.preventDefault();
      createTasks();
    }
  });

window.addEventListener("DOMContentLoaded", () => {
  const tasks = getTasks();
  allData(tasks);
});

function allData(task) {
  const tasks = document.getElementById("task-List");
  tasks.innerHTML = "";

  let data = task || getTasks();
  data.forEach((element) => {
    tasks.innerHTML += `
      <div class="task-card">
        <div class="task-left"><input type="checkbox" id="checkbox_${
          element.id
        }" onclick="isCheckBoxChecked(${element.id})" ${
      element.completed ? "checked" : ""
    }></div>
        <div class="card-icon"><div id="iconDiv_${element.id}"></div></div>
        <div class="task-text">${element.taskName}</div>
        <div>${element.startTaskTime}</div>
        <div>${element.endTaskTime}</div>
        <div class="task-actions">
          <button class="updateBtn" id="updateBtn" onclick="updateTask(${
            element.id
          })">✏️</button>
          <button style="color: red;" class="deleteBtn" onclick="removeTask(${
            element.id
          })">✖</button>
        </div>
      </div>
    `;
  });
  checkTaskDate();
}

function isCheckBoxChecked(id) {
  const checkBox = document.getElementById(`checkbox_${id}`);
  let data = getTasks();
  let findDataCompleted = data.find((x) => x.id === id);

  console.log(findDataCompleted);

  if (checkBox.checked === true) {
    findDataCompleted.completed = !findDataCompleted.completed;
    data.sort((a, b) => a.completed - b.completed);
    setTasks(data);
    allData(data);
  } else {
    findDataCompleted.completed = !findDataCompleted.completed;
    data.sort((a, b) => a.completed - b.completed);
    setTasks(data);
    allData(data);
  }
}

const openBtn = document.getElementById("openModal");
const modal = document.getElementById("modal");

openBtn.addEventListener("click", () => {
  modal.classList.toggle("open");
});

function showCategories() {
  const hiddenCategory = document.getElementById("category-add");
  hiddenCategory.hidden = !hiddenCategory.hidden;
}

document.addEventListener("keydown", function (event) {
  const updateDialog = document.getElementById("updateDialog");

  if (event.key == "Escape") {
    event.preventDefault();
    modal.classList.remove("open");
    updateDialog.close();
  }
});

const sidebar = document.querySelector(".sidebar");
const sidebarToggleBtn = document.createElement("button");
sidebarToggleBtn.id = "sidebarToggleBtn";
sidebarToggleBtn.innerText = "☰";
document.body.appendChild(sidebarToggleBtn);

sidebarToggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("open");
});
