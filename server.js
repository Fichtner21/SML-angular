const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: 'http://your-angular-app.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// other middleware and routes

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});