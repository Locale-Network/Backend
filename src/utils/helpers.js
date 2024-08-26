const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const generateAuthToken = ({ uid, email }) => {
  const options = {
    expiresIn: '1h'
  };

  return jwt.sign({ uid, email }, process.env.TOKEN_SECRET, options);
};

const verifyAuthToken = (token) => {
  try {
    return jwt.verify(token, process.env.TOKEN_SECRET);
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return 'Token has expired';
    } else if (error instanceof jwt.JsonWebTokenError) {
      return 'Invalid token';
    } else {
      return 'Token verification failed';
    }
  }
}

const generateHashString = async (rawString) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(rawString, salt);
  return hash;
};

const validatePassword = async (rawPassword, hashPassword) => await bcrypt.compare(rawPassword, hashPassword);

const randomOTPGenerator = () => Math.floor(100000 + Math.random() * 900000);

module.exports = {
  generateAuthToken,
  verifyAuthToken,
  generateHashString,
  randomOTPGenerator,
  validatePassword,
};