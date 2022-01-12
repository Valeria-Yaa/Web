function removeTaskElement(id){
    fetch('http://tasks-api.std-900.ist.mospolytech.ru/api/tasks/' + id + '?api_key=50d2199a-42dc-447d-81ed-d68a443b697e', {
        method: 'DELETE',
    })
}

function removeTaskBtnHandLer(event) {
    let form = event.target.closest(".modal").querySelector("form");
    let taskElement = document.getElementById(form.elements["task-id"].value);

    let id = form.elements["task-id"].value;
    fetch('http://tasks-api.std-900.ist.mospolytech.ru/api/tasks/' + id + '?api_key=50d2199a-42dc-447d-81ed-d68a443b697e')
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data.status);
            if (data.status == "to-do"){
                let counter = document.querySelector(".todo");
                counter.querySelector(".badge").innerHTML= Number(counter.querySelector(".badge").innerHTML) - 1;
            } else {
                let counter = document.querySelector(".done");
                counter.querySelector(".badge").innerHTML= Number(counter.querySelector(".badge").innerHTML) - 1;
            }
        });

    removeTaskElement(id);

    taskElement.remove();
}

function resetForm(form) {
    form.reset();
    form.elements["name"].classList.remove("form-control-plaintext");
    form.elements["desc"].classList.remove("form-control-plaintext");
}

function showAlert (msg) {
    let alertsContainer = document.querySelector(".alerts");
    let newAlert = document.querySelector(".alert").cloneNode(true);
    newAlert.querySelector(".msg").innerHTML = msg;
    newAlert.classList.remove("d-none");
    alertsContainer.append(newAlert);
}

function setFormValues(form, taskid) {
    let taskElement = document.getElementById(taskid);
    form.elements["name"].value = taskElement.querySelector(".task-name").textContent;
    form.elements["desc"].value = taskElement.querySelector(".task-description").textContent;
    form.elements["task-id"].value = taskid;
}

function putUpdateTask(data, id){
    fetch('http://tasks-api.std-900.ist.mospolytech.ru/api/tasks/' + id + '?api_key=50d2199a-42dc-447d-81ed-d68a443b697e', {
        method: 'PUT',
        body: data
      });
}

function updateTask (form) {
    let taskElement = document.getElementById(form.elements['task-id'].value);
    taskElement.querySelector(".task-name").textContent = form.elements["name"].value;
    taskElement.querySelector(".task-description").textContent = form.elements["desc"].value;

    let data = new FormData();
    data.append('desc', form.elements["desc"].value);
    data.append('name',  form.elements["name"].value);
      
    putUpdateTask(data, form.elements["task-id"].value);
}

//Обработчик перемещения
function moveBtnHandler(event){
    let taskElement = event.target.closest('.task');
    let currentTableElement = event.target.closest('tbody');
    console.log(currentTableElement.id);
    let targetTableElement = document.getElementById(currentTableElement.id == 'to-do-list' ? 'done-list' : 'to-do-list');

    let column = (currentTableElement.id == 'to-do-list' ? 'done' : 'to-do');
    id = event.target.closest('.task').id;

    targetTableElement.append(taskElement);

    if (currentTableElement.id == 'to-do-list'){
        let counter = document.querySelector(".todo");
        counter.querySelector(".badge").innerHTML= Number(document.querySelector(".badge").innerHTML) - 1;
        counter = document.querySelector(".done");
        counter.querySelector(".badge").innerHTML= Number(counter.querySelector(".badge").innerHTML) + 1;     
    
    } else{
        let counter = document.querySelector(".todo");
        counter.querySelector(".badge").innerHTML= Number(document.querySelector(".badge").innerHTML) + 1;
        counter = document.querySelector(".done");
        counter.querySelector(".badge").innerHTML= Number(counter.querySelector(".badge").innerHTML) - 1;     
    }

    let data = new FormData();
    data.append('status', column);
    fetch('http://tasks-api.std-900.ist.mospolytech.ru/api/tasks/' + id + '?api_key=50d2199a-42dc-447d-81ed-d68a443b697e', {
        method: 'PUT',
        body: data
      });
}

function postCreateTaskElement(data){
    fetch('http://tasks-api.std-900.ist.mospolytech.ru/api/tasks?api_key=50d2199a-42dc-447d-81ed-d68a443b697e', {
        method: 'POST',
        body: data
      });
}

