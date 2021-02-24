/* global TodoItem */
class TodoListApp {
  /**
   * @param {HTMLElement} nextTodoInput
   * @param {HTMLElement} todoContainer
   * @param {HTMLElement} form
   */
  constructor (nextTodoInput, todoContainer, form) {
    /** @type {TodoItem[]}  */
    this.todos = []
    this.catFacts = []
    this.nextTodoInput = nextTodoInput
    this.todoContainer = todoContainer
    this.form = form
  }

  async boot () {
    this.catFacts = await this.loadCatFacts()
    this.addCatFactPlaceholder()
    this.form.addEventListener('submit', this.handleSubmit.bind(this))
  }

  /**
   * @param {Event} event
   */
  handleSubmit (event) {
    event.preventDefault()

    this.todos = this.getNextTodoInput(this.todos, this.nextTodoInput)
    this.todoContainer.innerHTML = this.generateTodoList(this.todos)
    this.addCatFactPlaceholder(this.nextTodoInput)
    this.registerDeleteButtons(this.todoContainer, this.todos)
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
        return `<li>${todo.text} <a data-todo-created="${todo.createdAt}" data-todo-index="${index}" href="#">x</a></li>`
      })
      .reduce((allTodos, currentTodo) => allTodos + '\n' + currentTodo, [])
  }

  getNextTodoInput (todos, nextTodoInput) {
    const nextTodo = new TodoItem(nextTodoInput.value)
    todos.push(nextTodo)
    nextTodoInput.value = ''

    return todos
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
