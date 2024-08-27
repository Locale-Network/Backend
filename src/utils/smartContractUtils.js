const Web3 = require('web3');
const LoanContractABI = require('./LoanContract.json').abi;

const web3 = new Web3(process.env.WEB3_PROVIDER_URL);
const loanContract = new web3.eth.Contract(LoanContractABI, process.env.CONTRACT_ADDRESS);

const issueLoan = async (amount, borrowerAddress) => {
  try {
    const transaction = loanContract.methods.issueLoan(amount);
    const options = {
      from: borrowerAddress,
      gas: 1000000,
    };

    const receipt = await transaction.send(options);
    return receipt;
  } catch (error) {
    console.error('Error issuing loan:', error);
    throw new Error('Loan issuance failed');
  }
};

const repayLoan = async (loanId, amount, borrowerAddress) => {
  try {
    const transaction = loanContract.methods.repayLoan(loanId);
    const options = {
      from: borrowerAddress,
      value: web3.utils.toWei(amount.toString(), 'ether'),
      gas: 1000000,
    };

    const receipt = await transaction.send(options);
    return receipt;
  } catch (error) {
    console.error('Error repaying loan:', error);
    throw new Error('Loan repayment failed');
  }
};

module.exports = {
  issueLoan,
  repayLoan,
};