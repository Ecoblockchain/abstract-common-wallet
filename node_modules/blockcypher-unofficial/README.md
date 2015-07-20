# blockcypher-unofficial

## Installation

you can install the npm module <a href="https://www.npmjs.com/package/blockcypher-unofficial">here</a>

```
npm install blockcypher-unofficial
```

<a href="https://github.com/blockai/abstract-common-blockchain">See abstract-common-blockchain for API</a>

## BlockCyphers's Abstract Common Blockchain Coverage 
  <a href="http://abstract-common-blockchain.herokuapp.com"> Use this link to see what BlockCypher supports </a>


## Convention

Standard convention is described fully in the types.json file in the link above.

## Usage

simply require the npm module at the top of the file
```javascript
var blockcypher = require('blockcypher-unofficial');
```
##Networks
This adapter supports testnet, mainnet, and blockcyphers testnet. You may access each network by setting the network option to 
one of these options:

testnet3: "testnet",
Blockcypher's testnet: "blockcypher-testnet",
mainnet: (anything but other two)

you may specify the options you wish to make a call like so:

```javascript
var client = blockcypher({
  network: "testnet"
});

//example call
client.Addresses.Unspents(["address 1", "address 2", ...], callback);
```

alternatively you can check out the comments above each function in lib if you wish to understand what each function expects and returns.

## Maintainers
* Andrew Malta: andrew.malta@yale.edu
* Howard Wu: howardwu@berkeley.edu



