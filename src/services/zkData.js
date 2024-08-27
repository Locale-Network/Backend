const axios = require('axios');
const { generateProof } = require('./zkSnarkUtils');

const storeDataWithProof = async (data) => {
  try {
    const proof = await generateProof(data);
    
    const response = await axios.post(`${process.env.DATA_WAREHOUSE_URL}/store`, { data, proof });
    return response.data;
  } catch (err) {
    console.error('zk-Data Warehouse Error:', err);
    throw new Error('Failed to store data with zk-proof');
  }
};

module.exports = {
  storeDataWithProof,
};