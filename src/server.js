import express from 'express'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import authRoutes from './routes/authRoutes.js'
import todoRoutes from './routes/todoRoutes.js'
import dotenv from 'dotenv'
import authMiddleware from './middleware/authMiddleware.js'
dotenv.config()


//now lets create an object and port usingg thelibrary
const app = express()

//We go to the environment variables and check if there is an assigned port,
//if there isn't we default to 5000
const PORT = process.env.PORT || 5003


// Get the file path from the URL of the current module
const __filename = fileURLToPath(
    import.meta.url)

//get the diectory name from the file path
const __dirname = dirname(__filename)

//MiddleWare
app.use(express.json()) //---accept incoming json data
    //serves the HTML file from public directory and tells express to serve all files from public dir as static assests
    //Any request for css files will be resolved from the public directory
app.use(express.static(path.join(__dirname, '../public')))


//serving the html file from the public directory----- ENDPOINT
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
});


//Routes
app.use('/auth', authRoutes)
app.use('/todos', authMiddleware, todoRoutes)

//now we set the server to listen for incoming connecting and use an arrow function to display the port number its listening on
app.listen(PORT, () => {
    console.log(`Server has started on ${PORT}`)
})