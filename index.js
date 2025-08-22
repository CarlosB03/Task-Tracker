const fs = require('fs')
const path = require('path')

const FILE_PATH = path.join(__dirname, 'tasks.json')

// Check if the file path exist if not create one and initialize to an empty array
if(!fs.existsSync(FILE_PATH)) {
    fs.writeFileSync(FILE_PATH, JSON.stringify([]))
}

function loadTasks() {
    const data = fs.readFileSync(FILE_PATH, 'utf-8');
    return JSON.parse(data) // Convert JSON data to JS Object
}

function saveTasks(task) {
    fs.writeFileSync(FILE_PATH, JSON.stringify(task, null, 2), 'utf-8')
}

function addTask(tasks) {
    const task = loadTasks();

    // Get next task ID
    // Next ID = highest current ID + 1
    // Increment max task ID (... spreads IDs)
    const idIncrement = task.length > 0 ? Math.max(...task.map(t => t.id + 1)) : 1;

    const newTask = {
        id: idIncrement,
        description: tasks,
        status: 'to-do',
        createdAt: Date.now(),
        updatedAt: Date.now()
    }

    task.push(newTask);
    saveTasks(task);
    console.log(`Task added successfully (ID:${newTask.id})`)
}

function updateDescription(id, newDescription) {
    const task = loadTasks();
    const findTask = task.find(t => t.id == id)

    if(!findTask) {
        console.log('Task does not exist')
        return;
    }

    findTask.description = newDescription;
    saveTasks(task)
    console.log("Updated task Successfully!")
}

function deleteTask(id) {

    const task = loadTasks();

    //If an ID is not found it returns -1
    const taskIndex = task.findIndex(t => t.id == id)

    if(taskIndex === -1) {
        console.log('Task # does not exist')
        return;
    }

    console.log(`Successfully removed '${task[taskIndex].description}'`)
    const removedTask = task.splice(taskIndex, 1)
    saveTasks(task);

}

function markToDo(id) {
    const task = loadTasks();

    const findTask = task.find(t => t.id == id)
    if(!findTask) {
        console.log('Task # does not exist. Please try again.')
        return;
    }
    findTask.status = 'to-do'
    saveTasks(task)
    console.log('Successfully updated status!')
}

function markInProgress(id) {
    const task = loadTasks();

    const findTask = task.find(t => t.id == id)
    if(!findTask) {
        console.log('Task # does not exist. Please try again.')
        return;
    }
    findTask.status = 'in-progress'
    saveTasks(task);
    console.log('Successfully updated status!')
}

function markDone(id) {
    const task = loadTasks()

    const findTask = task.find(t => t.id === id);
    if(!findTask) {
        console.log('Task # does not exist. Please try again.')
        return;
    }
    findTask.status = 'done';
    saveTasks(task)
    console.log('Successfully updated status!')
}

function listTask(status) {
    const task = loadTasks()

    if(task.length === 0) {
        console.log("No task exists")
        return;
    }

    if(!status) {
        task.forEach(t => {
            console.log(`ID: ${t.id} \n Description: ${t.description}\n Status: ${t.status}\n`)
        });
        return;
    }

    const validStatus = ['to-do', 'in-progress', 'done']
    if(!validStatus.includes(status)) {
        console.log('Invalid input');
        return;
    }

    const filterTask = task.filter(t => t.status == status)

    if(filterTask.length === 0) {
        console.log(`"${status}" list is empty`)
    }

    filterTask.forEach(t => {
        console.log(`ID: ${t.id} \n Description: ${t.description}\n Status: ${t.status}\n`)
    });
}


const [,,command, ...args] = process.argv

switch(command) {
    case 'add':
        addTask(args.join(' '))
        break;
    case 'update':
        updateDescription(Number(args[0]), args[1])
        break;
    case 'delete':
        deleteTask(Number(args[0]));
        break;
    case 'mark-to-do':
        markToDo(Number(args[0]));
        break;
    case 'mark-in-progress':
        markInProgress(Number(args[0]));
        break;
    case 'mark-done':
        markDone(Number(args[0]));
        break;
    case 'list':
        listTask(args[0]);
        break;
    default:
        console.log('Usage:')
        console.log('node index.js add Do Dishes')
}