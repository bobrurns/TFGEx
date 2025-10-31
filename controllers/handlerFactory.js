const { catchAsync } = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, { paidOff: true });

    if (!doc) {
      return next(new AppError(`No document with that ID`, 404));
    }

    res.status(204).json({ status: `success`, data: null });

    console.log(`Story marked as paid off.`);
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(
      req.params.id,
      req.body,
      // Return new data to show client
      // Running validators makes sure the validators run on updating info.
      { new: true, runValidators: true }
    );

    if (!doc) {
      return next(new AppError(`No document with that ID`, 404));
    }

    res.status(200).json({ status: `success`, data: { doc } });
    console.log(`Updated data successfully`);
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: `success`,
      data: { doc },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    // Build query
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // Execute query
    const doc = await features.query;

    // Send Response
    res.status(200).json({
      status: `success`,
      results: doc.length,
      data: { data: doc },
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);

    const doc = await query;
    if (!doc) {
      return next(new AppError(`No document with that ID`, 404));
    }

    res.status(200).json({
      status: `success`,
      data: doc,
    });
  });
