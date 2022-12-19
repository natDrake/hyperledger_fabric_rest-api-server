const express = require("express");
const router = express.Router();

const enrollAdminRoutes = require("./controllers/EnrollAdmin");
const registerUserRoutes = require("./controllers/RegisterUser");
const assetRoutes = require("./controllers/Asset");

router.use("/enrollAdmin", enrollAdminRoutes);
router.use("/registerUser", registerUserRoutes);
router.use("/assets", assetRoutes);

module.exports = router;
