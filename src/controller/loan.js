const Loan = require('../models/Loan');
const { verifyCompliance } = require('../services/etran');

const applyForLoan = async (req, res) => {
  const { borrowerId, amount } = req.body;

  try {
    const application = new Loan({
      borrower: borrowerId,
      amount,
    });

    await application.save();
    const complianceResult = await verifyCompliance(application._id, req.body.borrowerData);

    if (complianceResult.status === 'Verified') {
      application.complianceStatus = 'Verified';
      await application.save();
    }

    res.json(application);
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