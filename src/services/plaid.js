const plaid = require('plaid');

const client = new plaid.Client({
  clientID: process.env.PLAID_CLIENT_ID,
  secret: process.env.PLAID_SECRET,
  env: plaid.environments[process.env.PLAID_ENV],
});

const verifyKYC = async (userId, accessToken) => {
  try {
    const response = await client.identity.get({ access_token: accessToken });
    return { status: 'Verified', userId };
  } catch (err) {
    console.error('KYC Verification Error:', err);
    return { status: 'Failed', userId };
  }
};

module.exports = {
  verifyKYC,
};