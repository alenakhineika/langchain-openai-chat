import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';

dotenv.config({ path: '../.env' });

import { logger } from './logger';
import { setRoutes } from './routes';

const app = express();
const port = 3000;

app.disable('x-powered-by');
app.use(helmet());
app.use(cors());
app.use(express.json());

setRoutes(app);

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`, {
    pid: process.pid,
  });
});
