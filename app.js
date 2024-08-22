const fs = require('fs');
const express = require('express');
const app = express();
const morgan = require('morgan');

if (process.env.NODE_ENV.trim() === 'development') {
  app.use(morgan('dev'));
}

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

app.use(express.json());

app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  console.log('Hello from the middle ware');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// to get req from the req body
//middle ware can maniplicute the req and res obj

// app.get('/', (req, res) => {
//   res.status(200).json({ message: 'Hello from the server', app: 'Natours' });
// });

// app.post('/', (req, res) => {
//   res.send('You can post to this endpoint...');
// });

// app.get('/api/v1/tours', getAllTours);
// app.get(`/api/v1/tours/:id`, getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

//here Hello from the middle ware does not print because createTour end the response so this function is not execute
// app.use((req, res, next) => {
//   console.log('Hello from the middle ware');
//   next();
// });

//ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
