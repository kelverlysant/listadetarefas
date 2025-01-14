// seleção dos elementos

const todoForm= document.querySelector("#todo-form");
const todoInput= document.querySelector("#todo-input");
const todoList= document.querySelector("#todo-list");
const editForm= document.querySelector("#edit-form");
const editInput= document.querySelector("#edit-input");
const cancelEditBtn= document.querySelector("#cancel-edit-btn");
const searchInput= document.querySelector("#search-input");
const eraseBtn= document.querySelector("#erase-button");
const filterBtn= document.querySelector("#filter-select");

let oldInputValue;

// funções

const saveTodo = (text, done = 0, save = 1) => {
    const todo = document.createElement("div");
    todo.classList.add("todo");

    const todoTitle = document.createElement("h3");
    todoTitle.innerText = text;
    todo.appendChild(todoTitle);

    const doneBtn = document.createElement("button");
    doneBtn.classList.add("finish-todo");
    doneBtn.innerHTML = '<i class="bi bi-check-lg"></i>';
    todo.appendChild(doneBtn);

    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-todo");
    editBtn.innerHTML = '<i class="bi bi-pencil-square"></i>';
    todo.appendChild(editBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("remove-todo");
    deleteBtn.innerHTML = '<i class="bi bi-trash-fill"></i>';
    todo.appendChild(deleteBtn);

    
    if (done) {
        todo.classList.add("done");
    }

    
    if (save) {
        saveTodoLocalStorage({ text, done }); // 
    }

    todoList.appendChild(todo);

    todoInput.value = "";
    todoInput.focus();
};


const toggleforms = ()=>{
    editForm.classList.toggle("hide")
    todoForm.classList.toggle("hide")
    todoList.classList.toggle("hide")
};

const updateTodo =(text)=>{
    const todos = document.querySelectorAll(".todo");

    todos.forEach((todo)=>{
        let todoTitle = todo.querySelector("h3");
        if(todoTitle.innerText === oldInputValue){
            todoTitle.innerText = text;
            updateTodosLocalStorage(oldInputValue,text);
        };
    });
};

const getSearchTodos= (search)=>{
    const todos = document.querySelectorAll(".todo");

    todos.forEach((todo)=>{
        let todoTitle = todo.querySelector("h3").innerText.toLowerCase();
        const normalizedSearch = search.toLowerCase();

         todo.style.display = "flex"

    if(!todoTitle.includes(normalizedSearch)){
        todo.style.display = "none"
    };

    
    });
};

const filterTodos = (filterValue)=>{
    const todos = document.querySelectorAll(".todo");

    switch(filterValue){
        case "all":
            todos.forEach((todo)=> (todo.style.display = "flex"));
            break;

        case "done":
            todos.forEach((todo)=> !todo.classList.contains("done") ? (todo.style.display) = "flex" : (todo.style.display = "none"));
            break;

            case "todo":
                todos.forEach((todo)=> todo.classList.contains("done") ? (todo.style.display) = "flex" : (todo.style.display = "none"));
                break;

            default:
                break;
            
    };
}

// eventos
todoForm.addEventListener("submit", (e)=>{
    e.preventDefault();

    const inputValue = todoInput.value;

    if(inputValue){
       saveTodo(inputValue)
    }
});

document.addEventListener("click", (e)=>{
    const targetEl = e.target;
    const parentEl = targetEl.closest("div");
    let todoTitle;

    if(parentEl && parentEl.querySelector("h3")){
        todoTitle = parentEl.querySelector("h3").innerText;
    }

    if(targetEl.classList.contains("finish-todo")){
        parentEl.classList.toggle("done")
        updateTodosStatusLocal(todoTitle)
    };
    if(targetEl.classList.contains("remove-todo")){
        parentEl.remove();
        removeTodoLocalStorage(todoTitle);
    };
    if(targetEl.classList.contains("edit-todo")){
         toggleforms();

         editInput.value = todoTitle
         oldInputValue = todoTitle
    };
});


cancelEditBtn.addEventListener("click", (e)=>{
    e.preventDefault();

    toggleforms();
});

editForm.addEventListener("submit", (e)=>{
    e.preventDefault();

    const editInputValue = editInput.value

    if(editInputValue){
        updateTodo(editInputValue)
    }

    toggleforms()
});

searchInput.addEventListener("keyup", (e)=>{
    const search = e.target.value;

    getSearchTodos(search);
});

eraseBtn.addEventListener("click", (e)=>{

    e.preventDefault();

    searchInput.value = "";

    searchInput.dispatchEvent(new Event("keyup"));
});

filterBtn.addEventListener("change", (e)=>{
    const filterValue = e.target.value;

    filterTodos(filterValue)
    
});


// local storage

const getTodosLocalStorage = () => {
    const todos = JSON.parse(localStorage.getItem("todos"));

    
    return Array.isArray(todos) ? todos : [];
};

const loadTodos =() =>{
    const todos = getTodosLocalStorage();

    todos.forEach((todo)=>{
        saveTodo(todo.text, todo.done, 0)
    })
}

const saveTodoLocalStorage = (todoData) => {
    const todos = getTodosLocalStorage(); 
    todos.push(todoData);
    localStorage.setItem("todos", JSON.stringify(todos)); 
};

const removeTodoLocalStorage = (todoText)=>{
    const todos = getTodosLocalStorage(); 
    
    const filteredTodos = todos.filter((todo)=> todo.text !== todoText)
    localStorage.setItem("todos", JSON.stringify(filteredTodos))
}

const updateTodosStatusLocal =(todoText)=>{
    const todos = getTodosLocalStorage(); 
    
    todos.map((todo)=> todo.text === todoText ? todo.done = !todo.done : null),
    localStorage.setItem("todos", JSON.stringify(todos))
};


const updateTodosLocalStorage =(todoOldText, todoNewText)=>{
    const todos = getTodosLocalStorage(); 
    
    todos.map((todo)=> todo.text === todoOldText ? (todo.text = todoNewText) : null),
    localStorage.setItem("todos", JSON.stringify(todos))
}
 loadTodos()