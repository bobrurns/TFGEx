const express = require(`express`);
const viewController = require(`../controllers/viewController`);
const authController = require(`../controllers/authController`);

const router = express.Router();

router.use(authController.isLoggedIn);

router.get(`/`, viewController.getOverview);
router.get(`/how-they-work`, viewController.getHowTheyWork);
router.get(`/story/:id`, viewController.getStory);
router.get(`/stories`, viewController.getStories);
router.get(`/contact`, viewController.getContact);
router.get(`/admin__dashboard__login`, viewController.getLogin);
router.get(
  `/admin__dashboard`,
  authController.protect,
  authController.restrictTo(`admin`),
  viewController.getDash
);
module.exports = router;
