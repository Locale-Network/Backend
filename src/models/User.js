const { required } = require('joi');
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    enum: ['Borrower', 'Lender', 'Admin'],
    default: 'Borrower',
  },
  kycStatus: {
    type: String,
    enum: ['Pending', 'Verified', 'Failed'],
    default: 'Pending',
  },
  accessToken: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);