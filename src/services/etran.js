const axios = require('axios');

const verifyCompliance = async (applicationId, borrowerData) => {
  try {
    const response = await axios.post(`${process.env.ETRAN_API_URL}/verify`, borrowerData, {
      headers: {
        'Authorization': `Bearer ${process.env.ETRAN_API_KEY}`,
      },
    });

    if (response.data.status === 'Verified') {
      return { status: 'Verified', applicationId };
    } else {
      return { status: 'Failed', applicationId };
    }
  } catch (err) {
    console.error('E-TRAN Compliance Verification Error:', err);
    return { status: 'Failed', applicationId };
  }
};

module.exports = {
  verifyCompliance,
};