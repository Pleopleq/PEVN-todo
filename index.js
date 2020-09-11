const express = require('express')
const cors = require('cors')
const pool = require('./db')
const app = express()

app.use(cors())
app.use(express.json())

app.get('/todos', async (req, res) => {
    try {
        const allTodos = await pool.query("SELECT * FROM todo")
        res.json(allTodos.rows)
    } catch (error) {
        console.error(error.message)
    }
})

app.get('/todos/:id', async (req, res) => {
    try {
        const todoId = parseInt(req.params.id)
        const singleTodo = await pool.query(`
        SELECT description 
        FROM todo 
        WHERE todo_id = ${todoId};
        `)

        res.json(singleTodo.rows[0])
    } catch (error) {
        console.error(error.message)
    }
})

app.post('/todos', async (req, res) => {
    try {
        const { description } = req.body
        const newTodo = await pool.query("INSERT INTO todo (description) VALUES($1) RETURNING *", 
        [description])
        
        res.json(newTodo.rows[0])
    } catch (error) {
        console.error(error.message)
    }
})

app.put('/todos/:id', async (req, res) => {
    try {
        const descriptionEdited = req.body
        const todoId = parseInt(req.params.id)
        const updatedTodo = await pool.query(`
        UPDATE todo 
        SET description = '${descriptionEdited.description}' 
        WHERE todo_id = ${todoId};
        `)
    
        res.json(updatedTodo.command)
    } catch (error) {
        console.error(error.message)
    }
})

app.delete('/todos/:id', async (req, res) => {
    try {
        const todoId = parseInt(req.params.id)
        const deletedTodo = await pool.query(`
            DELETE FROM todo
            WHERE todo_id = ${todoId};
        `)
        res.json(deletedTodo.command)
    } catch (error) {
        console.error(error.message)
    }
})


 
app.listen(5000, () => {
    console.log('Server is up!')
}) 