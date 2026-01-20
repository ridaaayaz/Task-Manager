const demoTasks = [
    {
        id: Date.now() + 1,
        title: "Check emails",
        description: "Review and respond to important emails",
        priority: "Low",
        dueDate: "2026-01-19",
        status: "Pending",
        createdAt: "2026-01-16"
    },
    {
        id: Date.now() + 2,
        title: "Complete project report",
        description: "Finalize and submit the task manager project report",
        priority: "High",
        dueDate: "2026-01-18",
        status: "Pending",
        createdAt: "2026-01-15"
    },
    {
        id: Date.now() + 3,
        title: "Attend team meeting",
        description: "Daily stand-up meeting with the development team",
        priority: "Medium",
        dueDate: "2026-01-16",
        status: "Completed",
        createdAt: "2026-01-16"
    },
    {
        id: Date.now() + 4,
        title: "Update task analytics",
        description: "Review task completion statistics on dashboard",
        priority: "Medium",
        dueDate: "2026-01-17",
        status: "Pending",
        createdAt: "2026-01-15"
    },
    {
        id: Date.now() + 5,
        title: "Plan next day tasks",
        description: "Prepare task list and priorities for tomorrow",
        priority: "Low",
        dueDate: "2026-01-20",
        status: "Pending",
        createdAt: "2026-01-16"
    },
    {
        id: Date.now() + 6,
        title: "Review code merge requests",
        description: "Check and approve pending pull requests",
        priority: "High",
        dueDate: "2026-01-17",
        status: "Pending",
        createdAt: "2026-01-15"
    },
    {
        id: Date.now() + 7,
        title: "Organize files",
        description: "Clean up project directories and remove old files",
        priority: "Low",
        dueDate: "2026-01-21",
        status: "Pending",
        createdAt: "2026-01-16"
    }
];


if (!localStorage.getItem("tasks")) {
    localStorage.setItem("tasks", JSON.stringify(demoTasks));
}

window.addEventListener("load", function () {
    this.document.querySelectorAll(".appear").forEach((el, i) => {
        this.setTimeout(() => el.classList.add("show"), i * 120);
    })
})
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let pendingTasks = tasks.filter(t => t.status === "Pending");

let completed = count("Completed");
document.getElementById("Completed").textContent = completed;

let pending = count("Pending");
document.getElementById("Pending").textContent = pending;

let total = tasks.reduce((acc, item) => item ? acc + 1 : acc, 0);
document.getElementById("Total").textContent = total;

const today = new Date();
today.setHours(0, 0, 0, 0);

let overdue = pendingTasks.reduce((acc, task) => {
    return isOverdue(task) ? acc + 1 : acc;
}, 0);

document.getElementById("Overdue").textContent = overdue;


function isOverdue(task) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const taskDate = new Date(task.dueDate);
    taskDate.setHours(0, 0, 0, 0);

    return taskDate < today && task.status === "Pending";
}

function count(status) {
    let count = tasks.reduce((acc, item) => {
        return item.status === status ? acc + 1 : acc;
    }, 0)

    return count;
}

let viewBtn = document.getElementById('viewTasks')
viewBtn.addEventListener('click',()=>{
    location.href = 'Tasks.html';
})

function addTaskCard(task) {
    let taskList = document.getElementById("upcomingList");
    let taskCard = document.createElement("div");

     if(isOverdue(task))
    {
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
    
    

    taskCard.classList.add("upcomingTask");



}

if (pendingTasks.length == 0) {
    document.getElementById("upcomingList").textContent = "No upcoming Tasks";
}
else {
     pendingTasks
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 2) 
        .forEach(task => addTaskCard(task));

}


function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}