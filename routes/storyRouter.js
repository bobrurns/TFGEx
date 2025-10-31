const express = require("express");
const storyController = require("./../controllers/storyController");
const router = express.Router();

router.route("/").get(storyController.getAllStories);

router.route("/:id").get(storyController.getStory);

module.exports = router;
