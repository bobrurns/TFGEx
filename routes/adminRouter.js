const express = require("express");
const adminController = require("./../controllers/adminController");
const authController = require(`./../controllers/authController`);
const router = express.Router();

router.post(`/login`, authController.logIn);

router.get(`/logout`, authController.logOut);

router
  .route("/")
  .post(
    authController.protect,
    authController.restrictTo(`admin`),
    adminController.uploadUStoryDocs,
    adminController.persistStoryDocs,
    adminController.uploadStory
  );

router
  .route("/:id")
  .patch(
    authController.protect,
    authController.restrictTo(`admin`),
    adminController.updateStory
  )
  .delete(
    authController.protect,
    authController.restrictTo(`admin`),
    adminController.deleteStory
  );

module.exports = router;
