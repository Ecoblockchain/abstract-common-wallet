var request = require("request");

function Blocks(config){
  var key;
  if(config.key) {
    key = "token=" + config.key;
  } 
  else {
    key = "";
  }
  //expects a [list of block ids as strings] and a callback(err, response)
  //returns a list of json objects:
  // {
  //   "blockHex": hex of block (not supported by blockcypher at the moment),
  //   "blockId": id of the block
  // }
  //

  //** NOTE ** right now this method does virtually nothing as you are passing in ids and getting back ids, but the hope
  // is the blockcypher might one day support hex for blocks (and maybe even transactions)
  function Get(blockIds, callback){
    var responseData = [];
    var baseUrl = config.utility.getBaseURL(config.network) + "/blocks/";
    var count = 0;
    
    blockIds.forEach(function (blockId){
      var url = baseUrl + blockId + "?" + key;
      config.utility.getFromURL(url, function (err, resp){
        if (err){
          callback(err, null);
        } else if (resp.error){
          console.log("blockcypher threw an error for " + blockId);
          count++;
        } else{
          var response = {};
          response.blockHex = null;
          response.blockId = resp.hash;
          
          responseData.push(response);

          if (++count === blockIds.length){  
            callback(false, responseData);
          }
        }
      });
    });
  }

  //expects a callback(err, resp) and returns a single json object of the latest block :
  // {
  //   "blockHex": hex of block (not supported by blockcypher at the moment),
  //   "blockId": id of the block
  // }
  //
  function Latest(callback){
    var url = config.utility.getBaseURL(config.network); 
    var response = {};
    config.utility.getFromURL(url + "?" + key, function (err, resp){
      if (err) {
        callback(err, null);
      } else {
        response.blockHex = null;
        response.blockId = resp.hash;
        callback(false, response);
      }
    });
  }
  
  //not currently supported by blockcypher, but would take raw hex of a block and would propagate it to the blockchain.
  //also expects a callback(err, resp).  The resp would be the blockId of the block published if successful.
  function Propagate(blockHex, callback){
    callback({"err": "blockcypher does not provide support for propagating blocks"}, null);
  }

  //expects a [list of block ids]
  //and a callback(err, resp);

  //returns an array of txidPairs for each blockid:
  //{txid: , txId: , blockId: };
  
  //** NOTE ** blockcypher only displays up to 20 txids from the block. Those are the ones that will
  // be returned.
  function Transactions(blockIds, callback){
    // var responseData = [];
    // var baseUrl = config.utility.getBaseURL(config.network) + "/blocks/";
    // var count = 0;
    
    // blockIds.forEach(function (blockId){
    //   var url = baseUrl + blockId;
    //   config.utility.getFromURL(url, function (err, resp){
    //     if (err){
    //       callback(err, null);
    //     } else if (resp.error){
    //       console.log("blockcypher threw an error for " + blockId);
    //       count++;
    //     } else{
    //       var response = [];
    //       resp.txids.forEach(function (txid){
    //         var txidPair = {txid: txid, txId: txid, blockId: resp.hash};
            
    //         response.push(txidPair);
    //       });
    //       responseData.push(response);

    //       if (++count === blockIds.length){  
    //         callback(false, responseData);
    //       }
    //     }
    //   });
    // });
    callback({err: "not supported by blockcypher. Shows only up to 20 txs"}, null);
  }

  return{
    Get: Get,
    Latest: Latest,
    Propagate: Propagate,
    Transactions: Transactions
  };
}

module.exports = Blocks;