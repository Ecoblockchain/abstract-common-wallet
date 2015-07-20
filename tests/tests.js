var message = "common wallet is great!";
var transactionHex = "01000000017b1eabe0209b1fe794124575ef807057c77ada2138ae4fa8d6c4de\
0398a14f3f0000000000ffffffff01f0ca052a010000001976a914cbc20a7664\
f2f69e5355aa427045bc15e7c6c77288ac00000000";

module.exports.signMessage = function(test, common) {
  test('signing a message with a private key', function(t) {
    common.setup(test, function(err, commonWallet) {
      commonWallet.signMessage(message, function(err, signedMessage) {
        t.ok(signedMessage !== null, "signed message is not null");
        // t.equal(signedMessage, expectedSignedMessage, "signed message should be " + expectedSignedMessage);
        t.end()
      });
    });
  });
}

module.exports.signTransaction = function(test, common) {
  test('signing a transaction with a wif', function(t) {
    common.setup(test, function(err, commonWallet) {
      commonWallet.signRawTransaction(transactionHex, function(err, signedHex) {
        t.ok(signedHex !== null, "signed hex is not null");
        //t.equal(signedHex, expectedSignedHex, "signed hex should be " + expectedSignedHex);
        t.end()
      });
    });
  });
}

module.exports.createTransaction = function(test, common) {
  test('create a transaction using wallet credentials', function(t) {
    common.setup(test, function(err, commonWallet) {
      commonWallet.createTransaction({
        valueInBTC: .0009,
        destinationAddress: "mghg74ZBppLfhEUmzxK4Cwt1FCqiEtYbXS",
        propagate: true
      }, function(err, signedTransactionHex) {
        t.ok(signedTransactionHex !== null, "Signed transaction hex is non-null");
        t.end()
      });
    });
  });
}

module.exports.all = function (test, common) {
  module.exports.signMessage(test, common)
  module.exports.signTransaction(test, common)
  module.exports.createTransaction(test, common)
}