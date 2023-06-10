// app.js
const express = require('express');
const app = express();
const sequelize = require('./config/database');
const userRoutes = require('./routes/userRouter');

app.use(express.json());
app.use('/', userRoutes);

// Sync the database and start the server
sequelize
  .sync()
  .then(() => {
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
  });
