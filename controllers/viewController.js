const Story = require(`./../models/storyModel`);
const { catchAsync } = require("../utils/catchAsync");
const appError = require("../utils/appError");

module.exports.getOverview = catchAsync(async (req, res) => {
  const stories = await Story.find();
  console.log(`someone visisted the home page`);
  res.status(200).render(`overview`, { title: `Overview`, stories });
});

module.exports.getHowTheyWork = catchAsync(async (req, res) => {
  const stories = await Story.find();
  res.status(200).render(`how-they-work`, { title: `How they work`, stories });
});

module.exports.getStory = catchAsync(async (req, res, next) => {
  const story = await Story.findOne({ storyId: req.params.id });
  const stories = await Story.find();
  console.log(story);
  if (!story) return next(new appError(`This story does not exist`, 404));

  res.status(200).render(`story`, { title: `Story`, story, stories });
});

module.exports.getStories = catchAsync(async (req, res) => {
  const stories = await Story.find();
  console.log(`someone visisted the stories`);
  res.status(200).render(`stories`, { title: `All Stories`, stories });
});

module.exports.getContact = catchAsync(async (req, res) => {
  const stories = await Story.find();
  console.log(`someone visisted the contact page`);
  res.status(200).render(`contact`, { title: `Contact`, stories });
});

module.exports.getDash = catchAsync(async (req, res) => {
  const stories = await Story.find();
  res.status(200).render(`dashboard`, { title: `Admin Dashboard`, stories });
});

module.exports.getLogin = catchAsync(async (req, res) => {
  const stories = await Story.find();

  const csp = [
    "default-src 'self';",
    "connect-src 'self' https://cdnjs.cloudflare.com ws://127.0.0.1:64996;",
    "base-uri 'self';",
    "block-all-mixed-content;",
    "font-src 'self' https: data:;",
    "frame-ancestors 'self';",
    "img-src 'self' data:;",
    "object-src 'none';",
    "script-src 'self' https://cdnjs.cloudflare.com blob:;",
    "script-src-attr 'none';",
    "style-src 'self' https: 'unsafe-inline';",
    "upgrade-insecure-requests;",
  ].join(" ");

  res
    .status(200)
    .set("Content-Security-Policy", csp)
    .render("login", { title: "Login", stories });
});
