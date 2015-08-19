# abstract-common-wallet
A test suite and interface you can use to implement standard Common Wallet powered applications.

Publishing a test suite as a module lets multiple modules all ensure compatibility since they use the same test suite. For example, [s3-blob-store uses abstract-blob-store](https://github.com/jb55/s3-blob-store), and so does [torrent-blob-store](https://github.com/mafintosh/torrent-blob-store), [bitstore-blob-store](https://github.com/blockai/bitstore-blob-store) and [many others](https://github.com/maxogden/abstract-blob-store#some-modules-that-use-this).

Using this module will help to create easy to consume APIs for dealing with bitcoin wallets.


## How to use

To use the test suite from this module you can `require('abstract-common-wallet/tests')`

An example of this can be found in the [test-common-wallet](https://github.com/andrewmalta13/test-common-wallet/blob/master/test/index.js) test suite.

You have to implement a setup and teardown function after declaring your common wallet object:

```js

// test-common-wallet is a simple to use wallet for intended for use in tests
var testCommonWallet = require('test-common-wallet');

// our wallet benefits from being able to interface with the blockchain
var commonBlockchain = require('blockcypher-unofficial')({
  network: "testnet",
  inBrowser: true
});

// we seed our wallet with the same text to generate the same bitcoin wallet address
var commonWallet = testCommonWallet({
  network: "testnet",
  commonBlockchain: commonBlockchain,
  seed: "someTextSeed"
});

// and then we check to see if our wallet passes all of the tests and adheres to the protocol
var common = {
  setup: function(t, cb) {
    cb(null, commonWallet);
  },
  teardown: function(t, commonWallet, cb) {
    cb();
  }
}
```

To run the tests simply pass your test module (`tap` or `tape` or any other compatible modules are supported), the seed you used to generate your commonWallet Object, and your `common` methods in:

```js
var abstractCommonWalletTests = require('abstract-common-wallet/tests')
abstractCommonWalletTests(test, seed, common)
```


A valid common wallet interface should implement the following functions. 

## Functions
```javascript
//callback should be of the form (err, response)
cw.signMessage("hey there, this is a message", callback);

//this callback should be of the form (err, signedTxHex, txid)
cw.signTransaction((some unsigned transaction hex to sign), callback);

//will create, sign, and (optionally) propagate a transaction. callback should be of (err, response)
cw.createTransaction({
  value: (the amount of btc to be transacted in satoshi),
  destinationAddress: (the address your Common Wallet object will be sending btc to),
  propagate: (true or false if you want to propagate the tx. Will default to false)
}, callback);
```

## Other Common Wallet Data

In addition to the three functions listed above, a common wallet object will also have these two fields:

```
  address: (the public address of the wallet)
  network: (the network the wallet is operating on)
```
