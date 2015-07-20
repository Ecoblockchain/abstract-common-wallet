var bitcoin = require('./bitcoin.js');
var request = require('request');

function getTxids(client, options, callback){
  if (!options.faucetAddress || !options.destinationAddress) {
    callback("insufficient arguments supplied", null);
  }
  var txids = [];
  var faucetTransactionTimes = [];
  client.Addresses.Transactions([options.destinationAddress], function (err, resp) {
    if (err) {
      callback(err, null);
    }
    else {
      for(var i = 0; i < resp[0].length; i++) {
        txids.push(resp[0][i].txid);
      }
      callback(false, txids);
    }
  });
}

function filterTransactions(client, txids, options, callback) {
  var faucetTransactionTimes = [];
  client.Transactions.Get(txids, function (err, resp){
    if (err) {
      callback(err, null);
    }
    else {
      for(var i = 0; i < resp.length; i++) {
        if (resp[i].vin[0].addresses && (resp[i].vin[0].addresses[0] === options.faucetAddress)) {
          faucetTransactionTimes.push((new Date().getTime()) - resp[i].timeReceived);
        }
      }
      callback(false, ((faucetTransactionTimes.length > 0) ? Math.min.apply(Math, faucetTransactionTimes) : null));
    }
  });
}

var Faucet = function (opts) { 
  var Balance = function(address, callback){
    if (!address) {
      callback("no address specified", null);
    }
    else {
      opts.commonBlockchain.Addresses.Summary([address], function (err, resp) {
        if (err) {
          callback("error retrieving balance from the address that was given", null);
        }
        else {
          callback(false, resp[0].balance);
        }
      });
    }
  }
  
  var Get = function(options, callback){
    if (!options.address || !options.faucetURL) {
      callback("insuffiecient arguments", null);
    }
    else {
      var url = options.faucetURL + "?address=" + options.address;
      console.log(url);
      request.get(url, function (err, response, body) {
        if (err) {
          console.log("error getting coin from the faucet " + err);
          callback(err, null);
        } 
        else {
          callback(false, body);
        }
      });
    }
  }

  //a function to see if a specific address has received coin(s) from the specified faucet address
  //if so it will return how long ago (in milliseconds) otherwise null.

  //Warning, blockcypher limits your requests pretty heavily if you dont have a api key (get one to perform this funcition)
  var LastReceived = function(options, callback) {
    getTxids(opts.commonBlockchain, options, function (err, txids) {
      filterTransactions(opts.commonBlockchain, txids, options, function (err, resp){
        callback(err, resp);
      });
    });
  }

  var Send = function (options, callback){
    if (!options.faucetWIF || !options.amount || !options.destinationAddress) {
      callback("missing arguments", null);
    }
    else {
      var faucetAddress = bitcoin.getAddressFromWIF(options.faucetWIF, opts.network);
      if (faucetAddress === null) {
        callback("invalid faucet wif", null);
      }
      else {
        opts.commonBlockchain.Addresses.Unspents([faucetAddress], function (err, resp){
          if (err) {
            callback("error getting unspents from address", null);
          }
          else {
            var buildTxOptions = {
              amountForDestinationInBTC: options.amount,
              destinationAddress: options.destinationAddress,
              network: opts.network,
              propagateCallback: opts.commonBlockchain.Transactions.Propagate,
              rawUnspentOutputs: resp[0],
              sourceWIF: options.faucetWIF
            };
            bitcoin.buildTransaction(buildTxOptions, function (error, response){
              if (error) { 
                callback(error, null);
              }
              else {
                callback(false, response);
              }
            });
          }
        });
      } 
    }
  }

  return({
    Send: Send,
    Balance: Balance,
    Get: Get,
    LastReceived: LastReceived
  });
};

module.exports = Faucet;