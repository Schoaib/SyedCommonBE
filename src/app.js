/* @flow */
import express from 'express';
import path from 'path';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';
import responseTime from 'response-time';
import index from './routes/index.js';
import mamasAndPapas from './routes/MamasAndPapas';
import ounass from './routes/Ounass';
const app = express();


app.use(cors())
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(responseTime());
app.use('/', index);
app.use('/mamas&papas', mamasAndPapas);
app.use('/ounass', ounass);

// catch 404 and forward to error handler
app.use((req, res, next) => {
	const err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use((err, req, res, next) => {
	// set locals, only providing error in development
	console.error(err.stack);
	res.status(err.status || 500).send(err.message || 'Something broke!');
});

export default app;