function createTaskElement(form) {

    let newTaskElement = document.getElementById("task-template").cloneNode(true);
    newTaskElement.id = taskCounter++;
    newTaskElement.querySelector(".task-name").textContent = form.elements["name"].value;
    newTaskElement.querySelector(".task-description").textContent = form.elements["desc"].value;
    newTaskElement.classList.remove("d-none");

    if (form.elements["column"].value == "to-do"){
        let counter = document.querySelector(".todo");
        counter.querySelector(".badge").innerHTML= Number(counter.querySelector(".badge").innerHTML) + 1;
    } else {
        let counter = document.querySelector(".done");
        counter.querySelector(".badge").innerHTML= Number(counter.querySelector(".badge").innerHTML) + 1;
    }

    //стрелка перемещения
    for (btn of newTaskElement.querySelectorAll('.move-done')){
        btn.onclick = moveBtnHandler;
    }
    for (btn of newTaskElement.querySelectorAll('.move-to-do')){
        btn.onclick = moveBtnHandler;
    }

    let data = new FormData();
    data.append('desc', form.elements["desc"].value);
    data.append('id',  newTaskElement.id);
    data.append('name',  form.elements["name"].value);
    data.append('status',  form.elements["column"].value);
      
    postCreateTaskElement(data);
    console.log(newTaskElement.id);

    return newTaskElement;
}

function actionTaskBtnHandLer (event) {
    let alertMsg;
    let form = this.closest(".modal").querySelector("form");
    let action = form.elements["action"].value;
    console.log(action);
    if (action == "new") {
        document.getElementById(`${form.elements["column"].value}-list`).append(createTaskElement(form));
        alertMsg = `Задача ${form.elements["name"].value} создана успешно!`;
        form.reset();  
    } else if (action == "edit") {
        updateTask (form);
        alertMsg = `Задача ${form.elements["name"].value} обновлена успешно!`;
    }

    if (alertMsg) showAlert(alertMsg);
}

function loading_task_list(form){
    let newTaskElement = document.getElementById("task-template").cloneNode(true);
    newTaskElement.id = form["id"];
    newTaskElement.querySelector(".task-name").textContent = form["name"];
    newTaskElement.querySelector(".task-description").textContent = form["desc"];
    newTaskElement.classList.remove("d-none");

    if (form["status"] == "to-do"){
        let counter = document.querySelector(".todo");
        counter.querySelector(".badge").innerHTML= Number(counter.querySelector(".badge").innerHTML) + 1;
    } else {
        let counter = document.querySelector(".done");
        counter.querySelector(".badge").innerHTML= Number(counter.querySelector(".badge").innerHTML) + 1;
    }

    //стрелка перемещения
    for (btn of newTaskElement.querySelectorAll('.move-done')){
        btn.onclick = moveBtnHandler;
    }
    for (btn of newTaskElement.querySelectorAll('.move-to-do')){
        btn.onclick = moveBtnHandler;
    }

    return newTaskElement;
}

let taskCounter = 0;


let titles = {
    "new": "Создание новой задачи",
    "edit": "Редактирование задачи",
    "show": "Просмотр задачи",
}

let actionBtnText = {
    "new": "Создать",
    "edit": "Сохранить",
    "show": "Ок",
}

window.onload = function() {

    fetch('http://tasks-api.std-900.ist.mospolytech.ru/api/tasks?api_key=50d2199a-42dc-447d-81ed-d68a443b697e')
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            for (let i = 0; i < Object.keys(data.tasks).length; i++) {
                let form = {
                    "name": data.tasks[i].name,
                    "desc": data.tasks[i].desc,
                    "id": data.tasks[i].id,
                    "status": data.tasks[i].status,
                }
                document.getElementById(`${data.tasks[i].status}-list`).append(loading_task_list(form));
            }
            taskCounter = data.tasks[Object.keys(data.tasks).length - 1].id + 1;
            console.log(taskCounter);
        });

    document.querySelector(".action-task-btn").onclick = actionTaskBtnHandLer;
    
    var taskModal = document.getElementById("task-modal");
    taskModal.addEventListener("show.bs.modal", function(event) {
        let form = document.querySelector("form");
        resetForm(form);
        let action = event.relatedTarget.dataset.action || "new";
        form.elements['action'].value = action;
        this.querySelector(".modal-title").textContent = titles[action];
        this.querySelector(".action-task-btn").textContent = actionBtnText[action];

        console.log(action);
        if (action == "edit" || action == "show") {
            setFormValues(form, event.relatedTarget.closest(".task").id);
            this.querySelector('.column').classList.add('d-none');
            this.querySelector('.list').classList.add('d-none');
        }

        if (action == "show") {
            form.elements["name"].classList.add("form-control-plaintext");
            form.elements["desc"].classList.add("form-control-plaintext");
        }
    })
    
    var taskModal = document.getElementById("remove-task-modal");
    taskModal.addEventListener("show.bs.modal", function(event) {
        let taskElement = event.relatedTarget.closest(".task");
        let form = event.target.querySelector("form");
        form.elements["task-id"].value = taskElement.id;
        event.target.querySelector(".task-name").textContent = taskElement.querySelector(".task-name").textContent;
    })

    document.querySelector(".remove-task-btn").onclick = removeTaskBtnHandLer;
    
    let taskElement = event.relatedTarget.closest(".task");
    let tasksCounterElement = taskElement.closest('.card').querySelector('.task-counter');
    tasksCounterElement.innerHTML = Number(tasksCounterElement.innerHTML)-1;
}