import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import errorHandler from './middlewares/error.middleware';

import config from './config';
import logger from './config/logger';
import corsMiddleware from './middlewares/cors.middleware';
import requestLogger from './middlewares/req.middleware';
import stationRoutes from './routes/station.route';

const app = express()

app.use(helmet())
app.use(express.json())
app.use(morgan('combined'))
app.use(corsMiddleware)
app.use(requestLogger)
app.use(errorHandler)

app.get('/', (_req, res) => {
  res.send('Admin Service is running')
})

app.use('/stations', stationRoutes);

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'UP' })
})
const startServer = async () => {
  try {
    app.listen(config.PORT, () => {
      logger.info(`${config.SERVICE_NAME} is running on port ${config.PORT}`);
    });
  } catch (error) {
    logger.error(`Failed to start server: ${error}`);
    process.exit(1);
  }
};

startServer();