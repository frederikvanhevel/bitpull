import express from 'express'
import path from 'path'
import helmet from 'helmet'

const app = express()

app.use(helmet())

// Tell express that we want to use the dist folder
// for our static assets
app.use(express.static(path.join(__dirname, '../dist')))

app.get('/health', (req, res) => res.status(200).send({ success: true }))

// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'))
})

const port = process.env.PORT || 8080

// Listen for requests
app.listen({ port }, () => {
    console.log(`🚀 Server ready at http://localhost:${port}`)
})
