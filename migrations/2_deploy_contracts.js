var ArthSwapToken = artifacts.require("ArthSwapToken");
var BigNumber = require('bignumber.js');
  
module.exports = function(deployer) {
    deployer.deploy(ArthSwapToken);
};