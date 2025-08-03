//logic for the database-SQLlite

//import the sqlite
import Database from 'better-sqlite3'

//create a database- This is an in memory database.N/B: Not for production
const db = new Database('database.db')

//Execute SQL statements from strings
//Table for UseRS. We set the primary key and allow auto increment
db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
    )
`)

//Second table for Todos
db.exec(
    `
    CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        task TEXT,
        completed BOOLEAN DEFAULT 0,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )    
`)

//allow us to interact with our database from other files of our projects
export default db