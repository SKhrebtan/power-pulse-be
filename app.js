const express = require('express');
const logger = require('morgan');
const cors = require('cors');
require('dotenv').config();

const authRouter = require('./routes/api/auth');
const exercisesRouter = require('./routes/api/exercises');
const filtersRouter = require('./routes/api/filters');
const productsRouter = require('./routes/api/products');
const categoriesRouter = require('./routes/api/categories');

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/api/v1/users', authRouter);
app.use('/api/v1/exercises', exercisesRouter);
app.use('/api/v1/filters', filtersRouter);
app.use('/api/v1/products', productsRouter);
app.use('/api/v1/categories', categoriesRouter);

app.use((req, res) => {
    res.status(404).json({ message: 'Not found!' });
});

app.use((err, req, res, next) => {
    const { status = 500, message = 'Internal Server Error!' } = err;
    res.status(status).json({ message });
});

module.exports = app;
