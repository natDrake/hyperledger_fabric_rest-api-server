/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";

const { Gateway, Wallets } = require("fabric-network");
const fs = require("fs");
const config = require("../config");
const { channelName, walletPath, chaincodeName } = config;
const path = require("path");

var invoke = async function (req, res, fcn) {
  // Create a new gateway for connecting to our peer node.
  const gateway = new Gateway();
  try {
    // load the network configuration
    const networkDataFields = res.app.locals.clientConstants;

    // Load file system wallet for managing identities.
    // const walletPath = path.join(process.cwd(), "wallet");
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    // Check to see if we've already enrolled the user.
    const userIdentity = await wallet.get(res.app.locals.userID);
    if (!userIdentity) {
      let message = {
        status: "Error",
        code: 404,
        message: `An identity for the user ${res.app.locals.userID} does not exist. Register the user before proceeding`,
      };
      console.log(
        `An identity for the user ${res.app.locals.userID} does not exist. Register the user before proceeding`
      );
      return message;
    }

    await gateway.connect(networkDataFields.networkConfigData, {
      wallet,
      identity: res.app.locals.userID,
      discovery: { enabled: true, asLocalhost: true },
    });

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork(channelName);

    // Get the contract from the network.
    const contract = network.getContract(chaincodeName);

    // Submit the specified transaction.
    // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
    // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR12', 'Dave')
    const result = await contract.submitTransaction(
      fcn,
      req.body.ID,
      req.body.color,
      req.body.size,
      req.body.appraisedValue
    );
    // const commit = await contract.submitAsync(fcn, {
    //   arguments: [
    //     req.body.ID,
    //     req.body.color,
    //     req.body.size,
    //     req.body.appraisedValue,
    //   ],
    // });
    // const endorsedResult = utf8Decoder.decode(commit.getResult());

    // console.log(
    //   `*** Successfully submitted transaction with endorsed response: ${endorsedResult}`
    // );
    // console.log("*** Waiting for transaction commit");

    // const status = await commit.getStatus();
    // if (!status.successful) {
    //   let message = {
    //     code: 500,
    //     status: "Error",
    //     message: "Transaction failed after submitting to orderer",
    //   };
    // }

    // process response
    let final = JSON.parse(result.toString());
    if ((final != "" && final != undefined) || result.toString() == "") {
      final.code = 201;
      console.log(final);
      console.log("Transaction has been completed successfully");
      return final;
    } else {
      let message = {
        status: "Error",
        code: 500,
        message: `Transaction failed`,
      };
      return message;
    }
  } catch (error) {
    console.error(`Failed to submit transaction: ${error}`);
    let message = {
      status: "Error",
      errorType: error.errorType,
      code: error.code ? error.code : 500,
      message: error.message,
    };
    return message;
  } finally {
    // Disconnect from the gateway.
    gateway.disconnect();
  }
};

module.exports = { invoke };
