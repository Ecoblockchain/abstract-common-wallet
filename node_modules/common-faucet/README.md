# common-faucet

## Installation

you can install the npm module <a href="https://www.npmjs.com/package/common-faucet">here</a>

## Usage

After using npm install, require the npm module at the top of the file

```javascript
var faucet = require('common-faucet');
```
next specify the following arguments:
1. A network ie) "testnet" or "mainnet"
2. A Common Blockchain Client, see npm modules like blockypher-unofficial chain-unofficial etc.

```javascript
var faucetClient = faucet({
  network: "testnet",
  commonBlockchainClient: (one of the common blockchain objects)
});
```

## Get Testnet Coin Programmatically
You can use our common-faucet instance at http://blockai-faucet.herokuapp.com/ if you need testnet coin for
your test suites. Here is how you would do it:

```javascript
faucet.Get({
  faucetURL: "http://blockai-faucet.herokuapp.com/",
  address: (the address you want the faucet to send to)
}, callback);
```

## Functionality

```javascript
//callback for all of these functions uses the standard callback(err, resp)

faucet.Balance((some address), callback);

//use our faucet endpoint for now http://blockai-faucet.herokuapp.com/
faucet.Get({
  faucetURL: (the url to a faucet endpoint),
  address: (the address you want the faucet to send to)
}, callback);

//note this function requires a good amount of requests (or a batch request) to work.
//I tested it with common-blockcypher and it required that I specified an api key to common-blockcypher
//returns the number of milliseconds since the last transaction between the faucetAddress and destinationAddress
//if there is no tx, it returns null.
faucet.LastReceived({
  faucetAddress: (address of the faucet you wish to inspect),
  destinationAddress: (the address you wish to probe for faucet transactions)
}, callback);

faucet.Send({
  faucetWIF: (the wif of your faucet address to sign the transactions),
  amount: (amount in bitcoin you wish to send),
  destinationAddress: (the address that you wish to send the bitcoin to)
}, callback);
```





## Maintainers
* Andrew Malta: andrew.malta@yale.edu

