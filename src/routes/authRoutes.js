import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken' //secure password manager. Without them needing to sign up again
import db from '../db.js'


const router = express.Router()

//register new user endpoint /auth/register
router.post('/register', (req, res) => {
    const { username, password } = req.body
    const hashedPassword = bcrypt.hashSync(password, 8)

    try {
        // Check if username already exists
        const checkUser = db.prepare(`SELECT * FROM users WHERE username = ?`)
        const existingUser = checkUser.get(username)

        if (existingUser) {
            return res.status(409).json({ error: "Username already exists" })
        }

        const insertUser = db.prepare(`INSERT INTO users (username, password) VALUES (?, ?)`)
        const result = insertUser.run(username, hashedPassword)

        const defaultTodo = "Hello :) Add your first todo!"
        const insertTodo = db.prepare(`INSERT INTO todos (user_id, task) VALUES (?, ?)`)
        insertTodo.run(result.lastInsertRowid, defaultTodo)

        const token = jwt.sign({ id: result.lastInsertRowid },
            process.env.JWT_SECRET, { expiresIn: '24h' }
        )

        return res.status(201).json({ token })

    } catch (err) {
        console.error(err.message)
        return res.sendStatus(503)
    }
})


router.post('/login', (req, res) => {
    const {
        username,
        password
    } = req.body
    try {
        //write the sql query we will use to search for the username
        const getUser = db.prepare('SELECT * FROM users WHERE username = ?')
            // Now we use the above command to inject the sql command and get our user
        const user = getUser.get(username)

        //now lets check if the password is valid using bcrypt

        if (!user) {
            return res.status(404).send({ message: "user not found" })
        }

        const passwordIsValid = bcrypt.compareSync(password, user.password)
        if (!passwordIsValid) {
            return res.status(401).send({ message: 'Invalid password' })
        }

        //then we successful authenticate the user with all there CRUD actions
        const token = jwt.sign({ id: user.id },
            process.env.JWT_SECRET, { expiresIn: '24h' }
        )
        res.json({ token })
    } catch (err) {
        console.log(err.message)
        res.sendStatus(503)
    }
})

export default router