const express = require("express")
const pool = require("./db")

const app = express()
const port = 3000

// Parse JSON using express
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Get all todo lists in the form of JSON
app.get('/lists', async(req, res) => {
    try {
        const allLists = await pool.query("SELECT lists.id, lists.title, "
        + "COALESCE(JSON_AGG(list) FILTER (WHERE list.id IS NOT NULL), '[]') AS list "
        + "FROM lists LEFT OUTER JOIN list ON list.list_id = lists.id "
        + "GROUP BY list.list_id, lists.id;")
        res.json(allLists.rows)
    } catch(err) {
        console.error(err.message)
    }
})

// Post an item to todo list
app.post('/lists', async(req, res) => {
    try {
        const { title } = req.body
        await pool.query(
            "INSERT INTO lists (title) VALUES ($1);", 
            [title]
        )
        res.send(`List "${title}" is added successfuly.`)
    } catch (err) {
        console.error(err.message)
    }
})

// Get a todo list in the form of JSON
app.get('/lists/:id', async(req, res) => {
    const id = req.params.id
    try {
        const list = await pool.query("SELECT lists.id, lists.title, "
        + "COALESCE(JSON_AGG(list) FILTER (WHERE list.id IS NOT NULL), '[]') AS list "
        + "FROM lists LEFT OUTER JOIN list ON list.list_id = lists.id "
        + "WHERE lists.id = ($1) "
        + "GROUP BY list.list_id, lists.id;",
        [id])
        res.json(list.rows)
    } catch(err) {
        console.error(err.message)
    }
})

// Post an item to todo list
app.post('/lists/:id', async(req, res) => {
    const id = req.params.id
    const { title } = req.body
    try {
        await pool.query(
            "INSERT INTO list (list_id, title) VALUES ($1, $2);", 
            [id, title]
        )
        res.send(`Item "${title}" is added to the list id ${id}.`)
    } catch(err) {
        console.error(err.message)
    }
})

app.delete('/lists/:id/', async(req, res) => {
    const id = req.params.id
    try {
        await pool.query(
            "DELETE FROM lists WHERE id = $1", 
            [id]
        )
        res.send(`List id "${id}" is successfully deleted.`)
    } catch(err) {
        console.error(err.message)
    }
})

app.put('/list/:id/', async(req, res) => {
    const id = req.params.id
    try {
        await pool.query(
            "UPDATE list SET isDone = $1 WHERE id = $2;", 
            [true, id]
        )
        res.send(`Item id "${id}" is marked as done.`)
    } catch(err) {
        console.error(err.message)
    }
})

app.delete('/list/:id/', async(req, res) => {
    const id = req.params.id
    try {
        await pool.query(
            "DELETE FROM list WHERE id = $1", 
            [id]
        )
        res.send(`Item id "${id}" is successfully deleted.`)
    } catch(err) {
        console.error(err.message)
    }
})

app.listen(port, () => console.log(`Server listening at port ${port}`))