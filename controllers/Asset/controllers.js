// const enrollAdminUtil = require("../../utils/enrollAdmin");

const {
  CREATE_ASSET,
  UPDATE_ASSET,
  GET_ASSET_BY_ID,
  GET_ASSETS,
} = require("../../constants/constants");
const { query } = require("../../utils/query");
const { invoke } = require("../../utils/invoke");

const createAsset = async function (req, res) {
  try {
    let message;
    const { body } = req;
    if (!body) {
      message = {
        status: "Error",
        code: 400,
        message: "Body cannot be empty",
      };
      return res.status(message.code).send(message);
    }
    const { userID } = req.query;
    if (!userID) {
      message = {
        status: "Error",
        code: 404,
        message: "userID not sent",
      };
      console.log("userID not sent");
      return res.status(message.code).send(message);
    }
    res.app.locals.userID = userID;
    // const data = JSON.stringify(body);
    console.log("body:", body);
    console.log("userID:", userID);

    message = await invoke(req, res, CREATE_ASSET);
    console.log(message);

    // message = await enrollAdminUtil.enrollAdmin(res);
    return res.status(message.code).send(message);
  } catch (e) {
    let statusCode = 500;
    return res.status(statusCode).send({
      status: "Error",
      errorType: e.errorType,
      code: statusCode,
      message: e.message,
    });
  }
};

const getAssetByID = async function (req, res) {
  try {
    const { userID } = req.query;
    if (!userID) {
      message = {
        status: "Error",
        code: 404,
        message: "userID not sent",
      };
      console.log("userID not sent");
      return res.status(message.code).send(message);
    }
    res.app.locals.userID = userID;
    let { params } = req;
    if (!params.id) {
      let message = {
        code: 400,
        status: "Error",
        message: "Asset id not passed in url",
      };
      return message;
    }
    const args = params.id;
    let message = await query(res, GET_ASSET_BY_ID, args);
    res.status(message.code).send(message);
  } catch (e) {
    let statusCode = 500;
    return res.status(statusCode).send({
      status: "Error",
      errorType: e.errorType,
      code: statusCode,
      message: e.message,
    });
  }
};

const getAllAssets = async function (req, res) {
  try {
    const { userID } = req.query;
    if (!userID) {
      message = {
        status: "Error",
        code: 404,
        message: "userID not sent",
      };
      console.log("userID not sent");
      return res.status(message.code).send(message);
    }
    res.app.locals.userID = userID;
    let message = await query(res, GET_ASSETS, "");
    res.status(message.code).send(message);
  } catch (e) {
    let statusCode = 500;
    return res.status(statusCode).send({
      status: "Error",
      errorType: e.errorType,
      code: statusCode,
      message: e.message,
    });
  }
};

module.exports = { createAsset, getAssetByID, getAllAssets };
