/* @flow */
import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import cors from 'cors';
import responseTime from 'response-time';
import index from './routes/index.js';
import logger from './utils';
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(responseTime());
app.use('/', index);


// catch 404 and forward to error handler
app.use((req, res, next) => {
	const err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use((err, req, res, next) => {
	logger.error(err.stack);
	res.status(err.status || 500).send(err.message || 'Something broke!');
});

export default app;
