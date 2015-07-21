var commonBlockchain = require('blockcypher-unofficial')({
  network: "testnet"
});

var commonFaucet = require('common-faucet')({
  network: "testnet",
  commonBlockchain: commonBlockchain
});

function initalize (test, seed, common) {
  var address;
  common.setup(test, function (err, resp) {
    address = resp;
  });

  commonFaucet.Get({
    address: address,
    faucetURL: "http://blockai-faucet.herokuapp.com"
  },
  function (err, resp){
    if (err) {
      console.log("error getting a bit of coin from the faucet: " + err);
    }
    else {
      return(require('./tests.js').all(test, seed, common));
    }
  });
}

module.exports = initalize;
