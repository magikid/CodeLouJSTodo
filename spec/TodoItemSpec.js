/* global describe, it, expect, TodoItem */
describe('TodoItem', function () {
  it('accepts a text field in the constructor', function () {
    const todoItem = new TodoItem('foo')

    expect(todoItem.text).toEqual('foo')
  })

  it('generates a createdAt timestamp when created', function () {
    const initialTime = Date.now()
    const todoItem = new TodoItem('foo')

    expect(todoItem.createdAt).toBeGreaterThanOrEqual(initialTime)
    expect(todoItem.createdAt).toBeCloseTo(initialTime)
  })
})
