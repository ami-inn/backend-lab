import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';


const app = express()

app.use(helmet())
app.use(express.json())
app.use(morgan('combined'))

app.get('/', (_req, res) => {
  res.send('Admin Service is running')
})

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'UP' })
})

const PORT = process.env.PORT || 3000
const server = app.listen(PORT, () => {
  console.log(`Admin Service is running on port ${PORT}`)
})

const gracefulShutdown = () => {
  console.log('Shutting down gracefully...')
  server.close(() => {
    console.log('Server closed')
    process.exit(0)
  })
  setTimeout(() => {
    console.error('Forcing shutdown...')
    process.exit(1)
  }, 10000)
}

process.on('SIGTERM', gracefulShutdown)
process.on('SIGINT', gracefulShutdown)