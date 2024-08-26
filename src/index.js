const express = require('express');
const connectDB = require('./config/db');
const loanRoutes = require('./routes/loanRoutes');

const app = express();

connectDB();

app.use(express.json({ extended: false }));

app.use('/api/loans', loanRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));