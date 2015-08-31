var bitcoin = require('bitcoinjs-lib');
var hexParser = require('bitcoin-tx-hex-to-json');
var request = require('request');
var express = require('express');
var expressCommonWallet = require('express-common-wallet');

var app = express();

var __nonces = {};
var commonWalletNonceStore = {
  get: function(address, callback) {
    callback(false, __nonces[address]);
  },
  set: function(address, nonce, callback) {
    __nonces[address] = nonce;
    callback(false, true);
  }
}

app.use("/", expressCommonWallet({
  commonWalletNonceStore: commonWalletNonceStore
}));

var port = 3564;
var serverRootUrl = "http://localhost:" + port;

// generates a private key from a seed and a network. This function returns
// the same private key as the deprecated bitcoinjs-lib wallet object. This may be subject
// to change in the future.
function WIFKeyFromSeed(seed, network) {
  network = (network === "testnet") ? bitcoin.networks.testnet : null;
  var hash = bitcoin.crypto.sha256(seed);
  var hdnode = bitcoin.HDNode.fromSeedBuffer(hash, network);
  var temp = hdnode.deriveHardened(0).derive(0);
  var key = new bitcoin.ECKey(temp.derive(0).privKey.d);
  var wif = key.toWIF(network);
  return wif;
}

var message = "common wallet is great!";
var transactionHex = "01000000017b1eabe0209b1fe794124575ef807057c77ada2138ae4fa8d6c4de\
0398a14f3f0000000000ffffffff01f0ca052a010000001976a914cbc20a7664\
f2f69e5355aa427045bc15e7c6c77288ac00000000";
var walletAddress;

module.exports.signMessage = function(test, seed, common) {
  test('signing a message with a private key', function(t) {
    common.setup(test, function(err, commonWallet) {
      commonWallet.signMessage(message, function(err, signedMessage) {
        var wif = WIFKeyFromSeed(seed, commonWallet.network);
        var ECKey = bitcoin.ECKey.fromWIF(wif);
        
        walletAddress = ECKey.pub.getAddress((commonWallet.network === "testnet") ? bitcoin.networks.testnet : null).toString();

        var network = (commonWallet.network === "testnet") ? bitcoin.networks.testnet : null;
        var expectedMessage = bitcoin.Message.sign(ECKey, message, network).toString('base64');
        t.ok(signedMessage !== null, "signed message is not null");
        t.equal(signedMessage, expectedMessage, "signed message should be " + expectedMessage);
        t.end();
      });
    });
  });
}

module.exports.signTransaction = function(test, seed, common) {
  test('signing a transaction with a wif', function(t) {
    common.setup(test, function(err, commonWallet) {
      commonWallet.signRawTransaction(transactionHex, function(err, signedHex, txid) {
        var wif = WIFKeyFromSeed(seed, commonWallet.network);
        var ECKey = bitcoin.ECKey.fromWIF(wif);
        var network = (commonWallet.network === "testnet") ? bitcoin.networks.testnet : null;
        
        var transaction = bitcoin.Transaction.fromHex(transactionHex);
        transaction.sign(0, ECKey);
        var txid = transaction.getId();
        var expectedSignedHex = transaction.toHex();
        var expectedTxid = transaction.getId();

        t.ok(signedHex !== null, "signed hex is not null");
        t.equal(signedHex, expectedSignedHex, "signed hex should be " + expectedSignedHex);
        t.equal(txid, expectedTxid, "txid of signed hex should be " + expectedTxid);
        t.end();
      });
    });
  });
}

module.exports.createTransaction = function(test, seed, common) {
  test('create a transaction using wallet credentials', function(t) {
    common.setup(test, function(err, commonWallet) {
      commonWallet.createTransaction({
        value: 90000,
        destinationAddress: "mghg74ZBppLfhEUmzxK4Cwt1FCqiEtYbXS",
        propagate: true
      }, function(err, signedTransactionHex) {
        t.ok(signedTransactionHex !== null, "Signed transaction hex is non-null");
        var json = hexParser(signedTransactionHex);
        t.ok(json.vout[0].value === 90000, "transaction sends 90000 satoshi");
        t.ok(json.vout[0].scriptPubKey.addresses[0] === "mghg74ZBppLfhEUmzxK4Cwt1FCqiEtYbXS", "first output is mghg74ZBppLfhEUmzxK4Cwt1FCqiEtYbXS");
        t.ok(json.vin[0].addresses[0] === walletAddress, "transaction is sent from the wallet address");
        t.end();
      });
    });
  });
}

module.exports.additionalInfo = function(test, seed, common) {
  test('common wallet instance has an address and a network field', function(t) {
    common.setup(test, function (err, commonWallet) {
      t.ok(commonWallet.address !== null, "address is not null");
      t.ok(commonWallet.network === "testnet" || commonWallet.network === "mainnet", "network is either testnet or mainnet");
      t.end();
    });
  });
}

module.exports.login = function(test, seed, common) {
  test('common wallet instance can login', function(t) {
    common.setup(test, function (err, commonWallet) {
      var server = app.listen(port, function() {
        commonWallet.login(serverRootUrl, function(err, res, body) {
          var nonce = res.headers['x-common-wallet-nonce'];
          t.ok(nonce, "has nonce");
          server.close();
          t.end();
        });
      });
    });
  });
}

module.exports.request = function(test, seed, common) {
  test('common wallet instance can request', function(t) {
    common.setup(test, function (err, commonWallet) {
      var server = app.listen(port, function() {
        commonWallet.login(serverRootUrl, function(err, res, body) {
          var nonce = res.headers['x-common-wallet-nonce'];
          t.ok(nonce, "has nonce");
          commonWallet.request({host: serverRootUrl, path: "/nonce" }, function(err, res, body) {
            var verifiedAddress = res.headers['x-common-wallet-verified-address'];
            t.equal(commonWallet.address, verifiedAddress, "verified address");
            server.close();
            t.end();
          });
        });
      });
    });
  });
}

module.exports.all = function (test, seed, common) {
  module.exports.signMessage(test, seed, common);
  module.exports.signTransaction(test, seed, common);
  module.exports.createTransaction(test, seed, common);
  module.exports.additionalInfo(test, seed, common);
  module.exports.login(test, seed, common);
  module.exports.request(test, seed, common);
}