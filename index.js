class TodoItem {
  /**
   * @param {string} text
   */
  constructor (text) {
    this.text = text
    this.createdAt = Date.now()
  }
}

class TodoListApp {
  /**
   * @param {HTMLElement} nextTodoInput
   * @param {HTMLElement} todoContainer
   */
  constructor (nextTodoInput, todoContainer) {
    /** @type {TodoItem[]}  */
    this.todos = []
    this.catFacts = []
    this.nextTodoInput = nextTodoInput
    this.todoContainer = todoContainer
  }

  boot () {
    this.catFacts = this.loadCatFacts()
    console.log(this.catFacts)
    this.addCatFactPlaceholder()
    this.nextTodoInput
      .addEventListener('submit', this.handleSubmit.bind(this))
  }

  /**
   * @param {Event} event
   */
  handleSubmit (event) {
    event.preventDefault()

    todos = getNextTodoInput(todos, nextTodoInput)
    todoContainer.innerHTML = generateTodoList(todos)
    registerDeleteButtons(todoContainer, todos)
    fillPlaceholder(nextTodoInput)
  }

  /**
   * @returns {string[]}
   */
  async loadCatFacts () {
    try {
      /** @type {string[]} */
      const oldCatFacts = JSON.parse(localStorage.getItem('catFacts'))
      const newCatFacts = await this.refreshCatFacts(oldCatFacts)

      return newCatFacts
    } catch (e) {
      console.log(e)
      return []
    }
  }

  /**
   * @returns {string[]}
   */
  async refreshCatFacts (oldCatFacts) {
    if (oldCatFacts !== null && oldCatFacts.length !== 0) {
      console.log('No cat fact refresh needed')
      console.log('oldCatFacts', oldCatFacts)
      return oldCatFacts
    }

    console.log('Refreshing cat facts')
    const response = await fetch('https://cat-fact.herokuapp.com/facts')
    const newCatFacts = await response.json()
    localStorage.setItem('catFacts', JSON.stringify(newCatFacts))

    return newCatFacts
  }

  addCatFactPlaceholder () {
    // The math selects a random number between 0 and one less than the number
    // of cat facts.  This gives us a random placeholder text.
    console.log(this.catFacts)
    const selectedFactIndex = Math.floor((Math.random() * (this.catFacts.length - 1)) + 0)
    const catFact = this.catFacts[selectedFactIndex].text

    this.nextTodoInput.placeholder = catFact
  }

  /**
   * @param {TodoItem[]} oldList
   */
  generateTodoList (oldList) {
    return oldList
      .map((todo, index) => {
        return `<li>${todo.text} <a data-todo-created="${todo.createdAt} data-todo-index="${index}" href="#">x</a></li>`
      })
      .reduce((allTodos, currentTodo) => allTodos + '\n' + currentTodo, [])
  }

  getNextTodoInput () {
    const nextTodo = new TodoItem(this.nextTodoInput.value)
    this.todos.push(nextTodo)
    this.nextTodoInput.value = ''
  }

  registerDeleteButtons (todoContainer, todos) {
    todoContainer.addEventListener('click', (event) => {
      const deleteLink = event.target
      const indexToDelete = deleteLink.getAttribute('data-todo-index')
      if (indexToDelete === null) {
        return
      }

      console.log(`Removing index ${indexToDelete}`)
      todos.splice(indexToDelete, 1)
      todoContainer.innerHTML = this.generateTodoList(todos)
    })
  }
}

document.addEventListener('DOMContentLoaded', function (event) {
  const todoContainer = document.getElementById('todo-list')
  const nextTodoInput = document.getElementById('next-todo')
  const app = new TodoListApp(nextTodoInput, todoContainer)
  app.boot()
})
