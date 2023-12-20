const express = require('express');
const cors = require('cors'); // Import the cors package
const connectDb = require('./config/db');

const app = express();
// Connect database
connectDb();
app.use(express.json({ extended: false }));

// Enable CORS for all routes
app.use(cors());

app.get('/', (req, res) => res.send('user route')); // Updated the response

// Define routes
app.use('/api/user', require('./routes/api/user'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/post', require('./routes/api/post'));
app.use('/api/profile', require('./routes/api/profile'));

const PORT = process.env.PORT || 5006; // Change the port number

app.listen(PORT, () => console.log(`Server started on Port ${PORT}`));
