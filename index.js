import express from 'express'

import topic from './src/routes/topics.routes.js'
import resources from './src/routes/resources.routes.js'
import auth from './src/routes/auth.routes.js'

const _PORT = 3000
const app = express()

app.use(express.json())

app.get('/', (req, res) => {
    res.send('✅')
  })

app.use('/api', topic)
app.use('/api', resources)
app.use('/api', auth)

app.listen(_PORT,() => {
    console.log(`✅ Server is running on port ${_PORT}`);
  })