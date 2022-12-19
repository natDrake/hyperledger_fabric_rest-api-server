const enrollAdminUtil = require("../../utils/enrollAdmin");

const enrollAdmin = async function (req, res) {
  try {
    let message = await enrollAdminUtil.enrollAdmin(res);
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

module.exports = { enrollAdmin };
