var testnetCommonBlockchainTests = require('abstract-common-blockchain/tests/testnet');
var mainnetCommonBlockchainTests = require('abstract-common-blockchain/tests/mainnet');

var test = require('tape');
var blockCypherApi = require('../');

var testnetCommonBlockchain = blockCypherApi({
  network: "testnet"
});

var mainnetCommonBlockchain = blockCypherApi({
  network: "bitcoin"
});


var testnetCommon = {
  setup: function(t, cb) {
    cb(null, testnetCommonBlockchain);
  },
  teardown: function(t, testnetCommonBlockchain, cb) {
    cb();
  }
}

var mainnetCommon = {
  setup: function(t, cb) {
    cb(null, mainnetCommonBlockchain);
  },
  teardown: function(t, mainnetCommonBlockchain, cb) {
    cb();
  }
}


mainnetCommonBlockchainTests(test, mainnetCommon);
testnetCommonBlockchainTests(test, testnetCommon);