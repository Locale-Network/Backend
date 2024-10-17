const { verifyCompliance } = require('../services/etran');
const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');
const User = require('../models/User');
const Loan = require('../models/Loan');
const Web3 = require('web3');

const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET
    }
  }
});

const client = new PlaidApi(configuration);

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

const initiatePayment = async (req, res) => {
  const { accessToken, amount, currency } = req.body;

  if (!accessToken || !amount || !currency) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  try {
    // Initiate payment using plaid
    const recipientResponse = await client.paymentInitiationRecipientCreate({
      name: 'LocaleLending Payment Account',
      iban: process.env.PAYMENT_ACCOUNT_IBAN,
      address: {
        street: [process.env.PAYMENT_ACCOUNT_STREET],
        city: process.env.PAYMENT_ACCOUNT_CITY,
        postal_code: process.env.PAYMENT_ACCOUNT_POSTAL_CODE,
        country: process.env.PAYMENT_ACCOUNT_COUNTRY,
      },
    });

    const recipientId = recipientResponse.data.recipient_id;

    const paymentResponse = await client.paymentInitiationPaymentCreate({
      recipient_id: recipientId,
      reference: `Loan Payment - ${new Date().toISOString()}`,
      amount: {
        currency: currency,
        value: amount,
      },
    });

    // Covert funds to stablecoins using Brale API
    const stablecoinResponse = await axios.post(`${process.env.BRAL_API_URL}/convert`, {
      paymentId: paymentResponse.data.payment_id,
      amount,
      currency,
      stablecoin: 'USDC',
    });

    const { transactionId: stablecoinTransactionId } = stablecoinResponse.data;

    // Deposit funds into the smart contract
    const web3 = new Web3(process.env.ETHEREUM_RPC_URL);
    const contract = new web3.eth.Contract(ABI, process.env.SMART_CONTRACT_ADDRESS);
    
    const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
    web3.eth.accounts.wallet.add(account);
    
    const gasPrice = await web3.eth.getGasPrice();
    const depositTx = await contract.methods.deposit(stablecoinTransactionId, amount).send({
      from: account.address,
      gas: 200000,
      gasPrice
    });

    return res.status(200).json({ 
      success: true,
      transactionHash: depositTx.transactionHash,
      message: 'Payment initiated successfully'
    });
  } catch (error) {
    console.error('Error initiating payment:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while initiating the payment',
      error: error.message
    });
  }
};

const automaticDeduction = async (req, res) => {
  const { accessToken, amount, loanId } = req.body;

  if (!accessToken || !amount || !loanId) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  try {
    // Deduct funds form the borrower's bank account using plaid
    const { data: { accounts } } = await client.accountsGet({ access_token: accessToken });
    const eligibleAccount = accounts.find(acc => acc.type === 'depository' && acc.subtype === 'checking');

    if (!eligibleAccount) {
      return res.status(400).json({ success: false, message: 'No eligible account found for automatic deduction' });
    }

    const transferResult = await client.transferCreate({
      access_token: accessToken,
      account_id: eligibleAccount.account_id,
      type: 'debit',
      network: 'ach',
      amount: amount.toString(),
      description: `Automated Loan Repayment - Loan ID: ${loanId}`,
      ach_class: 'ppd',
      user: {
        legal_name: eligibleAccount.owners[0].names[0],
      },
    });

    await Loan.findByIdAndUpdate(loanId, {
      $push: {
        repaymentSchedule: {
          amount: parseFloat(amount),
          status: 'Paid',
          dueDate: new Date(),
        }
      }
    });

    // Convert funds to stablecoins using Brale API
    const { data: { transactionId: stablecoinTransactionId } } = await axios.post(`${process.env.BRAL_API_URL}/convert`, {
      transferId: transferResult.data.transfer.id,
      amount,
      currency: 'USD',
      stablecoin: 'USDC',
    });

    // Deposit funds into the smart contract
    const web3 = new Web3(process.env.ETHEREUM_RPC_URL);
    const contract = new web3.eth.Contract(ABI, process.env.SMART_CONTRACT_ADDRESS);
    
    const walletAccount = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
    web3.eth.accounts.wallet.add(walletAccount);
    
    const depositTransaction = await contract.methods.depositStablecoin(stablecoinTransactionId, amount).send({
      from: walletAccount.address,
      gas: 200000,
      gasPrice: await web3.eth.getGasPrice()
    });

    return res.status(200).json({ 
      success: true,
      transactionHash: depositTransaction.transactionHash,
      message: 'Automatic deduction processed successfully',
    });
  } catch (error) {
    console.error('Error during automatic deduction:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred while processing the automatic deduction',
      error: error.message 
    });
  }
};

module.exports = {
  applyForLoan,
  getLoanStatus,
  initiatePayment,
  automaticDeduction
};