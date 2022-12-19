/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";

const { Wallets } = require("fabric-network");
const FabricCAServices = require("fabric-ca-client");
const fs = require("fs");
const path = require("path");

var registerUser = async function (res) {
  try {
    let message = {};
    const networkDataFields = res.app.locals.clientConstants;

    // Create a new CA client for interacting with the CA.
    const caInfo =
      networkDataFields.networkConfigData.certificateAuthorities[
        "ca.org1.example.com"
      ];

    // Create a new CA client for interacting with the CA.
    const ca = new FabricCAServices(caInfo.url);

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), "wallet");
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the user.
    const userIdentity = await wallet.get(res.app.locals.userID);
    if (userIdentity) {
      message = {
        status: "Error",
        code: 409,
        message: `An identity for the user ${res.app.locals.userID} already exists in the wallet`,
      };
      console.log(
        `An identity for the user ${res.app.locals.userID} already exists in the wallet`
      );
      return message;
    }

    // Check to see if we've already enrolled the admin user.
    const adminIdentity = await wallet.get("admin");
    if (!adminIdentity) {
      message = {
        status: "Error",
        code: 404,
        message:
          'An identity for the admin user "admin" does not exist in the wallet',
      };
      console.log(
        'An identity for the admin user "admin" does not exist in the wallet'
      );
      console.log("Run the enrollAdmin.js application before retrying");
      return message;
    }

    // build a user object for authenticating with the CA
    const provider = wallet
      .getProviderRegistry()
      .getProvider(adminIdentity.type);
    const adminUser = await provider.getUserContext(adminIdentity, "admin");

    // Register the user, enroll the user, and import the new identity into the wallet.
    const secret = await ca.register(
      {
        affiliation: "org1.department1",
        enrollmentID: res.app.locals.userID,
        role: "client",
        //for ATTRIBUTE BASED ACCESS TO USER, add key-value attribute while registering the user
        attrs: [{ name: "abac.creator", value: "true", ecert: true }],
      },
      adminUser
    );
    const enrollment = await ca.enroll({
      enrollmentID: res.app.locals.userID,
      enrollmentSecret: secret,
      //ATTRIBUTE KEY ADDED WHILE REGISTERING NEEDS TO BE PASSED HERE
      attr_reqs: [{ name: "abac.creator", optional: false }],
    });
    const x509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
      },
      mspId: "Org1MSP",
      type: "X.509",
    };
    await wallet.put(res.app.locals.userID, x509Identity);
    message = {
      status: "Success",
      code: 201,
      message: `Successfully registered and enrolled user ${res.app.locals.userID} and imported it into the wallet`,
    };
    console.log(
      `Successfully registered and enrolled user ${res.app.locals.userID} and imported it into the wallet`
    );
    return message;
  } catch (error) {
    console.error(`Failed to register user ${res.app.locals.userID}: ${error}`);
    let message = {
      status: "Error",
      errorType: error.errorType,
      code: error.code ? error.code : 500,
      message: error.message,
    };
    return message;
  }
};

module.exports = {
  registerUser,
};
