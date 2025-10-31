const Story = require(`./../models/storyModel`);
const { catchAsync } = require("../utils/catchAsync");
const { getAll, getOne } = require("./handlerFactory");

exports.getAllStories = catchAsync(async (req, res, next) => {
  const { search } = req.query;

  let filter = {};

  if (search) {
    if (search.includes(",")) {
      const searchTerms = search.split(",").map((term) => term.trim());
      // Search for multiple storyIds or emails
      filter = {
        $or: [
          { storyId: { $in: searchTerms } },
          { victimContact: { $in: searchTerms } },
        ],
      };
    } else {
      // Single search term - check both storyId and victimContact
      filter = {
        $or: [
          { storyId: search },
          { victimContact: search },
          { storyId: { $regex: search, $options: "i" } },
          { victimContact: { $regex: search, $options: "i" } },
        ],
      };
    }
  }

  const stories = await Story.find(filter);

  res.status(200).json({
    status: "success",
    results: stories.length,
    data: { data: stories },
  });
});

exports.getStory = getOne(Story);
