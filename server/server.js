const path = require('path');
const express = require('express');
const userRouter = require('./routes/userRouter');

// setup app and port
const app = express();
const PORT = process.env.PORT || 3000;

// handle parsing request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// handle requests for static files (bundle.js)
app.use('/build', express.static(path.resolve(__dirname, '../build')));

// define route handlers
app.use('/user', (req, res, next) => {
  console.log(`Request to '/user' in server.js routed to userRouter.js`);
  userRouter(req, res, next);
});

app.get('/', (req,res) => {
  console.log(`Get request for '/'.  sending index.html`)
  res.status(200).sendFile(path.resolve(__dirname, '../index.html'));
})

app.post('/', (req,res) => {
  console.log(`incoming POST request: ${req.body}`);
  res.status(200).json({ "request": "received"})
})

// define catch-all route handler for requests to an unknown route
app.use((req,res) => res.status(404).send('No page found at that location'));

// global error handler
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

// start server
app.listen(PORT, () => console.log(`Server listening on port ${PORT}...`));