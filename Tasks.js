const today = new Date();
const localDate = today.toISOString().split("T")[0];
let curTaskID = null;

window.addEventListener("load", function () {
    this.document.querySelectorAll(".appear").forEach((el, i) => {
        this.setTimeout(() => el.classList.add("show"), i * 120);
    })
})
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
renderTasks(tasks);


function createTask(title, description, priority, dueDate, status) {
    return {
        id: Date.now(),
        title: title,
        description: description,
        priority: priority,
        dueDate: dueDate,
        status: status,
        createdAt: new Date().toISOString().split('T')[0]
    }
}

function addTask(task) {
    tasks.push(task);
    saveTasks();
    addTaskCard(task);
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks))
}


function addTaskCard(task) {
    let taskList = document.getElementById("taskList");
    let taskCard = document.createElement("div");



    if (isOverdue(task)) {
        let overdue = document.createElement("span");
        overdue.classList.add("overdueAlert");
        taskCard.appendChild(overdue)
        overdue.textContent = "OVERDUE"
    }
    taskList.appendChild(taskCard);
    let heading = document.createElement("h6");
    heading.classList.add("title");
    heading.appendChild(document.createTextNode(task.title))


    let priority = document.createElement("span");
    priority.classList.add("priority");
    priority.textContent = " " + task.priority;


    if (task.priority == "high" || task.priority == "High") {
        taskCard.classList.add("high-pri")
        priority.classList.add("high")
    }
    else if (task.priority == "Medium") {
        taskCard.classList.add("medium-pri")
        priority.classList.add("med")
    }
    else {
        taskCard.classList.add("low-pri")
        priority.classList.add("low")
    }

    taskCard.appendChild(heading);

    let des = document.createElement("span");
    des.classList.add("description");
    des.textContent = task.description;
    taskCard.appendChild(des);


    let dueDate = document.createElement("div");
    dueDate.classList.add("dueDate");
    let icon = document.createElement("img");
    icon.src = "images/calendar.png";
    icon.classList.add("calendar");

    dueDate.appendChild(icon);
    let due = " " + formatDate(task.dueDate);
    dueDate.appendChild(document.createTextNode(due))

    let div = document.createElement("div");
    div.classList.add("duePri")

    div.appendChild(priority);
    div.appendChild(dueDate);

    taskCard.appendChild(div);



    taskCard.classList.add("taskCard");

    let buttonsDiv = document.createElement("div");
    buttonsDiv.classList.add("btnsDiv");
    taskCard.appendChild(buttonsDiv);
    let editBtn = document.createElement("button");
    editBtn.setAttribute("type", "button");
    editBtn.classList.add("editBtn", "btns");
    editBtn.textContent = "Edit Task";
    buttonsDiv.appendChild(editBtn);

    editBtn.addEventListener("click", function () {
        curTaskID = task.id;
        let form = document.querySelector("#addTaskForm");
        form.elements.title.value = task.title;
        form.elements.description.value = task.description;
        form.elements.prior.value = task.priority;
        form.elements.prior.status = task.status;
        form.elements.dueDate.value = task.dueDate;

        document.getElementById("modal-container").style.display = "flex";
        document.getElementById("modal").style.display = "flex";

        document.querySelector(".formHeading").textContent = "Edit Task";
        document.querySelector("#submitButton").textContent = "Update Task";
    });

    let deleteBtn = document.createElement("button");
    deleteBtn.setAttribute("type", "button");
    deleteBtn.textContent = "Delete Task";
    deleteBtn.classList.add("deleteBtn", "btns");
    buttonsDiv.appendChild(deleteBtn);

    deleteBtn.addEventListener("click", function () {
        let taskCard = this.closest(".taskCard");

        if (!confirm("Are you sure you want to delete this task?Y/N")) {
            return;
        }

        tasks = tasks.filter(t => t.id != task.id);
        saveTasks();
        taskCard.remove();



    })
    let markCompleteBtn = document.createElement("button");
    markCompleteBtn.setAttribute("type", "button");
    markCompleteBtn.textContent = "Mark as Complete";
    markCompleteBtn.classList.add("markComplete", "btns");
    buttonsDiv.appendChild(markCompleteBtn);
    if (task.status === "Completed") {
        markCompleteBtn.textContent = "Mark as Pending";
        editBtn.disabled = true;
        taskCard.classList.add("completedTask");
    }

    markCompleteBtn.addEventListener("click", function () {
        let taskCard = this.closest(".taskCard");

        let taskToUpdate = tasks.find(t => t.id === task.id);
        if (!taskToUpdate) return;
        if (taskToUpdate.status === "Pending") {
            taskToUpdate.status = "Completed";
            saveTasks();

            taskCard.classList.add("completedTask");
            this.textContent = "Mark as Pending"
            document.getElementById("Completed").textContent = count("Completed");
            document.getElementById("Pending").textContent = count("Pending");
        }
        else {
            taskToUpdate.status = "Pending";
            saveTasks();
            taskCard.classList.remove("completedTask")
            this.textContent = "Mark as Complete";
            taskCard.querySelector(".editBtn").disabled = false;
            document.getElementById("Completed").textContent = count("Completed");
            document.getElementById("Pending").textContent = count("Pending");
        }
    })


}



