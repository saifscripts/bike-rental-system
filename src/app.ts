import cors from 'cors';
import express, { Request, Response } from 'express';
import httpStatus from 'http-status';
import notFound from './app/middlewares/notFound';

const app = express();

// parsers
app.use(cors());
app.use(express.json());

// test route
app.get('/', (_req: Request, res: Response) => {
    res.status(httpStatus.OK).json({
        success: true,
        statusCode: 200,
        message: 'App is running successfully!',
    });
});

// not found route
app.use(notFound);

export default app;
