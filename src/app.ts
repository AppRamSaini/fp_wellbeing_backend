import express from 'express';
import passport from 'passport';

import routes from '@/api/routes';
import errorHandler, { NotFoundError } from '@/api/middleware/errorHandler';

import '@/config/passport';
import '@/db/connection.js';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Routes
app.use('/api', routes);

// Global error handlers
app.use((_req, _res, next) => {
    next(new NotFoundError('The requested resource was not found'));
});
app.use(errorHandler);

export default app;
