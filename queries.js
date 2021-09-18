const pool = require("./db")

const Query = {
    getAllLists: async function() {
        try {
            return await pool.query("SELECT lists.id, lists.title, "
            + "COALESCE(JSON_AGG(list) FILTER (WHERE list.id IS NOT NULL), '[]') AS items "
            + "FROM lists LEFT OUTER JOIN list ON list.list_id = lists.id "
            + "GROUP BY list.list_id, lists.id;")
        } catch(err) {
            console.error(err.message)
        }
    },

    insertIntoLists: async function(title) {
        try {
            await pool.query(
                "INSERT INTO lists (title) VALUES ($1);", 
                [title]
            )
        } catch(err) {
            console.error(err.message)
        }
    },

    getItemFromList: async function(id) {
        try {
            return await pool.query("SELECT lists.id, lists.title, "
                + "COALESCE(JSON_AGG(list) FILTER (WHERE list.id IS NOT NULL), '[]') AS items "
                + "FROM lists LEFT OUTER JOIN list ON list.list_id = lists.id "
                + "WHERE lists.id = ($1) "
                + "GROUP BY list.list_id, lists.id;",
                [id])
        } catch(err) {
            console.error(err.message)
        }
    },

    insertIntoList: async function(id, title) {
        try {
            await pool.query(
                "INSERT INTO list (list_id, title) VALUES ($1, $2);", 
                [id, title]
            )
        } catch(err) {
            console.error(err.message)
        }
    },

    deleteList: async function(id) {
        try {
            await pool.query(
                "DELETE FROM lists WHERE id = $1", 
                [id]
            )
        } catch(err) {
            console.error(err.message)
        }
    },

    updateItemInList: async function(id) {
        try {
            await pool.query(
                "UPDATE list SET isDone = $1 WHERE id = $2;", 
                [true, id]
            )
        } catch(err) {
            console.error(err.message)
        }
    },

    deleteFromList: async function(id) {
        try {
            await pool.query(
                "DELETE FROM list WHERE id = $1", 
                [id]
            )
        } catch(err) {
            console.error(err.message)
        }
    }
}

module.exports = Query