import express from 'express'

import dummyRoutes from './routes/dummy.routes.js'

const _PORT = 3000
const app = express()

app.use(express.json())

app.use('/api', dummyRoutes)

app.listen(_PORT)
console.log('Server on port',_PORT)