const dateInput = document.getElementById("dueDate");



dateInput.min = localDate;

function addTaskButton() {
    document.getElementById("modal-container").style.display = "flex";
    document.getElementById("modal").style.display = "flex";
}

let addTaskbtn = document.getElementById("addTask");
addTaskbtn.addEventListener("click", addTaskButton);

document.getElementById("modal-container").addEventListener("click", function (e) {
    document.getElementById("modal-container").style.display = "none";
    document.getElementById("modal").style.display = "none";
    document.querySelector("#addTaskForm").reset();
})

document.getElementById("closebtn").addEventListener("click", function () {
    document.getElementById("modal-container").style.display = "none";
    document.getElementById("modal").style.display = "none";
    document.querySelector("#addTaskForm").reset();
})

document.getElementById("modal").addEventListener("click", function (e) {
    e.stopPropagation();
});

function SubmitButton(e) {
    e.preventDefault();
    let form = document.querySelector("#addTaskForm");
    let title = form.elements.title.value;
    let description = form.elements.description.value;
    let priority = form.elements.priorityForm.value;
    let dueDate = form.elements.dueDate.value;
    let status = form.elements.statusForm.value;
    if (!title.trim() || !description.trim() || !priority || !dueDate) {
        alert("Please input all fields!");
    }
    else {
        if (curTaskID) {
            let taskToEdit = tasks.find(t => t.id === curTaskID);
            taskToEdit.title = title;
            taskToEdit.description = description;
            taskToEdit.priority = priority;
            taskToEdit.status = status;

            taskToEdit.dueDate = dueDate;
            saveTasks();
            form.reset();
            alert("Your task updated successfully!");
            location.reload();
        }
        else {
            addTask(createTask(title, description, priority, dueDate, status));
            form.reset();
            alert("Your task added successfully!");


        }
    }

    curTaskID = null


}



document.getElementById("submitButton").addEventListener("click", SubmitButton);


function count(status) {
    let count = tasks.reduce((acc, item) => {
        return item.status === status ? acc + 1 : acc;
    }, 0)

    return count;
}



let dashboardBtn = document.getElementById('Dashboard')

dashboardBtn.addEventListener('click', () => {
    location.href = 'dashboard.html';
})

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
    });
}

function renderTasks(list) {
    const taskList = document.getElementById("taskList");
    taskList.textContent = "";
    let completedTasks = list.filter(t => t.status === "Completed");
    let pendingTasks = list.filter(t => t.status === "Pending");
    if (tasks.length == 0) {
        document.getElementById("taskList").textContent = "No tasks to display";
    }
    else {
        pendingTasks.forEach(task => { if (task) addTaskCard(task) });
        completedTasks.forEach(task => {
            if (task) addTaskCard(task);
        });
    }

}

const priorDropdown = document.getElementById("prior");
const statusDropdown = document.getElementById("statusFilter");

priorDropdown.addEventListener("change", applyFilters);
statusDropdown.addEventListener("change", applyFilters);

function applyFilters() {
    let filtered = [...tasks];

    if (priorDropdown.value !== "All priority") {
        filtered = filtered.filter(
            t => t.priority.toLowerCase() === priorDropdown.value.toLowerCase()
        );
    }

    if (statusDropdown.value !== "All Status") {
        filtered = filtered.filter(
            t => t.status.toLowerCase() === statusDropdown.value.toLowerCase()
        );
    }

    const query = searchBar.value.toLowerCase().trim();

    if (query !== "") {
        filtered = filtered.filter(t => {

            // Overdue keyword (partial match)
            if (query.length >= 2 && "overdue".includes(query)) {
                return isOverdue(t);
            }

            return (
                t.title.toLowerCase().includes(query) ||
                t.description.toLowerCase().includes(query) ||
                t.priority.toLowerCase().includes(query) ||
                t.status.toLowerCase().includes(query)
            );
        });
    }
    renderTasks(filtered);

}


let searchBar = document.getElementById("search");

searchBar.addEventListener("keyup", applyFilters);


function isOverdue(task) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const taskDate = new Date(task.dueDate);
    taskDate.setHours(0, 0, 0, 0);

    return taskDate < today && task.status === "Pending";
}