const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const loanRoutes = require('./routes/loan');
const kycRoutes = require('./routes/kyc');

const app = express();

connectDB();

app.use(cors());
app.use(express.json({ extended: false }));

app.use('/api/loans', loanRoutes);
app.use('/api/kyc', kycRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));