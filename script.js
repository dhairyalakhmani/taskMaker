// let add = document.querySelector(".add");
// add.addEventListener("click", () => {
//     let modal = document.querySelector(".main-body");
//     modal.hidden = false;
// });
// let selected=null;
// const priorities = document.querySelectorAll(".priority-set");
// priorities.forEach(priority=>{
//     priority.addEventListener("click",()=>{
//         priorities.forEach(o=>o.classList.remove("selected"));
//         priority.classList.add("selected");
//         selected=priority.classList[1];
//     })
// })

// let taskTitle = document.querySelector("#task-title");
// let taskInput = document.querySelector(".task-write");
// let saveBtn = document.querySelector(".save");
// let errorMsg = document.querySelector(".error-msg");
// let task_container=document.querySelector(".task-container");

// saveBtn.addEventListener("click", () => {
//     let title = taskTitle.value.trim();
//     let desc = taskInput.value.trim();

//     if (title === "") {
//         errorMsg.style.display = "block";
//         errorMsg.textContent = "Task title cannot be empty!";
//         return;
//     }

//     if (desc === "") {
//         errorMsg.style.display = "block";
//         errorMsg.textContent = "Task description cannot be empty!";
//         return;
//     }

//     if (selected === null) {
//         errorMsg.style.display = "block";
//         errorMsg.textContent = "Please select a priority!";
//         return;
//     }

//     errorMsg.style.display = "none";

//     // // TEMP (for debugging)
//     // console.log("Title:", title);
//     // console.log("Description:", desc);
//     // console.log("Priority:", selected);
//     let card=document.createElement("div");
//     errorMsg.textContent = "";
//     card.classList.add("task-card",selected + "-priority");
//     let header=document.createElement("div");
//     header.classList.add("task-header");
//     let task_title=document.createElement("span");
//     task_title.classList.add("task-title");
//     task_title.textContent=taskTitle.value;
//     let task_priority=document.createElement("span");
//     task_priority.classList.add("task-priority", selected+"-priority");
//     task_priority.textContent=`${selected} Priority`;
//     header.appendChild(task_title);
//     header.appendChild(task_priority);
//     card.appendChild(header);

//     let body=document.createElement("div");
//     body.classList.add("task-body");
//     let describe=document.createElement("p");
//     describe.classList.add("task-details");
//     describe.textContent=taskInput.value;
//     body.appendChild(describe);
//     card.appendChild(body);

//     let footer=document.createElement("div");
//     footer.classList.add("task-footer");
//     let edit=document.createElement("button");
//     edit.classList.add("edit-task");
//     edit.textContent="Edit";
//     footer.appendChild(edit);
//     let deleted=document.createElement("button");
//     deleted.classList.add("delete-task");
//     deleted.textContent="Delete";
//     footer.appendChild(deleted);
//     card.appendChild(footer);

//     task_container.appendChild(card);
//     let modal = document.querySelector(".main-body");
//     modal.hidden=true;
    
//     deleted.addEventListener("click", () => {
//         card.remove();
//     });

//     edit.addEventListener("click", () => {
//     modal.hidden = false;

//     taskTitle.value = task_title.textContent;
//     taskInput.value = describe.textContent;
//     priorities.forEach(p => p.classList.remove("selected"));
//     document.querySelector("." + selected).classList.add("selected");

//     card.remove();
// });

//     taskTitle.value = "";
//     taskInput.value = "";
//     selected = null;

//     priorities.forEach(p => p.classList.remove("selected"));

// });












// ----------------------------
// GLOBALS
// ----------------------------
const add = document.querySelector(".add");
const modal = document.querySelector(".main-body");
const task_container = document.querySelector(".task-container");
const taskTitle = document.querySelector("#task-title");
const taskInput = document.querySelector(".task-write");
const saveBtn = document.querySelector(".save");
const errorMsg = document.querySelector(".error-msg");
const priorities = document.querySelectorAll(".priority-set");

let selected = null;   // priority selected
let editingId = null;  // if editing old task

// ----------------------------
// LOCAL STORAGE HELPERS
// ----------------------------
function loadTasks() {
    return JSON.parse(localStorage.getItem("tasks")) || [];
}

function saveTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ----------------------------
// TEMPLATE FOR EACH TASK
// ----------------------------
function taskTemplate(task) {
    return `
        <div class="task-card ${task.priority}-priority" data-id="${task.id}">
            <div class="task-header">
                <span class="task-title">${task.title}</span>
                <span class="task-priority ${task.priority}-priority">
                    ${task.priority} Priority
                </span>
            </div>

            <div class="task-body">
                <p class="task-details">${task.desc}</p>
            </div>

            <div class="task-footer">
                <button class="edit-task">Edit</button>
                <button class="delete-task">Delete</button>
            </div>
        </div>
    `;
}

// ----------------------------
// RENDER USING MAP()
// ----------------------------
function renderTasks() {
    let tasks = loadTasks();
    task_container.innerHTML = tasks.map(t => taskTemplate(t)).join("");

    attachDeleteEvents();
    attachEditEvents();
}

// ----------------------------
// ATTACH DELETE BUTTON FUNCTION
// ----------------------------
function attachDeleteEvents() {
    document.querySelectorAll(".delete-task").forEach(btn => {
        btn.addEventListener("click", () => {
            let id = btn.closest(".task-card").dataset.id;
            let tasks = loadTasks().filter(t => t.id !== id);
            saveTasks(tasks);
            renderTasks();
        });
    });
}

// ----------------------------
// ATTACH EDIT BUTTON FUNCTION
// ----------------------------
function attachEditEvents() {
    document.querySelectorAll(".edit-task").forEach(btn => {
        btn.addEventListener("click", () => {
            let card = btn.closest(".task-card");
            let id = card.dataset.id;

            let tasks = loadTasks();
            let task = tasks.find(t => t.id === id);

            editingId = id; // mark as editing mode

            // fill modal
            taskTitle.value = task.title;
            taskInput.value = task.desc;

            priorities.forEach(p => p.classList.remove("selected"));
            document.querySelector("." + task.priority).classList.add("selected");

            selected = task.priority;
            modal.hidden = false;
        });
    });
}

// ----------------------------
// PRIORITY SELECTION
// ----------------------------
priorities.forEach(p => {
    p.addEventListener("click", () => {
        priorities.forEach(x => x.classList.remove("selected"));
        p.classList.add("selected");
        selected = p.classList[1]; // high / medium / low / critical
    });
});

// ----------------------------
// OPEN MODAL
// ----------------------------
add.addEventListener("click", () => {
    editingId = null; // not editing
    taskTitle.value = "";
    taskInput.value = "";
    priorities.forEach(p => p.classList.remove("selected"));
    selected = null;

    modal.hidden = false;
});

// ----------------------------
// SAVE BUTTON CLICK
// ----------------------------
saveBtn.addEventListener("click", () => {
    let title = taskTitle.value.trim();
    let desc = taskInput.value.trim();

    // VALIDATIONS
    if (!title) {
        errorMsg.textContent = "Task title cannot be empty!";
        errorMsg.style.display = "block";
        return;
    }
    if (!desc) {
        errorMsg.textContent = "Task description cannot be empty!";
        errorMsg.style.display = "block";
        return;
    }
    if (!selected) {
        errorMsg.textContent = "Please select a priority!";
        errorMsg.style.display = "block";
        return;
    }

    errorMsg.style.display = "none";

    let tasks = loadTasks();

    // If editing an old task
    if (editingId !== null) {
        tasks = tasks.map(t => {
            if (t.id === editingId) {
                return {
                    ...t,
                    title,
                    desc,
                    priority: selected
                };
            }
            return t;
        });
    } 
    else {
        // ADD NEW TASK
        let task = {
            id: Date.now().toString(),
            title,
            desc,
            priority: selected
        };
        tasks.push(task);
    }

    saveTasks(tasks);
    renderTasks();

    // reset modal
    taskTitle.value = "";
    taskInput.value = "";
    selected = null;
    priorities.forEach(p => p.classList.remove("selected"));

    modal.hidden = true;
});

// Initial load
renderTasks();
