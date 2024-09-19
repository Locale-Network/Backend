const mongoose = require('mongoose');

const LoanSchema = new mongoose.Schema({
  borrower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },
  complianceStatus: {
    type: String,
    enum: ['Pending', 'Verified', 'Failed'],
    default: 'Pending',
  },
  repaymentSchedule: [{
    dueDate: Date,
    amount: Number,
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Late'],
      default: 'Pending',
    },
  }],
}, { timestamps: true });

module.exports = mongoose.model('Loan', LoanSchema);