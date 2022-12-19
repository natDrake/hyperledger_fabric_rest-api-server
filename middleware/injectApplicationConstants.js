const config = require("../config");

/*
* checks if app.locals.clientConstants is set
* sets the value if unset
* @param clientConstants = {
    orgName: string,
    peers: array,
    channelName: string,
    chaincodeName: string
  }
*/
const { networkData } = config;

async function injectApplicationConstants(req, res, next) {
  try {
    if (res.app.locals.clientConstants) {
      next();
    } else {
      // assumption is chaincodeName and channelName will be same
      const clientConstants = {
        orgName: "Org1",
        peers: Object.keys(networkData.peers),
        networkConfigData: networkData,
      };
      res.app.locals.clientConstants = clientConstants;
      next();
    }
  } catch (e) {
    console.log(e);
  }
}

module.exports = injectApplicationConstants;
