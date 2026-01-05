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