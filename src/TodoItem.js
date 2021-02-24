class TodoItem {
  /**
   * @param {string} text
   */
  constructor (text) {
    this.text = text
    this.createdAt = Date.now()
  }
}
