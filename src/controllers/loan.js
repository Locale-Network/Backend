const Loan = require('../models/Loan');
const { verifyCompliance } = require('../services/etran');

const applyForLoan = async (req, res) => {
  const { borrowerId, amount } = req.body;

  try {
    const loan = new Loan({
      borrower: borrowerId,
      amount,
    });

    await loan.save();
    const complianceResult = await verifyCompliance(loan._id, req.body.borrowerData);

    if (complianceResult.status === 'Verified') {
      loan.complianceStatus = 'Verified';
      await loan.save();
    }

    res.json(loan);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const getLoanStatus = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id).populate('borrower', 'name email');
    if (!loan) {
      return res.status(404).json({ msg: 'Loan application not found' });
    }
    res.json(loan);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  applyForLoan,
  getLoanStatus,
};