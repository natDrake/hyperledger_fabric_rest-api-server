const express = require("express");
const router = express.Router();
const controllers = require("./controllers");

const { registerUser } = controllers;

router.post("/", registerUser);

module.exports = router;
