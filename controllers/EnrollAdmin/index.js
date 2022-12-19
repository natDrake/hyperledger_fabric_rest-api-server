const express = require("express");
const router = express.Router();
const controllers = require("./controllers");

const { enrollAdmin } = controllers;

router.post("/", enrollAdmin);

module.exports = router;
