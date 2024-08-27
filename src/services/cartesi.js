const axios = require('axios');

const submitToCartesi = async (data) => {
  try {
    const response = await axios.post(`${process.env.CARTESI_NODE_URL}/compute`, data);
    return response.data;
  } catch (err) {
    console.error('Cartesi Roll-up Error:', err);
    throw new Error('Failed to submit data to Cartesi Roll-up');
  }
};

module.exports = {
  submitToCartesi,
};