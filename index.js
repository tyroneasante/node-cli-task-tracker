#!/usr/bin/env node
const fs = require('fs')
const filename = "tasks.json"
const userInput = process.argv.slice(2);

let allTasks;
try {
    allTasks = JSON.parse(fs.readFileSync(filename, "utf8"));
} catch (error) {
    allTasks = [];
}

const updateFile = (tasks) => {
    fs.writeFileSync(filename, JSON.stringify(tasks))
}

const findTaskIndex = (id) => {
    return allTasks.findIndex(task => task.id == id);
} 

const numerateFiles = () => {
    allTasks.forEach((task, index) => {
        task.id = index;
    });
    updateFile(allTasks)
}

const addTask = () => {
    const newTask = {
        "id": 0,
        "description": "",
        "status": "todo",
        "createdAt": Date.now(),
        "updatedAt": ""
    }

    newTask.id = allTasks.length
    newTask.description = userInput[1]

    allTasks.push(newTask)

    updateFile(allTasks)
}

const updateTask = () => {
    const taskId = userInput[1];
    const updatedDescription = userInput[2];

    const targetTask = allTasks[findTaskIndex(taskId)];
    
    if (!targetTask) {
        console.log("Hmm, diese Task existiert nicht :/")
        return
    }

    targetTask.description = updatedDescription;
    targetTask.updatedAt = Date.now();

    updateFile(allTasks)
}

const deleteTask = () => {
    const taskIndex = findTaskIndex(userInput[1])

    if (taskIndex < 0) {
        console.log("Hmm, diese Task existiert nicht :/")
        return;
    }

    allTasks.splice(taskIndex, 1)
    
    updateFile(allTasks);
    numerateFiles(allTasks);
}

const markInProgress = () => {
    const taskIndex = findTaskIndex(userInput[1])

    if (taskIndex < 0) {
        console.log("Hmm, diese Task existiert nicht :/")
        return;
    }
    allTasks[taskIndex].status = "in-progress";

    updateFile(allTasks);
}

const markDone = () => {
    const taskIndex = findTaskIndex(userInput[1])
    if (taskIndex < 0) {
        console.log("Hmm, diese Task existiert nicht :/")
        return;
    }
    allTasks[taskIndex].status = "done";

    updateFile(allTasks);
}

const list = () => {
    let filteredTasks;
    
    if (userInput[1]) {
        filteredTasks = allTasks.filter(task => task.status === userInput[1]);
    } else {
        filteredTasks = allTasks;
    }
    filteredTasks.forEach(task => {
        let color;
        switch (task.status) {
            case "in-progress":
                color = 33
                break;
            case "done":
                color = 32
                break;
            default:
                color = 31
                break;
        }
        console.log(`\x1b[${color}m${task.id} ${task.description}\x1b[0m`);
    })
}

switch (userInput[0]) {
    case "add":
        addTask();
        break;

    case "update":
        updateTask();
        break;

    case "delete":
        deleteTask();
        break;

    case "mark-in-progress":
        markInProgress();
        break;

    case "mark-done":
        markDone();
        break;

    case "list":
        list();
        break;
    default:
        console.log('Diese Funktion existiert nicht')
        break;
}