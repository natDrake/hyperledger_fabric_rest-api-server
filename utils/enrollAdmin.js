/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";

const FabricCAServices = require("fabric-ca-client");
const { Wallets } = require("fabric-network");
const fs = require("fs");
const path = require("path");

var enrollAdmin = async function (res) {
  try {
    let message = {};
    const networkDataFields = res.app.locals.clientConstants;

    // Create a new CA client for interacting with the CA.
    const caInfo =
      networkDataFields.networkConfigData.certificateAuthorities[
        "ca.org1.example.com"
      ];
    // console.log(caInfo);
    const caTLSCACerts = caInfo.tlsCACerts.pem;
    // console.log(caTLSCACerts);
    const ca = new FabricCAServices(
      caInfo.url,
      { trustedRoots: caTLSCACerts, verify: false },
      caInfo.caName
    );

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), "wallet");
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the admin user.
    const identity = await wallet.get("admin");
    if (identity) {
      message = {
        status: "Error",
        code: 409,
        message:
          'An identity for the admin user "admin" already exists in the wallet',
      };
      console.log(
        'An identity for the admin user "admin" already exists in the wallet'
      );
      return message;
    }

    // Enroll the admin user, and import the new identity into the wallet.
    const enrollment = await ca.enroll({
      enrollmentID: "admin",
      enrollmentSecret: "adminpw",
    });
    const x509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
      },
      mspId: "Org1MSP",
      type: "X.509",
    };
    await wallet.put("admin", x509Identity);
    message = {
      status: "Success",
      code: 201,
      message:
        'Successfully enrolled admin user "admin" and imported it into the wallet',
    };
    console.log(
      'Successfully enrolled admin user "admin" and imported it into the wallet'
    );
    return message;
  } catch (error) {
    console.error(`Failed to enroll admin user "admin": ${error}`);
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
  enrollAdmin,
};
