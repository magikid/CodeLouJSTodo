(function () {
  let todos = []

  function getNextTodoInput (todos, nextTodoInput) {
    const newTodos = [...todos]
    newTodos.push(nextTodoInput.value)
    nextTodoInput.value = ''

    return newTodos
  }

  function generateTodoList (todoList) {
    return todoList
      .map((todoItem, index) => {
        return `<li>${todoItem} <a data-todo-index="${index}" href="#">x</a></li>`
      })
      .reduce((allTodos, currentTodo) => allTodos + '\n' + currentTodo, [])
  }

  function registerDeleteButtons (todoContainer, todos) {
    todoContainer.addEventListener('click', (event) => {
      const deleteLink = event.target
      const indexToDelete = deleteLink.getAttribute('data-todo-index')
      if (indexToDelete === null) {
        return
      }

      console.log(`Removing index ${indexToDelete}`)
      todos.splice(indexToDelete, 1)
      todoContainer.innerHTML = generateTodoList(todos)
    })
  }

  document
    .getElementById('add-todo-button')
    .addEventListener('click', function (event) {
      const todoContainer = document.getElementById('todo-list')
      const nextTodoInput = document.getElementById('next-todo')

      event.preventDefault()

      todos = getNextTodoInput(todos, nextTodoInput)
      todoContainer.innerHTML = generateTodoList(todos)
      registerDeleteButtons(todoContainer, todos)
    })
})()
