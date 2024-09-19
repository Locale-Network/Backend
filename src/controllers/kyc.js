const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');
const User = require('../models/User');

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

const getAccount = async (req, res) => {
  const { uid } = req.body;

  if (!uid) {
    return res.status(400).json({ success: false, message: 'UID is required to verify the account.' });
  }

  try {
    const account = await User.findOne({ walletAddress: uid });

    if (!account) {
      return res.status(404).json({ success: false, message: 'Account not found.' });
    }

    return res.status(200).json({ success: true, message: 'Account verified successfully.', account: account });
  } catch (error) {
    console.error('Error fetching account:', { error: error.message, stack: error.stack, uid });
    return res.status(500).json({ success: false, message: 'Internal server error while verifying the account.' });
  }
};

const createLinkToken = async (req, res) => {
  const { uid } = req.body;

  if (!uid) {
    return res.status(400).json({ success: false, message: 'User ID is required.' });
  }

  try {
    const response = await client.linkTokenCreate({
      user: {
        client_user_id: uid
      },
      client_name: 'LocaleLending',
      products: ['identity'],
      country_codes: ['US'],
      language: 'en'
    });

    const { expiration, link_token, request_id } = response.data;

    res.status(200).send({ success: true, expiration, link_token, request_id });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

const exchangePublicToken = async (req, res) => {
  const { uid, public_token } = req.body;

  if (!uid || !public_token) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  try {
    const tokenResponse = await client.itemPublicTokenExchange({ public_token });
    const access_token = tokenResponse.data.access_token;

    const newUser =  new User({
      walletAddress: uid,
      role: 'Borrower',
      kycStatus: 'Verified',
      accessToken: access_token
    })

    await newUser.save();

    res.status(200).json({ success: true, message: 'Account verified successfully.', account: newUser });
  } catch (error) {
    console.error('Error during public token exchange:', error);
    res.status(500).json({ success: false, message: 'An error occurred while exchanging tokens', details: error.message });
  }
};

const getCreditScore = async (req, res) => {
  const { uid } = req.body;

  if (!uid) {
    return res.status(400).json({ success: false, message: 'User ID is required.' });
  }

  try {
    const user = await User.findOne({ walletAddress: uid });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Account not found.' });
    }

    const response = await client.liabilitiesGet({ access_token: user.accessToken });
    const liabilities = response.data.liabilities;

    let creditScore = 0;
    if (liabilities.student) creditScore += 30;
    if (liabilities.mortgage) creditScore += 40;
    if (liabilities.credit) creditScore += 50;

    res.status(200).json({ success: true, creditScore, liabilities });
  } catch (error) {
    console.error("Error fetching liabilities", error);
    res.status(500).json({ error: "Failed to fetch credit data" });
  }
};

module.exports = {
  getAccount,
  createLinkToken,
  exchangePublicToken,
  getCreditScore
}