const snarkjs = require('snarkjs');
const fs = require('fs');

const generateProof = async (inputData) => {
  try {

    const circuit = JSON.parse(fs.readFileSync('path/to/circuit.json'));
    const provingKey = fs.readFileSync('path/to/proving_key.zkey');
    const witness = snarkjs.wtns.calculate(circuit, inputData);
    const proof = await snarkjs.groth16.prove(provingKey, witness);

    const publicSignals = snarkjs.groth16.calculatePublicSignals(circuit, witness);

    return {
      proof,
      publicSignals,
    };
  } catch (error) {
    console.error('Error generating zk-SNARK proof:', error);
    throw new Error('Proof generation failed');
  }
};

const verifyProof = async (proof, publicSignals) => {
  try {
    const verificationKey = JSON.parse(fs.readFileSync('path/to/verification_key.json'));
    const isValid = await snarkjs.groth16.verify(verificationKey, publicSignals, proof);

    return isValid;
  } catch (error) {
    console.error('Error verifying zk-SNARK proof:', error);
    throw new Error('Proof verification failed');
  }
};

module.exports = {
  generateProof,
  verifyProof,
};