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
  let categories = [];

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

  const inputTaskVal = inputTask.value;
  const isInputTask = inputValidation(inputTaskVal);

  const category_id = userSelectCategory();
  const isDate = checkDateValueTask();

  if (isInputTask) {
    const taskId = uniqueIdGenerator();
    const taskItem = {
      id: taskId,
      categoryId: Number(category_id),
      taskName: inputTaskVal,
      startTaskTime: isDate ? startDateTime.value : "",
      endTaskTime: isDate ? endDateTime.value : "",
    };
    inputTask.value = "";
    let tasks = getTasks();
    tasks.push(taskItem);
    setTasks(tasks);
    allData(tasks);
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
  console.log(updateDialog);

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

/* function searchTask() {
  const table = document.getElementById("table");
  table.innerHTML = "";

  const searchInput = document.getElementById("searchTask");
  const searchInputVal = searchInput.value;

  let data = getTasks();
  let filterData = data.filter((e) =>
    e.taskName.toLowerCase().includes(searchInputVal.toLowerCase())
  );
  fetchData(filterData);
} */

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
  } else return;
}

function alphabetSorted(getSelectVal) {
  let data = getTasks();

  if (getSelectVal == "fromAtoZsorted") {
    let newData = data.sort((a, b) => a.taskName.localeCompare(b.taskName));
    setTasks(newData);
    fetchData(newData);
  } else if (getSelectVal == "fromZtoAsorted") {
    let newData = data.sort((a, b) => b.taskName.localeCompare(a.taskName));
    setTasks(newData);
    fetchData(newData);
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
  selectCategory.innerHTML += `
      <option value="${getUserInputVal}">${getUserInputVal}</option>
  `;
  let categories = [];

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
  selectCategory.innerHTML = "";
  let data = getCategory();
  console.log(data);

  data.forEach((element) => {
    selectCategory.innerHTML += `
      <option value="${element.id}">${element.category_name}</option>
    `;
  });
  const selectCategoryVal = selectCategory.value;

  console.log(selectCategoryVal);
}

function userSelectCategory() {
  const selectCategory = document.getElementById("createCategorySelect");
  const selectCategoryVal = selectCategory.value;
  return selectCategoryVal;
}

function filterCategory() {
  const selectCategory = document.getElementById("createCategorySelect");
  const selectCategoryVal = selectCategory.value;
  console.log(selectCategoryVal);
  console.log(typeof selectCategoryVal);
  let data = getTasks();
  let filterData = data.filter((x) => x.categoryId == selectCategoryVal);
  console.log(selectCategoryVal);
  console.log(filterData);
  fetchData(filterData);
}

function filterDate(selectedVal) {
  let data = getTasks();
  if (selectedVal == "oldDateSorted") {
    let newData = data.sort((a, b) =>
      a.endTaskTime.localeCompare(b.endTaskTime)
    );
    setTasks(newData);
    fetchData(newData);
  } else if (selectedVal == "newDateSorted") {
    let newData = data.sort((a, b) =>
      b.endTaskTime.localeCompare(a.endTaskTime)
    );
    setTasks(newData);
    fetchData(newData);
  } else {
    fetchData(data);
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

/* function fetchData(task) {
  const table = document.getElementById("table");
  table.innerHTML = "";

  let data = task || getTasks();
  data.forEach((element) => {
    table.innerHTML += `
      <tr> 
        <td><input type="text" name="" id="taskName_${element.id}" value="${element.taskName}"></td>
        <td></td>
        <td></td>
        <td><button id="${element.id}_${element.startTaskTime}" onclick="removeTask(${element.id})" type="button">Sil</td>
        <td><button id="${element.id}_${element.endTaskTime}" type="button" onclick="updateTask(${element.id})">Güncelle</td>
        <td><div id="iconDiv_${element.id}"></div></td>
        <td><input type="checkbox" name="" id="checkbox_${element.id}" onclick="isCheckBoxChecked(${element.id})"></td>
      </tr>
    `;
  });
  checkTaskDate();
} */

function allData(task) {
  const tasks = document.getElementById("task-List");
  tasks.innerHTML = "";

  let data = task || getTasks();
  data.forEach((element) => {
    tasks.innerHTML += `
      <div class="task-card">
        <div class="task-left"><input type="checkbox"></div>
        <div class="task-text">${element.taskName}</div>
        <div>${element.startTaskTime}</div>
        <div class="task-actions">
          <button class="updateBtn" id="updateBtn" onclick="updateTask(${element.id})">✏️</button>
          <button style="color: red;" class="deleteBtn" onclick="removeTask(${element.id})">✖</button>
        </div>
      </div>

    `;
  });
  checkTaskDate();
}

function isCheckBoxChecked(id) {
  const checkBox = document.getElementById(`checkbox_${id}`);
  const table = document.getElementById("table");

  const row = checkBox.closest("tr");
  if (checkBox.checked === true) {
    table.appendChild(row);
    row.classList.add("completed");
  } else {
    table.insertBefore(row, table.firstChild);
    row.classList.remove("completed");
  }
}

const openBtn = document.getElementById("openModal");
const modal = document.getElementById("modal");

openBtn.addEventListener("click", () => {
  modal.classList.toggle("open");
});
