import express from 'express'

import dummyRoutes from './src/routes/dummy.routes.js'

const _PORT = 3000
const app = express()

app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World')
  })

app.use('/api', dummyRoutes)

app.listen(_PORT,() => {
    console.log(`✅ Server is running on port ${_PORT}`);
  })