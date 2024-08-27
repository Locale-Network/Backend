const { exec } = require('child_process');

const compileWithSunodo = () => {
  exec('sunodo build', (err, stdout, stderr) => {
    if (err) {
      console.error('Sunodo Build Error:', err);
      return;
    }
    console.log('Sunodo Build Output:', stdout);
  });
};

module.exports = {
  compileWithSunodo,
};