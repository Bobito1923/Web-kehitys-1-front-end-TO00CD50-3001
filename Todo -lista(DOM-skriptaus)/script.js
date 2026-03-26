const form = document.getElementById("todo-form");
const input = document.getElementById("task-input");
const list = document.getElementById("task-list");
const errorMsg = document.getElementById("error-msg");
const counter = document.getElementById("task-counter");
const deleteSelectedBtn = document.getElementById("delete-selected");
const clearAllBtn = document.getElementById("clear-all");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function showError(msg) {
    errorMsg.textContent = msg;
    input.classList.add("invalid");
}

function clearError() {
    errorMsg.textContent = "";
    input.classList.remove("invalid");
}

function validate(text) {
    if (text.trim() === "") return "Task cannot be empty";
    if (text.trim().length < 3) return "Minimum 3 characters";
    return "";
}

function updateCounter() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.selected).length;
    counter.textContent = `${completed}/${total}`;
}

function render() {
    list.innerHTML = "";

    tasks.forEach(task => {
        const li = document.createElement("li");
        li.classList.add("task-item");

        const span = document.createElement("span");
        span.className = "task-text";
        span.textContent = task.text;

        if (task.selected) {
            li.classList.add("done");
            span.classList.add("done");
        }

        const markerBtn = document.createElement("button");
        markerBtn.className = "marker-btn";
        markerBtn.type = "button";
        markerBtn.textContent = "✓";

        if (task.selected) {
            markerBtn.classList.add("active");
        }

        markerBtn.addEventListener("click", () => {
            task.selected = !task.selected;
            saveTasks();
            render();
        });

        li.appendChild(span);
        li.appendChild(markerBtn);

        list.appendChild(li);
    });

    updateCounter();
}

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const value = input.value;
    const error = validate(value);

    if (error) {
        showError(error);
        return;
    }

    clearError();

    const newTask = {
        id: Date.now(),
        text: value.trim(),
        selected: false
    };

    tasks.push(newTask);
    saveTasks();
    render();
    input.value = "";
});

input.addEventListener("input", clearError);

deleteSelectedBtn.addEventListener("click", () => {
    tasks = tasks.filter(task => !task.selected);
    saveTasks();
    render();
});

clearAllBtn.addEventListener("click", () => {
    tasks = [];
    saveTasks();
    render();
});

render();