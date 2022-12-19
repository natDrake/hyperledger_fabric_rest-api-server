const registerUserUtil = require("../../utils/registerUser");

const registerUser = async function (req, res) {
  try {
    let message = {};
    const { userID } = req.query;
    if (!userID) {
      message = {
        status: "Error",
        code: 404,
        message: "userID for enrollment not sent",
      };
      console.log("userID for enrollment not sent");
      return res.status(message.code).send(message);
    }
    res.app.locals.userID = userID;
    message = await registerUserUtil.registerUser(res);
    return res.status(message.code).send(message);
  } catch (e) {
    req.log.error(e);
    let statusCode = e.code ? e.code : 500;
    return res.status(statusCode).send({
      status: "Error",
      errorType: e.errorType,
      code: e.code ? e.code : 500,
      message: e.message,
    });
  }
};

module.exports = { registerUser };
