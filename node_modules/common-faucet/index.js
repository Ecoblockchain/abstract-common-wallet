function Faucet(opts) {
  if (!(this instanceof Faucet)) return new Faucet(opts);

  if(!opts.network){
    console.log("required options not included. Did you declare a network?");
    return;
  }

  if(!opts.commonBlockchain){
    console.log("please specify a common blockchain client!");
    return;
  }
  
  return(require("./src/faucet.js")(opts));
}

module.exports = Faucet;