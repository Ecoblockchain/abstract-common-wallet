function utility(inBrowser){
  if (inBrowser) {
    var request = require('browser-request');
  } 
  else {
    var request = require('request');
  }
   
   //returns the correct url endpoint based on network that is being used
  function getBaseURL(network){
    var baseURL;
    if (network === "testnet"){
      baseURL = "https://api.blockcypher.com/v1/btc/test3";
    } 
    else if (network === "blockcypher-testnet") {
      baseURL = "https://api.blockcypher.com/v1/bcy/test";
    } 
    else {
      baseURL = "https://api.blockcypher.com/v1/btc/main"; 
    }
    return baseURL;
  }

  //abstracted json get request caller method.
  function getFromURL(url, callback){
    request.get(url, function (err, response, body) {
      if (err) {
        console.log("error fetching info from blockcypher " + err);
        callback(err, null);
      } 
      else {
        try {
          callback(false, JSON.parse(body));
        } 
        catch(err) {
          console.log("error parsing data recieved from blockcypher");
          callback(err, null);
        }
      }
    });
  }

  function postToURL(url, body, callback){
    request({
        url: url, //URL to hit
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      }, function(err, response, body){
        if (err) {
          callback(err, null);
        } else {
          try {
            callback(false, JSON.parse(body));
          } 
          catch (err) {
            callback(err, null);
          }
        }
    });
  }

  return({
    getBaseURL: getBaseURL,
    getFromURL: getFromURL,
    postToURL: postToURL
  });
}



module.exports = utility;