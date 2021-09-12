const Pool = require("pg").Pool

const pool = new Pool({
    user: "USERNAME",
    password: "PASSWORD",
    database: "DATABASE",
    host: "HOST",
    port: "PORT"
})

module.exports = pool