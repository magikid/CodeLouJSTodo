(function () {
  let todos = []
  let catFacts = []

  async function fillPlaceholder (nextTodoInput) {
    if (catFacts.length === 0) {
      console.log('Refreshing cat facts')
      const response = await fetch('https://cat-fact.herokuapp.com/facts')
      const newCatFacts = await response.json()

      catFacts = newCatFacts
    }

    // The math selects a random number between 0 and one less than the number
    // of cat facts.  This gives us a random placeholder text.
    const selectedFact = Math.floor((Math.random() * (catFacts.length - 1)) + 0)
    const catFact = catFacts[selectedFact].text

    nextTodoInput.placeholder = catFact
  }

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
      fillPlaceholder(nextTodoInput)
    })
  document.addEventListener('DOMContentLoaded', function (event) {
    const nextTodoInput = document.getElementById('next-todo')

    fillPlaceholder(nextTodoInput)
  })
})()
