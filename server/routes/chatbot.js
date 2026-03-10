const express = require("express");
const router = express.Router();
const { chatWithBot } = require("../controller/chatbot");

router.post("/chat", chatWithBot);

module.exports = router;
