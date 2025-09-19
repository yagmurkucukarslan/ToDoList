function getTasks(params) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  return tasks;
}

function setTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function inputValidation(inputVal) {
  // Burada input ko
  // ntrolleri yapılacak
  return true;
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
  const startTaskDate = document.getElementById("startTaskDate");
  const endTaskDate = document.getElementById("endTaskDate");
  inputTaskVal = inputTask.value;

  const isInputTask = inputValidation(inputTaskVal);
  const isDate = checkDateValue(startTaskDate.value, endTaskDate.value);

  if (isInputTask) {
    if (isDate) {
      const taskId = uniqueIdGenerator();
      const taskItem = {
        id: taskId,
        taskName: inputTaskVal,
        startTaskTime: startTaskDate.value,
        endTaskTime: endTaskDate.value,
      };

      let tasks = getTasks();
      tasks.push(taskItem);
      setTasks(tasks);

      createDeleteButton(taskItem);
      createUpdateButton(taskItem);
    } else return;
  } else {
    return;
  }
}

function createDeleteButton(item) {
  const paragraph = document.getElementById("taskParagraph");
  const buttonDiv = document.getElementById("div-delete-button-tasks");

  paragraph.innerHTML += `<p>${item.taskName}</p>`;
  const buttonDelete = document.createElement("button");

  buttonDelete.setAttribute("id", item.id);
  buttonDelete.type = "button";
  buttonDelete.innerText = "Sil " + item.taskName;

  buttonDelete.addEventListener("click", () => removeTask(item.id));

  buttonDiv.appendChild(buttonDelete);
}

function createUpdateButton(item) {
  const buttonDiv = document.getElementById("div-update-button-tasks");

  const buttonUpdate = document.createElement("button");

  buttonUpdate.setAttribute("id", item.id);
  buttonUpdate.type = "button";
  buttonUpdate.innerText = "Güncelle " + item.taskName;

  buttonDiv.appendChild(buttonUpdate);
}

function removeTask(id) {
  let tasks = getTasks();
  tasks = tasks.filter((e) => e.id !== id);
  setTasks(tasks);
}

function checkDateValue(startDate, endDate) {
  if (startDate == "" || endDate == "") {
    console.log("burdayım be burdayım ");
    alert("date değeri ekle");
    return false;
  } else return true;
}

function dateMinMax() {
  const startTaskDate = document.getElementById("startTaskDate");
  const endTaskDate = document.getElementById("endTaskDate");

  startDateVal = startTaskDate.value;
  endDateVal = endTaskDate.value;
  console.log(startDateVal);
  console.log(endDateVal);
  if (startDateVal != "" && endDateVal == "") {
    console.log("burda");
    endTaskDate.min = startDateVal;
  } else if (endDateVal != "" && startDateVal == "") {
    startTaskDate.max = endDateVal;
  }
}

/* function createCategory() {
  let categories = [];

  const input = document.getElementById("inputCategory");
  inputVal = input.value;

  const isInputValid = inputValidation(inputVal);

  if (isInputValid) {
    const inputId = uniqueIdGenerator();
    const item = {
      id: inputId,
      category_name: inputVal,
    };
    categories.push(item);
    localStorage.setItem("category", JSON.stringify(categories));
    createButton(item);
  } else {
    return;
  }
}
 */


/* function fetchData() {
  
} */