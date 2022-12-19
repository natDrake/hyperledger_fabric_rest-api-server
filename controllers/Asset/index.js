const express = require("express");
const router = express.Router();
const controllers = require("./controllers");

const { createAsset, updateAsset, getAssetByID, getAllAssets } = controllers;

router.post("/", createAsset);
// router.patch("/:id", updateAsset);
router.get("/:id", getAssetByID);
router.get("/", getAllAssets);

module.exports = router;
