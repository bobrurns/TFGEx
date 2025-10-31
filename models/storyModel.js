const mongoose = require("mongoose");
const { nanoid } = require("nanoid");
const validate = require(`validator`);

const storySchema = new mongoose.Schema({
  storyId: {
    type: String,
    unique: true,
    default: () => nanoid(12),
  },
  paidOff: { type: Boolean, default: false },
  firstContact: {
    type: String,
    required: [true, "Please describe how the victim was first contacted."],
  },
  promised: {
    type: String,
    required: [
      true,
      "Please describe what was promised or advertised to the victim.",
    ],
  },
  realization: {
    type: String,
    required: [
      true,
      "Please describe how the victim realized there was little to no return on inventment.",
    ],
  },
  financialImpact: {
    type: Number,
    required: [true, "Include impact on the victim."],
  },
  communicationRecords: [String],
  financialRecords: [String],
  contractsAgreements: [String],

  victimContact: {
    type: String,
    required: [true, `Include victim email.`],
    lowercase: true,
    validate: [validate.isEmail, `Email not valid`],
  },
});

storySchema.pre(/^find/, function (next) {
  // This points to the current query
  this.find({ paidOff: { $ne: true } });
  next();
});

const Story = mongoose.model("Story", storySchema);

module.exports = Story;
