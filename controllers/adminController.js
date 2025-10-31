const { catchAsync } = require("../utils/catchAsync");
const Story = require(`./../models/storyModel`);
const factory = require(`./handlerFactory`);

const multer = require(`multer`);

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "communication";
    if (file.fieldname === "financialRecords") folder = "financial";
    if (file.fieldname === "contractsAgreements") folder = "contracts";

    cb(null, `public/docs/${folder}`);
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split(`/`)[1];
    let prefix = "fr";
    if (file.fieldname === "communicationRecords") prefix = "cr";
    if (file.fieldname === "contractsAgreements") prefix = "ca";

    cb(null, `${prefix}-${Date.now()}.${ext}`);
  },
});

const multerFilter = (req, file, cb) => {
  if (
    !file.mimetype.startsWith("image") &&
    file.mimetype !== "application/pdf" &&
    file.mimetype !== "text/csv"
  ) {
    return cb(
      new AppError(
        "Uploaded files must be images, PDFs, or CSV documents.",
        400
      ),
      false
    );
  }
  cb(null, true);
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadUStoryDocs = upload.fields([
  { name: `communicationRecords`, maxCount: 30 },
  { name: `financialRecords`, maxCount: 30 },
  { name: `contractsAgreements`, maxCount: 30 },
]);

exports.persistStoryDocs = catchAsync(async (req, res, next) => {
  if (!req.files) return next();

  const fields = [
    "communicationRecords",
    "financialRecords",
    "contractsAgreements",
  ];

  fields.forEach((field) => {
    req.body[field] = req.files[field]?.map((file) => file.filename) || [];
  });

  next();
});

exports.uploadStory = factory.createOne(Story);

exports.deleteStory = factory.deleteOne(Story);

exports.updateStory = factory.updateOne(Story);
