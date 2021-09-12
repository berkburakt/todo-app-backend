const express = require("express")
const route = require("./routes")
const query = require("./queries")

const app = express()
const port = 3000

// Parse JSON using express
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Get all todo lists in the form of JSON
app.get(route.lists, async(req, res) => {
    const allLists = await query.getAllLists()
    res.json(allLists.rows)
})

// Post an item to todo list
app.post(route.lists, async(req, res) => {
    const { title } = req.body
    await query.insertIntoLists(title)
    res.send(`List "${title}" is added successfuly.`)
})

// Get a todo list in the form of JSON
app.get(route.listsWithId, async(req, res) => {
    const id = req.params.id
    const list = await query.getItemFromList(id)
    res.json(list.rows)
})

// Post an item to todo list
app.post(route.listsWithId, async(req, res) => {
    const id = req.params.id
    const { title } = req.body
    await query.insertIntoList(id, title)
    res.send(`Item "${title}" is added to the list id ${id}.`)
})

app.delete(route.listsWithId, async(req, res) => {
    const id = req.params.id
    await query.deleteList(id)
    res.send(`List id "${id}" is successfully deleted.`)
})

app.put(route.listWithId, async(req, res) => {
    const id = req.params.id
    await query.updateItemInList(id)
    res.send(`Item id "${id}" is marked as done.`)
})

app.delete(route.listWithId, async(req, res) => {
    const id = req.params.id
    await query.deleteFromList(id)
    res.send(`Item id "${id}" is successfully deleted.`)
})

app.listen(port, () => console.log(`Server listening at port ${port}`))